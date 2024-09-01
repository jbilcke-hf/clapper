import { TimelineStore, useTimeline } from '@aitube/timeline'
import {
  ExportableSegment,
  formatSegmentForExport,
} from '@/lib/utils/formatSegmentForExport'

interface OTIORationalTime {
  OTIO_SCHEMA: 'RationalTime.1'
  value: number
  rate: number
}

interface OTIOTimeRange {
  OTIO_SCHEMA: 'TimeRange.1'
  duration: OTIORationalTime
  start_time: OTIORationalTime
}

interface OTIOExternalReference {
  OTIO_SCHEMA: 'ExternalReference.1'
  target_url: string
}

interface OTIOClip {
  OTIO_SCHEMA: 'Clip.1'
  name: string
  source_range: OTIOTimeRange
  media_reference: OTIOExternalReference
}

interface OTIOTrack {
  OTIO_SCHEMA: 'Track.1'
  name: string
  kind: 'Video' | 'Audio'
  children: OTIOClip[]
}

interface OTIOStack {
  OTIO_SCHEMA: 'Stack.1'
  children: OTIOTrack[]
}

interface OTIOTimeline {
  OTIO_SCHEMA: 'Timeline.1'
  name: string
  global_start_time: null
  tracks: OTIOStack
}

export async function generateOTIO(): Promise<string> {
  const timeline: TimelineStore = useTimeline.getState()
  const { title, segments: timelineSegments } = timeline

  const otioData: OTIOTimeline = {
    OTIO_SCHEMA: 'Timeline.1',
    name: title,
    global_start_time: null,
    tracks: {
      OTIO_SCHEMA: 'Stack.1',
      children: [
        {
          OTIO_SCHEMA: 'Track.1',
          name: 'V1',
          kind: 'Video',
          children: [],
        },
      ],
    },
  }

  const exportableSegments: ExportableSegment[] = timelineSegments
    .map((segment, index) => formatSegmentForExport(segment, index))
    .filter(({ isExportableToFile }) => isExportableToFile)

  exportableSegments.forEach((exportableSegment: ExportableSegment) => {
    const { segment, filePath } = exportableSegment
    const clip: OTIOClip = {
      OTIO_SCHEMA: 'Clip.1',
      name: segment.label,
      source_range: {
        OTIO_SCHEMA: 'TimeRange.1',
        duration: {
          OTIO_SCHEMA: 'RationalTime.1',
          value: segment.endTimeInMs - segment.startTimeInMs,
          rate: 1000,
        },
        start_time: {
          OTIO_SCHEMA: 'RationalTime.1',
          value: segment.startTimeInMs,
          rate: 1000,
        },
      },
      media_reference: {
        OTIO_SCHEMA: 'ExternalReference.1',
        target_url: filePath,
      },
    }
    otioData.tracks.children[0].children.push(clip)
  })

  return JSON.stringify(otioData, null, 2)
}
