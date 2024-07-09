import { ClapSegmentCategory } from "@aitube/clap"

import { ClapTimelineTheme } from "@/types"
import { ClapSegmentCategoryHues } from "@/types/theme"

export const leftBarTrackScaleWidth = 120
export const topBarTimeScaleHeight = 40

export const baseClapSegmentCategoryHues: ClapSegmentCategoryHues = {
  [ClapSegmentCategory.SPLAT]: 347,
  [ClapSegmentCategory.MESH]: 32,
  [ClapSegmentCategory.DEPTH]: 242,
  [ClapSegmentCategory.EVENT]: 270,
  [ClapSegmentCategory.INTERFACE]: 216,
  [ClapSegmentCategory.PHENOMENON]: 270,
  [ClapSegmentCategory.VIDEO]: 70,
  [ClapSegmentCategory.STORYBOARD]: 70,
  [ClapSegmentCategory.TRANSITION]: 55,
  [ClapSegmentCategory.CHARACTER]: 285.8,
  [ClapSegmentCategory.LOCATION]: 80.9,
  [ClapSegmentCategory.TIME]: 250,
  [ClapSegmentCategory.ERA]: 250,
  [ClapSegmentCategory.LIGHTING]: 50,
  [ClapSegmentCategory.WEATHER]: 197.2,
  [ClapSegmentCategory.ACTION]: 3,
  [ClapSegmentCategory.MUSIC]: 100,
  [ClapSegmentCategory.SOUND]: 60,
  [ClapSegmentCategory.DIALOGUE]: 23,
  [ClapSegmentCategory.STYLE]: 285,
  [ClapSegmentCategory.CAMERA]: 10,
  [ClapSegmentCategory.GENERIC]: 200,
}

export const pastel: ClapTimelineTheme = {
  topBarTimeScale: {
    backgroundColor: "#7d7c78",
    textColor: "#ffffff",
    lineColor: "#E6E6E6"
  },
  leftBarTrackScale: {
    backgroundColor: "#7d7c78",
    textColor: "#ffffff",
    lineColor: "#B3B3B3"
  },
  grid: {
    backgroundColor: "#27272A",
  },
  cell: {
    saturation: 30,
    lightness: 78.6,
    hues: baseClapSegmentCategoryHues,

    waveform: {
      // "original" style
      lineSpacing: 2,
      gradientStart: 1.0,
      gradientEnd: 0.6,

      // "drapes" style
      // lineSpacing: 0,
      // gradientStart: 0.7,
      // gradientEnd: 0.1,

      // that is an "aggressive" style
      // lineSpacing: 1,
      // gradientStart: 0.6,
      // gradientEnd: 1.0,
    }
  },
  playbackCursor: {
    lineColor: "rgba(255, 255, 0, 1.0)"
  }
}
