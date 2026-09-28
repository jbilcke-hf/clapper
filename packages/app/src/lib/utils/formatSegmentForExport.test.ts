// @vitest-environment node
import { expect, test } from 'vitest'
import { newSegment } from '@aitube/clap'
import { clapSegmentToTimelineSegment } from '@aitube/timeline'

import { formatSegmentForExport } from './formatSegmentForExport'

test('formatSegmentForExport', async () => {
  const segment = await clapSegmentToTimelineSegment(
    newSegment({
      id: '301a3e6f-cb59-4a85-afd6-4737eeeee356',
      createdAt: '2024-07-13T19:30:13.387Z',
      seed: 7549327,
    })
  )
  const exported = formatSegmentForExport(segment, 0)
  expect(exported.segment).toBe(segment)
  expect(exported).toStrictEqual({
    id: '301a3e6f-cb59-4a85-afd6-4737eeeee356',
    assetSourceType: 'EMPTY',
    assetUrl: '',
    category: 'generic',
    directory: 'generic',
    fileName: 'shot_0000_301a3e6f-cb59-4a85-afd6-4737eeeee356.unknown',
    filePath: 'generic/shot_0000_301a3e6f-cb59-4a85-afd6-4737eeeee356.unknown',
    format: 'unknown',
    index: 0,
    isExportableToFile: false,
    mimetype: 'unknown/unknown',
    prefix: 'shot_0000_',
    segment,
    shortId: 'generic0',
  })
})
