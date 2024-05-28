import { ClapSegment } from "@aitube/clap"


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
  console.log(`sliceSegments(): slicing [${afterTimeInMs}:${beforeTimeInMs}] of ${segments.length} segments`)
  
  return segments.filter(s => afterTimeInMs <= s.startTimeInMs && s.endTimeInMs <= beforeTimeInMs)
}