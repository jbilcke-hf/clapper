import { ClapEntity, ClapSegment, ClapSegmentCategory } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"

import { SettingsState } from "@/controllers/settings"

export function getResolveRequestPrompts({
  settings,
  segment,
  segments,
  entities,
}: {
  settings: SettingsState
  segment: ClapSegment
  segments: ClapSegment[]
  entities: Record<string, ClapEntity>
}): {
  positivePrompt: string
  negativePrompt: string
} {

  const videoPrompt = getVideoPrompt(
    segments,
    entities
  )

  const positivePrompt = [
    segment.category === ClapSegmentCategory.VIDEO
    ? settings.videoPromptPrefix
    : segment.category === ClapSegmentCategory.STORYBOARD
    ? settings.imagePromptPrefix
    : "",
    videoPrompt,
    segment.category === ClapSegmentCategory.VIDEO
    ? settings.videoPromptSuffix
    : segment.category === ClapSegmentCategory.STORYBOARD
    ? settings.imagePromptSuffix
    : ""
  ].map(x => x.trim()).filter(x => x).join(", ")

  const negativePrompt =  [
    segment.category === ClapSegmentCategory.VIDEO
    ? settings.videoNegativePrompt
    : segment.category === ClapSegmentCategory.STORYBOARD
    ? settings.imageNegativePrompt
    : ""
  ].map(x => x.trim()).filter(x => x).join(", ")

  /*
  console.log(`getResolveRequestPrompts:`, {
    segments: segments.map(s => ({
      ...s,
      assetUrl: "<HIDDEN>"
    })),
    videoPrompt,
    positivePrompt,
    negativePrompt,
    // entity: entities['6c1e99b5-02af-47fc-8e6a-0a5bcb9ee8b1'],
  })
  throw new Error("uh uh")
  */

 
  return {
    positivePrompt,
    negativePrompt
  }
}