import { ClapInputValue } from '@aitube/clap'

type ComfyUiCredentials = {
  username?: string
  password?: string
  bearerToken?: string
}

type QueuePromptResponse = {
  prompt_id?: string
  number?: number
  node_errors?: Record<string, unknown>
}

export type ComfyUiOutputAsset = {
  filename: string
  subfolder?: string
  type?: string
  format?: string
}

export type ComfyUiRunResult = {
  promptId: string
  history: any
  assets: ComfyUiOutputAsset[]
}

export class ComfyUiClient {
  private readonly baseUrl: string
  private readonly clientId: string
  private readonly headers: Record<string, string>

  constructor({
    apiUrl,
    clientId,
    credentials = {},
  }: {
    apiUrl: string
    clientId: string
    credentials?: ComfyUiCredentials
  }) {
    this.baseUrl = normalizeComfyUiUrl(apiUrl || 'http://localhost:8188')
    this.clientId = clientId || 'clapper'
    this.headers = createAuthHeaders(credentials)
  }

  async uploadImage({
    dataUri,
    filename = `clapper-${Date.now()}.png`,
  }: {
    dataUri: string
    filename?: string
  }): Promise<string> {
    const { mimeType, bytes } = parseDataUri(dataUri)
    const form = new FormData()
    form.append('image', new Blob([bytes], { type: mimeType }), filename)
    form.append('overwrite', 'true')

    const response = await fetch(`${this.baseUrl}/upload/image`, {
      method: 'POST',
      headers: this.headers,
      body: form,
    })

    if (!response.ok) {
      throw new Error(
        `ComfyUI image upload failed (${response.status}): ${await response.text()}`
      )
    }

    const result = await response.json()
    return result?.name || filename
  }

  async runPrompt(prompt: Record<string, unknown>): Promise<ComfyUiRunResult> {
    const queued = await this.queuePrompt(prompt)
    if (!queued.prompt_id) {
      throw new Error(
        `ComfyUI did not return a prompt_id: ${JSON.stringify(queued)}`
      )
    }

    const history = await this.waitForHistory(queued.prompt_id)
    const assets = extractComfyUiOutputAssets(history)

    return {
      promptId: queued.prompt_id,
      history,
      assets,
    }
  }

  async readAssetAsDataUri(asset: ComfyUiOutputAsset): Promise<string> {
    const url = new URL(`${this.baseUrl}/view`)
    url.searchParams.set('filename', asset.filename)
    if (asset.subfolder) url.searchParams.set('subfolder', asset.subfolder)
    if (asset.type) url.searchParams.set('type', asset.type)
    if (asset.format) url.searchParams.set('format', asset.format)

    const response = await fetch(url.toString(), { headers: this.headers })
    if (!response.ok) {
      throw new Error(
        `ComfyUI asset fetch failed (${response.status}): ${await response.text()}`
      )
    }

    const contentType =
      response.headers.get('content-type') ||
      inferMimeTypeFromFilename(asset.filename)
    const buffer = Buffer.from(await response.arrayBuffer())
    return `data:${contentType};base64,${buffer.toString('base64')}`
  }

  private async queuePrompt(
    prompt: Record<string, unknown>
  ): Promise<QueuePromptResponse> {
    const response = await fetch(`${this.baseUrl}/prompt`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        prompt,
      }),
    })

    if (!response.ok) {
      throw new Error(
        `ComfyUI prompt queue failed (${response.status}): ${await response.text()}`
      )
    }

    const result = (await response.json()) as QueuePromptResponse
    if (result.node_errors && Object.keys(result.node_errors).length) {
      throw new Error(
        `ComfyUI rejected workflow nodes: ${JSON.stringify(result.node_errors)}`
      )
    }
    return result
  }

  private async waitForHistory(promptId: string): Promise<any> {
    const timeoutAt = Date.now() + 1000 * 60 * 60

    while (Date.now() < timeoutAt) {
      const response = await fetch(`${this.baseUrl}/history/${promptId}`, {
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(
          `ComfyUI history fetch failed (${response.status}): ${await response.text()}`
        )
      }

      const history = await response.json()
      const promptHistory = history?.[promptId]

      if (promptHistory?.status?.status_str === 'error') {
        throw new Error(
          `ComfyUI workflow failed: ${JSON.stringify(promptHistory.status)}`
        )
      }

      if (promptHistory?.outputs && Object.keys(promptHistory.outputs).length) {
        return promptHistory
      }

      await sleep(1000)
    }

    throw new Error(`Timed out waiting for ComfyUI prompt ${promptId}`)
  }
}

export function normalizeComfyUiPromptValue(value: ClapInputValue) {
  if (value && typeof value === 'object' && 'id' in value) {
    return value.id
  }
  return value
}

export function extractComfyUiOutputAssets(
  history: any,
  preferredOutputNodeId?: string
): ComfyUiOutputAsset[] {
  const outputs = history?.outputs || {}
  const preferredOutput =
    preferredOutputNodeId && outputs[preferredOutputNodeId]
      ? [outputs[preferredOutputNodeId]]
      : []
  const fallbackOutputs = Object.entries(outputs)
    .filter(([nodeId]) => nodeId !== preferredOutputNodeId)
    .map(([, output]) => output)

  return [...preferredOutput, ...fallbackOutputs].flatMap(extractOutputAssets)
}

function extractOutputAssets(output: any): ComfyUiOutputAsset[] {
  return ['images', 'videos', 'gifs', 'audio', 'audios', 'files'].flatMap(
    (key) => {
      const items = output?.[key]
      if (!Array.isArray(items)) return []
      return items
        .filter((item) => item?.filename)
        .map((item) => ({
          filename: item.filename,
          subfolder: item.subfolder || '',
          type: item.type || 'output',
          format: item.format,
        }))
    }
  )
}

function normalizeComfyUiUrl(apiUrl: string): string {
  return apiUrl.replace(/\/+$/, '')
}

function createAuthHeaders({
  username,
  password,
  bearerToken,
}: ComfyUiCredentials): Record<string, string> {
  const headers: Record<string, string> = {}

  if (bearerToken) {
    headers.authorization = `Bearer ${bearerToken}`
  } else if (username) {
    headers.authorization = `Basic ${Buffer.from(
      `${username}:${password || ''}`
    ).toString('base64')}`
  }

  return headers
}

function parseDataUri(dataUri: string): {
  mimeType: string
  bytes: Uint8Array
} {
  const [metadata, payload] = dataUri.split(',')
  if (!metadata?.startsWith('data:') || !payload) {
    throw new Error('Expected a data URI for ComfyUI image upload')
  }

  const mimeType = metadata.slice(5).split(';')[0] || 'image/png'
  return {
    mimeType,
    bytes: Uint8Array.from(Buffer.from(payload, 'base64')),
  }
}

function inferMimeTypeFromFilename(filename: string): string {
  const extension = filename.toLowerCase().split('.').pop()
  switch (extension) {
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    case 'mp4':
      return 'video/mp4'
    case 'webm':
      return 'video/webm'
    case 'mp3':
      return 'audio/mpeg'
    case 'wav':
      return 'audio/wav'
    case 'ogg':
      return 'audio/ogg'
    default:
      return 'application/octet-stream'
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
