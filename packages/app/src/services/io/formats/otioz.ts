import { TimelineStore, useTimeline } from '@aitube/timeline'
import {
  ExportableSegment,
  formatSegmentForExport,
} from '@/lib/utils/formatSegmentForExport'
import * as fflate from 'fflate'

import { base64DataUriToUint8Array } from '@/lib/utils/base64DataUriToUint8Array'
import { generateOTIO } from './otio'

export async function generateOTIOZ(): Promise<Uint8Array> {
  const timeline: TimelineStore = useTimeline.getState()
  const { segments: timelineSegments } = timeline

  // Generate the OTIO content using the existing function
  const otioContent = await generateOTIO()

  let files: fflate.AsyncZippable = {}

  // Add the OTIO JSON to the zip
  files['timeline.otio'] = fflate.strToU8(otioContent)

  const exportableSegments: ExportableSegment[] = timelineSegments
    .map((segment, index) => formatSegmentForExport(segment, index))
    .filter(({ isExportableToFile }) => isExportableToFile)

  exportableSegments.forEach((exportableSegment: ExportableSegment) => {
    const { segment, filePath } = exportableSegment

    // Add media file to the zip
    if (segment.assetUrl && segment.assetUrl.startsWith('data:')) {
      files[filePath] = base64DataUriToUint8Array(segment.assetUrl)
    }
    // If the asset is not a data URI, you might need to handle file reading differently
    // depending on your environment (browser vs Node.js)
  })

  return new Promise((resolve, reject) => {
    fflate.zip(files, { level: 0 }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
