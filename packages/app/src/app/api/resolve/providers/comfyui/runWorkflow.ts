import type { ComfyUIWorkflowApiJson } from './types'

type Asset = { filename: string; subfolder?: string; type?: string }
type Output = {
  images?: Asset[]
  videos?: Asset[]
  gifs?: Asset[]
  audio?: Asset[]
}
type History = {
  outputs?: Record<string, Output>
  status?: {
    completed?: boolean
    status_str?: string
    messages?: [string, unknown][]
  }
}

export type WorkflowRunOptions = {
  baseUrl: string
  clientId: string
  username?: string
  password?: string
  prompt: ComfyUIWorkflowApiJson
  outputNode: string
  kind: 'image' | 'video' | 'audio'
  timeoutMs?: number
  pollMs?: number
  maxAssetBytes?: number
  fetchImpl?: typeof fetch
}

/** Run a native ComfyUI API graph using the server's queue/history/view API.
 * No global /interrupt: timing out one request must not cancel another user's job.
 */
export async function runWorkflow(
  options: WorkflowRunOptions
): Promise<string> {
  const base = new URL(options.baseUrl)
  if (
    !['http:', 'https:'].includes(base.protocol) ||
    base.username ||
    base.password
  ) {
    throw new Error(
      'ComfyUI URL must use HTTP(S); enter credentials in the authentication fields.'
    )
  }
  base.search = ''
  base.hash = ''
  base.pathname = `${base.pathname.replace(/\/$/, '')}/`
  const fetchImpl = options.fetchImpl || fetch
  const headers = new Headers()
  if (options.username) {
    headers.set(
      'Authorization',
      `Basic ${Buffer.from(`${options.username}:${options.password || ''}`).toString('base64')}`
    )
  }
  const signal = AbortSignal.timeout(options.timeoutMs ?? 10 * 60 * 1000)
  const request = async (path: string, init: RequestInit = {}) => {
    const requestHeaders = new Headers(headers)
    new Headers(init.headers).forEach((value, key) =>
      requestHeaders.set(key, value)
    )
    const response = await fetchImpl(new URL(path, base), {
      ...init,
      headers: requestHeaders,
      signal,
      redirect: 'error',
    })
    if (!response.ok)
      throw new Error(
        `ComfyUI ${path.split('?')[0]} failed (HTTP ${response.status}). Check the server and workflow nodes.`
      )
    return response
  }
  try {
    // Standard LoadImage nodes expect an uploaded filename, not a base64 string.
    const prompt = structuredClone(options.prompt)
    for (const node of Object.values(prompt)) {
      const value = node.inputs?.image
      if (
        node.class_type === 'LoadImage' &&
        typeof value === 'string' &&
        value.startsWith('data:image/')
      ) {
        const match =
          /^data:(image\/[\w.+-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(value)
        if (!match)
          throw new Error(
            'The ComfyUI input image is not a base64 image data URI.'
          )
        const bytes = Buffer.from(match[2], 'base64')
        if (bytes.length > (options.maxAssetBytes ?? 64 * 1024 * 1024))
          throw new Error('ComfyUI input image exceeds the size limit.')
        const form = new FormData()
        form.set(
          'image',
          new Blob([bytes], { type: match[1] }),
          `clapper-${crypto.randomUUID()}.${match[1].split('/')[1].replace('jpeg', 'jpg')}`
        )
        form.set('type', 'input')
        const uploaded = await (
          await request('upload/image', { method: 'POST', body: form })
        ).json()
        if (typeof uploaded.name !== 'string' || !uploaded.name)
          throw new Error('ComfyUI did not return an uploaded image name.')
        node.inputs!.image = [uploaded.subfolder, uploaded.name]
          .filter(Boolean)
          .join('/')
      }
    }
    const queued = await (
      await request('prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, client_id: options.clientId }),
      })
    ).json()
    if (
      typeof queued.prompt_id !== 'string' ||
      !queued.prompt_id ||
      (queued.node_errors && Object.keys(queued.node_errors).length)
    ) {
      throw new Error(
        'ComfyUI rejected the workflow. Check installed models, custom nodes, and input values.'
      )
    }
    let history: History | undefined
    while (!history) {
      signal.throwIfAborted()
      const result = await (
        await request(`history/${encodeURIComponent(queued.prompt_id)}`)
      ).json()
      const entry: History | undefined = result[queued.prompt_id]
      if (
        entry?.status?.status_str === 'error' ||
        entry?.status?.messages?.some(([kind]) =>
          ['execution_error', 'execution_interrupted'].includes(kind)
        )
      ) {
        throw new Error(
          'ComfyUI failed while executing this workflow. See the ComfyUI server log for the failing node.'
        )
      }
      if (entry?.status?.completed || (entry?.outputs && !entry.status)) {
        history = entry
      } else {
        await new Promise<void>((resolve, reject) => {
          const onAbort = () => {
            clearTimeout(timer)
            reject(signal.reason)
          }
          const timer = setTimeout(() => {
            signal.removeEventListener('abort', onAbort)
            resolve()
          }, options.pollMs ?? 1000)
          signal.addEventListener('abort', onAbort, { once: true })
          if (signal.aborted) onAbort()
        })
      }
    }
    const output = history.outputs?.[options.outputNode]
    const keys: (keyof Output)[] =
      options.kind === 'audio'
        ? ['audio']
        : options.kind === 'video'
          ? ['videos', 'gifs', 'images']
          : ['images']
    const asset = keys
      .flatMap((key) => output?.[key] || [])
      .find((item) => typeof item?.filename === 'string' && item.filename)
    if (!asset)
      throw new Error(
        `The selected ComfyUI output node produced no ${options.kind} file. Select a Save output node.`
      )
    const params = new URLSearchParams({
      filename: asset.filename,
      subfolder: asset.subfolder || '',
      type: asset.type || 'output',
    })
    const response = await request(`view?${params}`)
    const limit = options.maxAssetBytes ?? 64 * 1024 * 1024
    if (Number(response.headers.get('content-length')) > limit)
      throw new Error('ComfyUI output exceeds the size limit.')
    const reader = response.body?.getReader()
    if (!reader) throw new Error('ComfyUI returned an empty output response.')
    const chunks: Uint8Array[] = []
    let size = 0
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        size += value.byteLength
        if (size > limit)
          throw new Error('ComfyUI output exceeds the size limit.')
        chunks.push(value)
      }
    } finally {
      await reader.cancel()
      reader.releaseLock()
    }
    const mime = (response.headers.get('content-type') || '')
      .split(';')[0]
      .trim()
    if (!size || !/^(image|video|audio)\/[\w.+-]+$/.test(mime))
      throw new Error('ComfyUI did not return a supported media file.')
    if (
      (options.kind === 'audio' && !mime.startsWith('audio/')) ||
      (options.kind === 'image' && !mime.startsWith('image/')) ||
      (options.kind === 'video' &&
        !mime.startsWith('video/') &&
        mime !== 'image/gif')
    ) {
      throw new Error(
        `ComfyUI returned ${mime} instead of ${options.kind}. Check the selected output node.`
      )
    }
    return `data:${mime};base64,${Buffer.concat(chunks).toString('base64')}`
  } catch (error) {
    if (signal.aborted)
      throw new Error(
        'ComfyUI generation timed out. The server job may still be running; check its queue before retrying.'
      )
    throw error
  }
}
