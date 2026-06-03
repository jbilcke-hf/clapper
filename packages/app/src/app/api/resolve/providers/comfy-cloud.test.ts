import { expect, test } from 'vitest'

import { extractCloudOutputUrl, getRunId } from './comfy-cloud'

test('extractCloudOutputUrl supports common ComfyUI cloud response shapes', () => {
  expect(
    extractCloudOutputUrl({
      output: [{ url: 'https://example.com/image.png' }],
    })
  ).toBe('https://example.com/image.png')

  expect(
    extractCloudOutputUrl({
      data: {
        outputs: [{ file_url: 'https://example.com/video.mp4' }],
      },
    })
  ).toBe('https://example.com/video.mp4')
})

test('getRunId supports common ComfyUI cloud queue response shapes', () => {
  expect(getRunId({ run_id: 'run-a' })).toBe('run-a')
  expect(getRunId({ data: { id: 'run-b' } })).toBe('run-b')
})
