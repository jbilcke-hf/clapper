import { ClapProject, ClapSegment } from "@aitube/clap"
import { getFinalVideo } from "./getFinalVideo"

export function removeFinalVideos(clap: ClapProject): ClapSegment[] {
  const alreadyAnEmbeddedFinalVideo = getFinalVideo(clap)

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