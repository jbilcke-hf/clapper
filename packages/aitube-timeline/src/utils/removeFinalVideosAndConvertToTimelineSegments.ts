import { ClapProject } from "@aitube/clap"

import { SegmentVisibility, TimelineSegment } from "@/types"

import { getFinalVideo } from "./getFinalVideo"
import { clapSegmentToTimelineSegment } from "./clapSegmentToTimelineSegment"

export async function removeFinalVideosAndConvertToTimelineSegments(clap: ClapProject): Promise<TimelineSegment[]> {
  const alreadyAnEmbeddedFinalVideo = await getFinalVideo(clap)
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

  const segments: TimelineSegment[] = []

  let nbSegments = 0
  
  for (const clapSegment of (clap.segments as TimelineSegment[])) {
    if (clapSegment.id === ignoreThisVideoSegmentId) { continue }

    const segment = await clapSegmentToTimelineSegment(clapSegment)

   // ok so this is more or less a "hack": when we load the segments, we don't want all of them to be hidden
    // but we also don't have the time to compute the visibility yet,
    // so what we do is that we apply some basic rule (since the window and scroll is reset too)
    // to only show the first Nth segments (in this case, 200)
    segment.visibility = nbSegments++ > 200 ? SegmentVisibility.HIDDEN : SegmentVisibility.VISIBLE

    segments.push(segment)
  }
  
  return segments
}