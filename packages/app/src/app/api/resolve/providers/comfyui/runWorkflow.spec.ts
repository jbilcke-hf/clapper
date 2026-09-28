// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { runWorkflow, type WorkflowRunOptions } from './runWorkflow'

const graph = {
  '1': { class_type: 'SaveImage', inputs: { filename_prefix: 'clapper' } },
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
const output = (key = 'images', filename = 'frame 1.png') => ({
  p1: {
    status: { completed: true, status_str: 'success' },
    outputs: {
      '1': { [key]: [{ filename, subfolder: 'a/b', type: 'output' }] },
    },
  },
})
function harness(
  responses: Response[],
  overrides: Partial<WorkflowRunOptions> = {}
) {
  const fetchImpl = vi.fn(async () => {
    const next = responses.shift()
    if (!next) throw new Error('unexpected request')
    return next
  })
  return {
    fetchImpl,
    run: () =>
      runWorkflow({
        baseUrl: 'http://localhost:8188/comfy/',
        clientId: 'test-client',
        prompt: graph,
        outputNode: '1',
        kind: 'image',
        pollMs: 1,
        fetchImpl: fetchImpl as typeof fetch,
        ...overrides,
      }),
  }
}

describe('ComfyUI server protocol', () => {
  it('queues exact graph, waits for completion, and fetches only the selected output with credentials', async () => {
    const h = harness(
      [
        json({ prompt_id: 'p1' }),
        json({}),
        json(output()),
        new Response('image-bytes', {
          headers: { 'content-type': 'image/png' },
        }),
      ],
      { username: 'tester', password: 'secret' }
    )
    expect(await h.run()).toBe(
      `data:image/png;base64,${Buffer.from('image-bytes').toString('base64')}`
    )
    const calls = h.fetchImpl.mock.calls as unknown as [URL, RequestInit][]
    expect(calls.map(([url]) => url.pathname)).toEqual([
      '/comfy/prompt',
      '/comfy/history/p1',
      '/comfy/history/p1',
      '/comfy/view',
    ])
    expect(JSON.parse(calls[0][1].body as string)).toEqual({
      prompt: graph,
      client_id: 'test-client',
    })
    expect(calls[3][0].searchParams.get('filename')).toBe('frame 1.png')
    for (const [, init] of calls) {
      expect(new Headers(init.headers).get('Authorization')).toBe(
        `Basic ${Buffer.from('tester:secret').toString('base64')}`
      )
      expect(init.redirect).toBe('error')
    }
  })
  it.each([
    ['audio', 'audio', 'audio/wav'],
    ['video', 'videos', 'video/mp4'],
    ['video', 'gifs', 'image/gif'],
  ] as const)('retrieves %s output from %s', async (kind, key, mime) => {
    const h = harness(
      [
        json({ prompt_id: 'p1' }),
        json(output(key)),
        new Response('bytes', { headers: { 'content-type': mime } }),
      ],
      { kind }
    )
    expect(await h.run()).toContain(`data:${mime};base64,`)
  })
  it('uploads stock LoadImage input and does not mutate the caller graph', async () => {
    const prompt = {
      '1': graph['1'],
      '2': {
        class_type: 'LoadImage',
        inputs: { image: 'data:image/png;base64,aW1hZ2U=' },
      },
    }
    const h = harness(
      [
        json({ name: 'upload.png', subfolder: 'generated' }),
        json({ prompt_id: 'p1' }),
        json(output()),
        new Response('x', { headers: { 'content-type': 'image/png' } }),
      ],
      { prompt }
    )
    await h.run()
    const calls = h.fetchImpl.mock.calls as unknown as [URL, RequestInit][]
    expect(calls[0][0].pathname).toBe('/comfy/upload/image')
    expect((calls[0][1].body as FormData).get('image')).toBeInstanceOf(Blob)
    expect(
      JSON.parse(calls[1][1].body as string).prompt['2'].inputs.image
    ).toBe('generated/upload.png')
    expect(prompt['2'].inputs.image).toContain('data:image/png')
  })
  it('does not mistake partial outputs for completed execution', async () => {
    const entry = output()
    entry.p1.status.completed = false
    const h = harness([
      json({ prompt_id: 'p1' }),
      json(entry),
      json(output()),
      new Response('x', { headers: { 'content-type': 'image/png' } }),
    ])
    await h.run()
    expect(h.fetchImpl).toHaveBeenCalledTimes(4)
  })
  it('reports queue validation failures', async () => {
    await expect(
      harness([
        json({ prompt_id: 'p1', node_errors: { '1': ['missing model'] } }),
      ]).run()
    ).rejects.toThrow('rejected')
  })
  it('reports execution errors without waiting forever', async () => {
    await expect(
      harness([
        json({ prompt_id: 'p1' }),
        json({ p1: { status: { status_str: 'error' } } }),
      ]).run()
    ).rejects.toThrow('failed while executing')
  })
  it('does not use another output node as a silent fallback', async () => {
    await expect(
      harness([json({ prompt_id: 'p1' }), json(output())], {
        outputNode: 'missing',
      }).run()
    ).rejects.toThrow('produced no image')
  })
  it('rejects non-media and mismatched content', async () => {
    await expect(
      harness([
        json({ prompt_id: 'p1' }),
        json(output()),
        new Response('<html>login</html>', {
          headers: { 'content-type': 'text/html' },
        }),
      ]).run()
    ).rejects.toThrow('supported media')
  })
  it('enforces streamed asset size even without content-length', async () => {
    await expect(
      harness(
        [
          json({ prompt_id: 'p1' }),
          json(output()),
          new Response('too large', {
            headers: { 'content-type': 'image/png' },
          }),
        ],
        { maxAssetBytes: 2 }
      ).run()
    ).rejects.toThrow('size limit')
  })
  it('times out polling without calling the server-wide interrupt', async () => {
    const fetchImpl = vi.fn(async (url: URL) =>
      json(url.pathname.endsWith('/prompt') ? { prompt_id: 'p1' } : {})
    )
    await expect(
      runWorkflow({
        baseUrl: 'http://localhost:8188',
        clientId: 'c',
        prompt: graph,
        outputNode: '1',
        kind: 'image',
        timeoutMs: 10,
        pollMs: 20,
        fetchImpl: fetchImpl as typeof fetch,
      })
    ).rejects.toThrow('may still be running')
    expect(
      fetchImpl.mock.calls.some(([url]) => url.pathname.includes('interrupt'))
    ).toBe(false)
  })
  it('rejects authentication failures without exposing credentials', async () => {
    await expect(
      harness([json({}, 401)], { username: 'x', password: 'do-not-leak' }).run()
    ).rejects.toThrow('HTTP 401')
  })
  it('rejects non-HTTP URLs before a request', async () => {
    const h = harness([], { baseUrl: 'file:///tmp/comfy' })
    await expect(h.run()).rejects.toThrow('HTTP(S)')
    expect(h.fetchImpl).not.toHaveBeenCalled()
  })
  it.each(['audio/wav', 'image/png'])(
    'rejects %s presented as a completed video',
    async (mime) => {
      const h = harness(
        [
          json({ prompt_id: 'p1' }),
          json(output('images')),
          new Response('not a video', { headers: { 'content-type': mime } }),
        ],
        { kind: 'video' }
      )
      await expect(h.run()).rejects.toThrow('instead of video')
    }
  )
})
