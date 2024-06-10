import { ClapSegmentCategory } from "@aitube/clap"

export const SegmentCategoryPromptPriority: Partial<Record<ClapSegmentCategory, number>> = {
  // maybe we should also a priority for the video,
  // if it has a prompt.. no?
  [ClapSegmentCategory.STORYBOARD]: 11,
  [ClapSegmentCategory.CAMERA]: 10,
  [ClapSegmentCategory.CHARACTER]: 9,
  [ClapSegmentCategory.LOCATION]: 8,
  [ClapSegmentCategory.ACTION]: 7,
  [ClapSegmentCategory.TIME]: 6,
  [ClapSegmentCategory.STYLE]: 5,
  [ClapSegmentCategory.LIGHTING]: 4,
  [ClapSegmentCategory.WEATHER]: 3,
  [ClapSegmentCategory.ERA]: 2, // <- era is @deprecated
  [ClapSegmentCategory.GENERIC]: 1
}