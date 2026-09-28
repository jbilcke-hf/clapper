// @vitest-environment node
import { createServer } from 'node:http'
import { expect, it } from 'vitest'
import { runWorkflow } from './runWorkflow'

it('uses the native fetch stack against a local ComfyUI protocol fixture', async () => {
  const calls: string[] = []
  let submitted: any
  const server = createServer(async (request, response) => {
    calls.push(request.url || '')
    if (request.headers.authorization !== 'Basic dGVzdDpzZWNyZXQ=') {
      response.writeHead(401).end()
      return
    }
    if (request.url === '/prompt') {
      const chunks: Buffer[] = []
      for await (const chunk of request) chunks.push(Buffer.from(chunk))
      submitted = JSON.parse(Buffer.concat(chunks).toString())
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ prompt_id: 'native-fetch' }))
    } else if (request.url === '/history/native-fetch') {
      response.setHeader('Content-Type', 'application/json')
      response.end(
        JSON.stringify({
          'native-fetch': {
            status: { completed: true },
            outputs: {
              '2': { audio: [{ filename: 'voice.wav', type: 'output' }] },
            },
          },
        })
      )
    } else if (request.url?.startsWith('/view?')) {
      response.setHeader('Content-Type', 'audio/wav')
      response.end(Buffer.from('RIFF-test-fixture'))
    } else {
      response.writeHead(404).end()
    }
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    const address = server.address() as { port: number }
    const result = await runWorkflow({
      baseUrl: `http://127.0.0.1:${address.port}`,
      username: 'test',
      password: 'secret',
      clientId: 'fixture-client',
      prompt: {
        '2': { class_type: 'SaveAudio', inputs: { filename_prefix: 'voice' } },
      },
      outputNode: '2',
      kind: 'audio',
    })
    expect(result).toBe(
      `data:audio/wav;base64,${Buffer.from('RIFF-test-fixture').toString('base64')}`
    )
    expect(submitted.client_id).toBe('fixture-client')
    expect(calls).toHaveLength(3)
    expect(calls[2]).toContain('filename=voice.wav')
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
})
