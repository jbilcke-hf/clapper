import { ClapSegmentFilteringMode, filterSegmentsWithinRange } from "@aitube/clap"

import { TimelineSegment } from "@/types"

// TODO put this in a web workers for smoother operations?
export function sliceSegments({
  segments,
  afterTimeInMs,
  beforeTimeInMs,
}: {
  segments: TimelineSegment[]
  afterTimeInMs: number
  beforeTimeInMs: number
}): TimelineSegment[] {
  const result = filterSegmentsWithinRange(
    ClapSegmentFilteringMode.ANY,
    afterTimeInMs,
    beforeTimeInMs,
    segments
  )
  return result
}