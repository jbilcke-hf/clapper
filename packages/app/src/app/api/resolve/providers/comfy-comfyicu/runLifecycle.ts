type ComfyIcuRunResponse = {
  id?: string
  run_id?: string
  status?: string
  message?: string
  error?: string
  output?: Array<{
    filename?: string
    url?: string
    thumbnail_url?: string
  }>
}

type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>

type PollOptions = {
  apiKey: string
  workflowId: string
  runId: string
  timeoutMs?: number
  pollIntervalMs?: number
  fetchImpl?: FetchLike
  sleepImpl?: (ms: number) => Promise<void>
  now?: () => number
}

const COMPLETE_STATUSES = new Set([
  'complete',
  'completed',
  'success',
  'succeeded',
  'done',
])

const FAILED_STATUSES = new Set([
  'error',
  'failed',
  'failure',
  'cancelled',
  'canceled',
  'aborted',
  'expired',
  'rejected',
])

const MAX_GET_RETRIES = 3

export function isComfyIcuRunComplete(status?: string): boolean {
  return !!status && COMPLETE_STATUSES.has(status.trim().toLowerCase())
}

function isComfyIcuRunFailed(status?: string): boolean {
  return !!status && FAILED_STATUSES.has(status.trim().toLowerCase())
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object') {
    const value = body as { message?: unknown; error?: unknown }
    if (typeof value.message === 'string' && value.message) return value.message
    if (typeof value.error === 'string' && value.error) return value.error
  }
  return fallback
}

function retryDelay(response: Response, attempt: number): number {
  const retryAfter = response.headers.get('retry-after')
  if (retryAfter) {
    const seconds = Number(retryAfter)
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000)

    const date = Date.parse(retryAfter)
    if (Number.isFinite(date)) return Math.max(0, date - Date.now())
  }

  return Math.min(1000 * 2 ** attempt, 8000)
}

async function readResponse(response: Response): Promise<ComfyIcuRunResponse> {
  const body = await response.text()
  let parsed: unknown

  try {
    parsed = body ? JSON.parse(body) : {}
  } catch {
    throw new Error(
      `Comfy.icu returned non-JSON data (HTTP ${response.status}): ${body.slice(0, 300)}`
    )
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(parsed, `Comfy.icu request failed (HTTP ${response.status})`)
    )
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Comfy.icu returned an invalid run response')
  }

  const run = parsed as ComfyIcuRunResponse
  if (isComfyIcuRunFailed(run.status)) {
    throw new Error(getErrorMessage(run, 'Comfy.icu workflow run failed'))
  }

  return run
}

/**
 * Submit requests are deliberately not retried: a timed-out POST may already
 * have created and billed a run. Polling GETs may safely retry transient errors.
 */
export async function fetchComfyIcuRun(
  url: string,
  init: RequestInit,
  options: {
    fetchImpl?: FetchLike
    retryTransient?: boolean
    sleepImpl?: (ms: number) => Promise<void>
  } = {}
): Promise<ComfyIcuRunResponse> {
  const fetchImpl = options.fetchImpl || fetch
  const sleepImpl =
    options.sleepImpl || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)))
  const retryTransient = options.retryTransient === true
  const maxAttempts = retryTransient ? MAX_GET_RETRIES + 1 : 1

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetchImpl(url, init)

    if (
      retryTransient &&
      (response.status === 429 || response.status >= 500) &&
      attempt < maxAttempts - 1
    ) {
      const delay = retryDelay(response, attempt)
      await sleepImpl(delay)
      continue
    }

    return readResponse(response)
  }

  throw new Error('Comfy.icu request failed after transient retries')
}

export async function pollComfyIcuRun(
  options: PollOptions
): Promise<ComfyIcuRunResponse> {
  const {
    apiKey,
    workflowId,
    runId,
    timeoutMs = 4 * 60_000,
    pollIntervalMs = 2_000,
    fetchImpl = fetch,
    sleepImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    now = Date.now,
  } = options

  const startedAt = now()
  const url = `https://comfy.icu/api/v1/workflows/${encodeURIComponent(workflowId)}/runs/${encodeURIComponent(runId)}`

  while (now() - startedAt < timeoutMs) {
    await sleepImpl(pollIntervalMs)

    const run = await fetchComfyIcuRun(
      url,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        method: 'GET',
      },
      { fetchImpl, retryTransient: true, sleepImpl }
    )

    if (isComfyIcuRunComplete(run.status)) return run
  }

  throw new Error(
    `Timed out waiting for Comfy.icu run ${runId} after ${timeoutMs}ms`
  )
}
