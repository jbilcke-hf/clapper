import { ClapSegmentCategory } from "@aitube/clap"

import { ClapTimelineTheme } from "@/types"
import { ClapSegmentCategoryColors } from "@/types/theme"

export const leftBarTrackScaleWidth = 120
export const topBarTimeScaleHeight = 34

export const baseClapSegmentCategoryColors: ClapSegmentCategoryColors = {
  [ClapSegmentCategory.SPLAT]: { hue: 347, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.MESH]: { hue: 32, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.DEPTH]: { hue: 242, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.EVENT]: { hue: 270, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.EFFECT]: { hue: 270, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.INTERFACE]: { hue: 216, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.PHENOMENON]: { hue: 270, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.VIDEO]: { hue: 70, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.IMAGE]: { hue: 70, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.TRANSITION]: { hue: 55, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.CHARACTER]: { hue: 285.8, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.LOCATION]: { hue: 80.9, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.TIME]: { hue: 250, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.ERA]: { hue: 250, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.LIGHTING]: { hue: 50, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.WEATHER]: { hue: 197.2, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.ACTION]: { hue: 3, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.MUSIC]: { hue: 100, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.SOUND]: { hue: 60, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.DIALOGUE]: { hue: 23, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.STYLE]: { hue: 285, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.CAMERA]: { hue: 10, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.GROUP]: { hue: 200, saturation: 30, lightness: 78.6 },
  [ClapSegmentCategory.GENERIC]: { hue: 200, saturation: 30, lightness: 78.6 },
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
    categoryColors: baseClapSegmentCategoryColors,

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
