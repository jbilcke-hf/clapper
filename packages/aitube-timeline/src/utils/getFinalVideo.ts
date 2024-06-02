import { ClapProject, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

export function getFinalVideo(clap: ClapProject): ClapSegment | undefined {
  const alreadyAnEmbeddedFinalVideo = clap.segments.filter(s =>
    s.category === ClapSegmentCategory.VIDEO &&
    s.status === "completed" &&
    s.startTimeInMs === 0 &&
    s.endTimeInMs === clap.meta.durationInMs &&
    s.assetUrl).at(0)

  return alreadyAnEmbeddedFinalVideo
}