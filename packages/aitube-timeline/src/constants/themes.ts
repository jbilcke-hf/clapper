import { ClapTimelineTheme } from "@/types"
import { ClapSegmentCategoryHues } from "@/types/theme"
import { ClapSegmentCategory } from "@aitube/clap"

export const baseClapSegmentCategoryHues: ClapSegmentCategoryHues = {
  [ClapSegmentCategory.SPLAT]: 347,
  [ClapSegmentCategory.MESH]: 32,
  [ClapSegmentCategory.DEPTH]: 242,
  [ClapSegmentCategory.EVENT]: 270,
  [ClapSegmentCategory.INTERFACE]: 216,
  [ClapSegmentCategory.PHENOMENON]: 270,
  [ClapSegmentCategory.VIDEO]: 65,
  [ClapSegmentCategory.STORYBOARD]: 65,
  [ClapSegmentCategory.TRANSITION]: 65,
  [ClapSegmentCategory.CHARACTER]: 285.8,
  [ClapSegmentCategory.LOCATION]: 80.9,
  [ClapSegmentCategory.TIME]: 91,
  [ClapSegmentCategory.ERA]: 91,
  [ClapSegmentCategory.LIGHTING]: 50,
  [ClapSegmentCategory.WEATHER]: 197.2,
  [ClapSegmentCategory.ACTION]: 3,
  [ClapSegmentCategory.MUSIC]: 90,
  [ClapSegmentCategory.SOUND]: 63,
  [ClapSegmentCategory.DIALOGUE]: 23,
  [ClapSegmentCategory.STYLE]: 285,
  [ClapSegmentCategory.CAMERA]: 1,
  [ClapSegmentCategory.GENERIC]: 67,
}

export const pastel: ClapTimelineTheme = {
  grid: {
    backgroundColor: "#27272A",
  },
  cell: {
    saturation: 29, // 20.3,
    lightness: 77, // 71.4,
    hues: baseClapSegmentCategoryHues
  }
}

export const DEFAULT_THEMES: Record<string, ClapTimelineTheme> = {
  pastel,
}