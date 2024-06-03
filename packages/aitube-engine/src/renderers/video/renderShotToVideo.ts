
import { getVideoPrompt } from "@/prompts"
import { VideoFirstFrameExtractor, VideoRenderer } from "@/types"
import {
  ClapProject,
  ClapSegment,
  getClapAssetSourceType,
  newSegment,
  filterSegments,
  ClapSegmentFilteringMode,
  ClapOutputType,
  ClapSegmentCategory,
  ClapSegmentStatus,
  parseMediaOrientation,
  ClapCompletionMode
} from "@aitube/clap"

export async function renderShotToVideo({
  shotSegment,
  existingClap,
  newerClap,
  mode,
  turbo,
  renderVideo,
  extractFirstFrame,
  debug = false
}: {
  shotSegment: ClapSegment
  existingClap: ClapProject
  newerClap: ClapProject
  mode: ClapCompletionMode
  turbo: boolean
  renderVideo: VideoRenderer
  extractFirstFrame: VideoFirstFrameExtractor
  debug?: boolean
}): Promise<void> {
  const shotSegments: ClapSegment[] = filterSegments(
    ClapSegmentFilteringMode.BOTH,
    shotSegment,
    existingClap.segments
  )

  const shotVideoSegments: ClapSegment[] = shotSegments.filter(s =>
    s.category === ClapSegmentCategory.VIDEO
  )

  let shotVideoSegment: ClapSegment | undefined = shotVideoSegments.at(0)
  
  const shotStoryboardSegments: ClapSegment[] = shotSegments.filter(s =>
    s.category === ClapSegmentCategory.STORYBOARD
  )

  let shotStoryboardSegment: ClapSegment | undefined = shotStoryboardSegments.at(0)

  // console.log(`[api/edit/videos] processShot: shot [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}] has ${shotSegments.length} segments (${shotVideoSegments.length} videos)`)

  // TASK 1: GENERATE MISSING VIDEO SEGMENT
  if (!shotVideoSegment) {
    shotVideoSegment = newSegment({
      track: 1,
      startTimeInMs: shotSegment.startTimeInMs,
      endTimeInMs: shotSegment.endTimeInMs,
      assetDurationInMs: shotSegment.assetDurationInMs,
      category: ClapSegmentCategory.VIDEO,
      prompt: "",
      assetUrl: "",
      outputType: ClapOutputType.VIDEO
    })

    // we fix the existing clap
    if (shotVideoSegment) {
      existingClap.segments.push(shotSegment)
    }

    if (debug) { console.log(`[@aitube-engine/renderShotToVideo] generated video segment [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}]`) }
  }

  if (!shotVideoSegment) {
    throw new Error(`failed to generate a new segment`)
  }


  // TASK 2: GENERATE MISSING VIDEO PROMPT
  if (!shotVideoSegment?.prompt) {
    // video is missing, let's generate it
    shotVideoSegment.prompt = getVideoPrompt(
      shotSegments,
      existingClap.entityIndex,
      ["high quality", "crisp", "detailed"]
    )
    if (debug) { console.log(`[@aitube-engine/renderShotToVideo] generating video prompt: ${shotVideoSegment.prompt}`) }
  }

  // TASK 3: GENERATE MISSING VIDEO FILE
  if (!shotVideoSegment.assetUrl) {
    // console.log(`[api/edit/videos] processShot: generating video file..`)

    const debug = false

    let width = existingClap.meta.width
    let height = existingClap.meta.height

    // if (turbo) {
    // width = Math.round(width / 2)
    // height = Math.round(height / 2)
    // }

    /*
    if (width > height) {
      width = 768
      height = 384
    } else if (width < height) {
      width = 384
      height = 768
    } else {
      width = 512
      height = 512
    }
    */

    if (!shotStoryboardSegment?.assetUrl) {
      // it is normal for some storyboards to be empty,
      // it only means that we cannot generate or are not interested in generating the video,
      // for instance if we have already the video
      // console.log(`skipping video generation for the shot..`)
      return

      // const error = `cannot generate a video without a storyboard! (at least not with AnimateDiff-LCM SVD)`
      // console.error(error)
      // throw new Error(error)
    }

    try {
      shotVideoSegment.assetUrl = await renderVideo({
        // prompt: getPositivePrompt(shotVideoSegment.prompt),
        imageInputBase64: shotStoryboardSegment.assetUrl,
        seed: shotSegment.seed,
        width,
        height,
        // by default we do 1 second of 24 fps
        // but it would look better if we had 2 seconds of 24 fps
        nbFrames: 80,
        nbFPS: 24,
        nbSteps: 4, // turbo ? 4 : 8,
        debug,
      })
      shotVideoSegment.assetSourceType = getClapAssetSourceType(shotVideoSegment.assetUrl)
      shotVideoSegment.status = ClapSegmentStatus.COMPLETED
    } catch (err) {
      if (debug) { console.log(`[@aitube-engine/renderShotToVideo] failed to generate a video file: ${err}`) }
      shotVideoSegment.status = ClapSegmentStatus.TO_GENERATE
      throw err
    }
  
    // console.log(`[api/edit/videos] processShot: generated video files: ${shotVideoSegment?.assetUrl?.slice?.(0, 50)}...`)

    // if mode is full, newerClap already contains the ference to shotVideoSegment
    // but if it's partial, we need to manually add it
    if (mode !== ClapCompletionMode.FULL) {
      newerClap.segments.push(shotVideoSegment)
    }
    
  } else {
    if (debug) { console.log(`[@aitube-engine/renderShotToVideo] there is already a video file: ${shotVideoSegment?.assetUrl?.slice?.(0, 50)}...`) }
  }

  if (!shotVideoSegment.assetUrl) {
    return
  }

  if (!shotStoryboardSegment) {
    if (debug) { console.log(`[@aitube-engine/renderShotToVideo] adding the missing storyboard segment`) }

    shotStoryboardSegment = newSegment({
      track: 1,
      startTimeInMs: shotSegment.startTimeInMs,
      endTimeInMs: shotSegment.endTimeInMs,
      assetDurationInMs: shotSegment.assetDurationInMs,
      category: ClapSegmentCategory.STORYBOARD,
      prompt: shotVideoSegment.prompt,
      outputType: ClapOutputType.IMAGE,
      status: ClapSegmentStatus.TO_GENERATE,
    })

    if (shotStoryboardSegment) {
      existingClap.segments.push(shotStoryboardSegment)
    }
  }


  //----------
  if (
    shotStoryboardSegment && 
    (!shotStoryboardSegment.assetUrl || shotStoryboardSegment.status === "to_generate")
  ) {
    if (debug) { console.log(`[@aitube-engine/renderShotToVideo] generating a missing storyboard asset`) }

    try {
      shotStoryboardSegment.assetUrl = await extractFirstFrame({
        inputVideo: shotVideoSegment.assetUrl,
        outputFormat: "jpeg"
      })
      if (!shotStoryboardSegment.assetUrl) { throw new Error(`failed to extract the first frame`) }
      if (debug) { console.log(`[@aitube-engine/renderShotToVideo] successfully fixed the missing storyboard`) }
      
      shotStoryboardSegment.status = ClapSegmentStatus.COMPLETED
    } catch (err) {
      if (debug) { console.log(`[@aitube-engine/renderShotToVideo] WARNING: couldn't generate the missing storyboard (probably an error with the ffmpeg not being found)`) }
      shotStoryboardSegment.status = ClapSegmentStatus.TO_GENERATE
    }


    if (shotStoryboardSegment && mode !== ClapCompletionMode.FULL) {
      newerClap.segments.push(shotStoryboardSegment)
    }
  }

}