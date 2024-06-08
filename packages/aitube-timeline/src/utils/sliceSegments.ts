import { ClapSegment, ClapSegmentFilteringMode, filterSegmentsWithinRange } from "@aitube/clap"


// TODO put this in a web workers for smoother operations?
export function sliceSegments({
  segments,
  afterTimeInMs,
  beforeTimeInMs,
}: {
  segments: ClapSegment[]
  afterTimeInMs: number
  beforeTimeInMs: number
}): ClapSegment[] {
  const result = filterSegmentsWithinRange(
    ClapSegmentFilteringMode.ANY,
    afterTimeInMs,
    beforeTimeInMs,
    segments
  )
  return result
}