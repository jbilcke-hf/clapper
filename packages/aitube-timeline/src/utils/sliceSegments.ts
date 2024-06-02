import { ClapSegment, ClapSegmentFilteringMode, filterSegmentsWithinRange } from "@aitube/clap"


// TODO put this in a web workers for smoother operations?
export function sliceSegments({
  segments,
  afterTimeInMs,
  beforeTimeInMs,
  visibleSegments,
}: {
  segments: ClapSegment[]
  afterTimeInMs: number
  beforeTimeInMs: number
  visibleSegments: ClapSegment[]
}): ClapSegment[] {
  // console.log(`sliceSegments(): extracting [${afterTimeInMs}:${beforeTimeInMs}] out of ${segments.length} segments`)
  const result = filterSegmentsWithinRange(
    ClapSegmentFilteringMode.ANY,
    afterTimeInMs,
    beforeTimeInMs,
    segments
  )
  return result
}