import { ClapProject, ClapSegmentCategory, ClapSegmentStatus, ClapSegment } from "@/types"

// return a new clap (but in a memory efficient way: it will hold references to the original)
// with all the generated, partially generated or in-erorr segments stripped of their assetUrl
//
// this will has the effect or drastically reducing the size of the payload
//
// note: please make sure you don't accidentally have segments
// with status TO_GENERATE and something in assetUrl
export function removeGeneratedAssetUrls(
  clap: ClapProject,

  // those segments will be preserved no matter what
  idsOfSegmentsToKeep: string[] = []
): ClapProject {
  return {
    ...clap,
    segments: (Array.isArray(clap.segments) ? clap.segments : [])
      .map((segment: ClapSegment) =>
        // if a segment is not "TO_GENERATE" then we assume it contains an URL,
        // which is information we can strip out
        // also if it's in idsOfSegmentsToKeep we keep it without asking questions
        (
          idsOfSegmentsToKeep.includes(segment.id) ||
          segment?.status === ClapSegmentStatus.TO_GENERATE)
        ? segment
        : { ...segment, assetUrl: '' }
      )
  }
}
