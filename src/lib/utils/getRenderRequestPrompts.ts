import { ClapEntity, ClapSegment, ClapSegmentCategory } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"

import { SettingsState } from "@/controllers/settings"

export function getRenderRequestPrompts({
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
  ].map(x => x.trim()).join(", ")

  const negativePrompt =  [
    segment.category === ClapSegmentCategory.VIDEO
    ? settings.videoNegativePrompt
    : segment.category === ClapSegmentCategory.STORYBOARD
    ? settings.imageNegativePrompt
    : ""
  ].map(x => x.trim()).join(", ")

  return {
    positivePrompt,
    negativePrompt
  }
}