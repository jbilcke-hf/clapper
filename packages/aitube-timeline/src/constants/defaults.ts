import { ClapTimelineTheme } from "@/types"
import { ClapSegmentCategory } from "@aitube/clap"
import { baseClapSegmentCategoryHues } from "./themes"


export const DEFAULT_MIN_ZOOM = 0.2
export const DEFAULT_MAX_ZOOM = 7
export const DEFAULT_ZOOM_SPEED = 1.7 // high = faster
export const DEFAULT_ZOOM_DAMPING_FACTOR = 0.3 // low : delay, high : faster/snappier
export const DEFAULT_SHOW_FPS = false
export const DEFAULT_FRAMELOOP = "demand"

export const pastel: ClapTimelineTheme = {
  grid: {
    backgroundColor: "#27272A",
  },
  cell: {
    saturation: 28.4,
    lightness: 78.6,
    hues: baseClapSegmentCategoryHues,
  }
}

export const DEFAULT_THEMES: Record<string, ClapTimelineTheme> = {
  pastel,
}