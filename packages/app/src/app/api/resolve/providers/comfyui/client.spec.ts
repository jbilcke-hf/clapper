import { describe, expect, test, vi } from 'vitest'

import { extractComfyUiOutputAssets } from './client'

describe('extractComfyUiOutputAssets', () => {
  test('extracts image, video, gif, and audio assets from ComfyUI history', () => {
    const history = {
      outputs: {
        '9': {
          images: [
            {
              filename: 'image.png',
              subfolder: '',
              type: 'output',
            },
          ],
        },
        '12': {
          videos: [
            {
              filename: 'video.mp4',
              subfolder: 'clips',
              type: 'output',
            },
          ],
          gifs: [
            {
              filename: 'preview.gif',
              subfolder: '',
              type: 'output',
            },
          ],
          audio: [
            {
              filename: 'voice.wav',
              subfolder: 'audio',
              type: 'output',
            },
          ],
        },
      },
    }

    const assets = extractComfyUiOutputAssets(history)

    expect(assets).toEqual([
      { filename: 'image.png', subfolder: '', type: 'output' },
      { filename: 'video.mp4', subfolder: 'clips', type: 'output' },
      { filename: 'preview.gif', subfolder: '', type: 'output' },
      { filename: 'voice.wav', subfolder: 'audio', type: 'output' },
    ])
  })

  test('prioritizes assets from the mapped output node', () => {
    const assets = extractComfyUiOutputAssets(
      {
        outputs: {
          '9': {
            images: [{ filename: 'fallback.png' }],
          },
          '12': {
            videos: [{ filename: 'mapped.mp4', subfolder: 'clips' }],
          },
        },
      },
      '12'
    )

    expect(assets).toEqual([
      { filename: 'mapped.mp4', subfolder: 'clips', type: 'output' },
      { filename: 'fallback.png', subfolder: '', type: 'output' },
    ])
  })

  test('extracts non-image/video audio and file assets', () => {
    const assets = extractComfyUiOutputAssets({
      outputs: {
        '21': {
          audios: [
            {
              filename: 'voice.wav',
              subfolder: 'audio',
              type: 'output',
            },
          ],
          files: [
            {
              filename: 'captions.json',
              subfolder: 'metadata',
              type: 'output',
              format: 'json',
            },
          ],
        },
      },
    })

    expect(assets).toEqual([
      {
        filename: 'voice.wav',
        subfolder: 'audio',
        type: 'output',
        format: undefined,
      },
      {
        filename: 'captions.json',
        subfolder: 'metadata',
        type: 'output',
        format: 'json',
      },
    ])
  })
})


test('extracts assets from arbitrary nested output structures', () => {
  const assets = extractComfyUiOutputAssets({
    outputs: {
      '42': {
        custom_result: {
          result_files: [
            {
              filename: 'render.mp4',
              subfolder: 'renders',
              type: 'output',
              format: 'mp4',
            },
          ],
        },
      },
    },
  })

  expect(assets).toEqual([
    {
      filename: 'render.mp4',
      subfolder: 'renders',
      type: 'output',
      format: 'mp4',
    },
  ])
})

test('deduplicates the same output asset discovered through nested structures', () => {
  const assets = extractComfyUiOutputAssets({
    outputs: {
      '7': {
        images: [
          {
            filename: 'same.png',
            subfolder: '',
            type: 'output',
          },
        ],
        custom: {
          nested: {
            filename: 'same.png',
            subfolder: '',
            type: 'output',
          },
        },
      },
    },
  })

  expect(assets).toEqual([
    {
      filename: 'same.png',
      subfolder: '',
      type: 'output',
      format: undefined,
    },
  ])
})


test('runs the complete local ComfyUI prompt -> history -> view flow', async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ prompt_id: 'prompt-123' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    )
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          'prompt-123': {
            status: { status_str: 'success' },
            outputs: {
              '9': {
                images: [
                  {
                    filename: 'result.png',
                    subfolder: '',
                    type: 'output',
                  },
                ],
              },
            },
          },
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }
      )
    )
    .mockResolvedValueOnce(
      new Response(Uint8Array.from([1, 2, 3, 4]), {
        status: 200,
        headers: { 'content-type': 'image/png' },
      })
    )

  vi.stubGlobal('fetch', fetchMock)

  const { ComfyUiClient } = await import('./client')

  const client = new ComfyUiClient({
    apiUrl: 'http://127.0.0.1:8188',
    clientId: 'test-client',
  })

  const result = await client.runPrompt({
    '3': {
      inputs: {
        text: 'hello',
      },
      class_type: 'TestNode',
    },
  })

  expect(result.promptId).toBe('prompt-123')
  expect(result.assets).toEqual([
    {
      filename: 'result.png',
      subfolder: '',
      type: 'output',
      format: undefined,
    },
  ])

  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    'http://127.0.0.1:8188/prompt',
    expect.objectContaining({
      method: 'POST',
    })
  )

  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    'http://127.0.0.1:8188/history/prompt-123',
    expect.objectContaining({
      headers: {},
    })
  )

  const dataUri = await client.readAssetAsDataUri(result.assets[0])

  expect(dataUri).toBe('data:image/png;base64,AQIDBA==')

  expect(fetchMock).toHaveBeenNthCalledWith(
    3,
    expect.stringContaining('http://127.0.0.1:8188/view?'),
    expect.objectContaining({
      headers: {},
    })
  )

  vi.unstubAllGlobals()
})
