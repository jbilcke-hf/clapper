import { describe, expect, test } from 'vitest'

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
