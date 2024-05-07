import { defaultSegmentDurationInMs, demoStory } from "@/samples/stories"

import { newClap } from "@/factories/newClap"
import { newSegment } from "@/factories/newSegment"
import { ClapOutputType, ClapProject, ClapSegmentCategory } from "@/types"

export function generateClapFromSimpleStory({
  story = demoStory,
  showIntroPoweredByEngine = false,
  showIntroDisclaimerAboutAI = false,
}: {
  story?: string[]
  showIntroPoweredByEngine?: boolean
  showIntroDisclaimerAboutAI?: boolean
} = {
  story: demoStory,
  showIntroPoweredByEngine: false,
  showIntroDisclaimerAboutAI: false,
}): ClapProject {

  const clap = newClap({
    meta: {
      title: "Interactive Demo",
      isInteractive: true,
      isLoop: true,
    }
  })

  let currentElapsedTimeInMs = 0
  let currentSegmentDurationInMs = defaultSegmentDurationInMs

  if (showIntroPoweredByEngine) {
    clap.segments.push(newSegment({
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: ClapSegmentCategory.INTERFACE,
      prompt: "<BUILTIN:POWERED_BY_ENGINE>",
      label: "disclaimer",
      outputType: ClapOutputType.INTERFACE,
    }))
    currentElapsedTimeInMs += currentSegmentDurationInMs
  }

  if (showIntroDisclaimerAboutAI) {
    clap.segments.push(newSegment({
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category:ClapSegmentCategory.INTERFACE,
      prompt: "<BUILTIN:DISCLAIMER_ABOUT_AI>",
      label: "disclaimer",
      outputType: ClapOutputType.INTERFACE,
    }))
    currentElapsedTimeInMs += currentSegmentDurationInMs
  }

  /*
  clap.segments.push(
    newSegment({
      // id: string
      // track: number
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: ClapSegmentCategory.INTERFACE,
      // entityId: string
      // sceneId: string
      prompt: "a hello world",
      label: "hello world",
      outputType: ClapOutputType.INTERFACE,
      // renderId: string
      // status: ClapSegmentStatus
      // assetUrl: string
      // assetDurationInMs: number
      // createdBy: ClapAuthor
      // editedBy: ClapAuthor
      // outputGain: number
      // seed: number
    })
  )

  currentElapsedTimeInMs += currentSegmentDurationInMs
  */
  
 

  for (let prompt of story) {

    clap.segments.push(newSegment({
      track: 0,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: ClapSegmentCategory.VIDEO,
      prompt: "",
      label: "video",
      outputType: ClapOutputType.VIDEO,
    }))
    clap.segments.push(newSegment({
      track: 1,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: ClapSegmentCategory.GENERIC,
      prompt,
      label: prompt,
      outputType: ClapOutputType.TEXT,
    }))
    clap.segments.push(newSegment({
      track: 2,
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: ClapSegmentCategory.CAMERA,
      prompt: "medium-shot",
      label: "medium-shot",
      outputType: ClapOutputType.TEXT,
    }))

    currentElapsedTimeInMs += currentSegmentDurationInMs
  }

  clap.meta.durationInMs = currentElapsedTimeInMs

  return clap
}