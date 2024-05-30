import { ClapProject, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

export function removeFinalVideos(clap: ClapProject): ClapSegment[] {
  const alreadyAnEmbeddedFinalVideo = clap.segments.filter(s =>
    s.category === ClapSegmentCategory.VIDEO &&
    s.status === "completed" &&
    s.startTimeInMs === 0 &&
    s.endTimeInMs === clap.meta.durationInMs &&
    s.assetUrl).at(0)

  let ignoreThisVideoSegmentId = ""

  if (alreadyAnEmbeddedFinalVideo) {
    ignoreThisVideoSegmentId = alreadyAnEmbeddedFinalVideo?.id || ""

    /*
    you know what.. let's just ignore it, and re-generate fresh content
    because most probably the user made an honest mistake

    const outputFilePath = await writeBase64ToFile(
      alreadyAnEmbeddedFinalVideo.assetUrl,
      join(outputDir, `existing_final_video`)
    )

    return {
      tmpWorkDir: outputDir,
      outputFilePath
    }
    */
  }

  // we remove the final video from the full list of segments
  const allCategoriesOfSegments = clap.segments.filter(s => s.id !== ignoreThisVideoSegmentId)

  return allCategoriesOfSegments
}