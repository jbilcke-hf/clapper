import { expect, test, vi } from 'vitest'
import {
  fetchComfyIcuRun,
  isComfyIcuRunComplete,
  pollComfyIcuRun,
} from './runLifecycle'

const jsonResponse = (body: unknown, status = 200, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), { status, headers })

test.each(['COMPLETED', 'completed', 'SUCCESS', 'done'])(
  'recognizes completed status %s case-insensitively',
  (status) => {
    expect(isComfyIcuRunComplete(status)).toBe(true)
  }
)

test('does not retry a submission POST after a transient server response', async () => {
  const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ error: 'busy' }, 503))

  await expect(
    fetchComfyIcuRun(
      'https://comfy.icu/submit',
      { method: 'POST' },
      { fetchImpl }
    )
  ).rejects.toThrow('busy')

  expect(fetchImpl).toHaveBeenCalledTimes(1)
})

test('retries a transient polling GET and honors Retry-After', async () => {
  const fetchImpl = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse({ message: 'busy' }, 503, { 'retry-after': '0' }))
    .mockResolvedValueOnce(jsonResponse({ id: 'run-1', status: 'COMPLETED' }))
  const sleepImpl = vi.fn().mockResolvedValue(undefined)

  const run = await fetchComfyIcuRun(
    'https://comfy.icu/status',
    { method: 'GET' },
    { fetchImpl, retryTransient: true, sleepImpl }
  )

  expect(run.status).toBe('COMPLETED')
  expect(fetchImpl).toHaveBeenCalledTimes(2)
  expect(sleepImpl).toHaveBeenCalledWith(0)
})

test('polls until completion and returns the terminal response', async () => {
  const fetchImpl = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse({ id: 'run-1', status: 'QUEUED' }))
    .mockResolvedValueOnce(
      jsonResponse({
        id: 'run-1',
        status: 'COMPLETED',
        output: [{ url: 'https://cdn.example/result.png' }],
      })
    )
  const sleepImpl = vi.fn().mockResolvedValue(undefined)

  const run = await pollComfyIcuRun({
    apiKey: 'test-key',
    workflowId: 'workflow-1',
    runId: 'run-1',
    fetchImpl,
    sleepImpl,
  })

  expect(run.output?.[0].url).toBe('https://cdn.example/result.png')
  expect(fetchImpl).toHaveBeenCalledTimes(2)
  expect(sleepImpl).toHaveBeenCalledTimes(2)
})

test('surfaces a malformed JSON response with HTTP context', async () => {
  const fetchImpl = vi
    .fn()
    .mockResolvedValue(new Response('<html>upstream error</html>', { status: 502 }))

  await expect(
    fetchComfyIcuRun(
      'https://comfy.icu/status',
      { method: 'GET' },
      { fetchImpl }
    )
  ).rejects.toThrow('non-JSON data (HTTP 502)')
})
