import { ClapSegmentCategory, ClapSegmentFilteringMode, filterSegmentsWithinRange } from "@aitube/clap"

import { TimelineSegment } from "@/types"

// TODO put this in a web workers for smoother operations?
export function sliceSegments<T extends {
  startTimeInMs: number
  endTimeInMs: number
  category?: ClapSegmentCategory
}>({
  segments,
  afterTimeInMs,
  beforeTimeInMs,
}: {
  segments: T[]
  afterTimeInMs: number
  beforeTimeInMs: number
}): T[] {
  const result = filterSegmentsWithinRange<T>(
    ClapSegmentFilteringMode.ANY,
    afterTimeInMs,
    beforeTimeInMs,
    segments
  )
  return result
}