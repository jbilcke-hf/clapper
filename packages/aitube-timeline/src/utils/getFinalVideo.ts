import { ClapProject, ClapSegment, ClapSegmentCategory, ClapSegmentStatus } from "@aitube/clap"

import { TimelineSegment } from "@/types"
import { clapSegmentToTimelineSegment } from "./clapSegmentToTimelineSegment"

export async function getFinalVideo(clap: ClapProject): Promise<TimelineSegment | undefined> {
  const alreadyAnEmbeddedFinalVideo: ClapSegment | undefined = clap.segments.filter(s =>
    s.category === ClapSegmentCategory.VIDEO &&
    s.status === ClapSegmentStatus.COMPLETED &&
    s.startTimeInMs === 0 &&
    s.endTimeInMs === clap.meta.durationInMs &&
    s.assetUrl).at(0)
  
  if (!alreadyAnEmbeddedFinalVideo) { return undefined }

  return clapSegmentToTimelineSegment(alreadyAnEmbeddedFinalVideo)
}