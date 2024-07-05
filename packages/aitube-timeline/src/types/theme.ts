import { ClapSegmentCategory } from "@aitube/clap"
import { string } from "three/examples/jsm/nodes/Nodes.js"

export type ClapSegmentCategoryHues = Record<ClapSegmentCategory, number>

export type ClapTimelineTheme = {
  topBarTimeScale: {
    backgroundColor: string
    textColor: string
    lineColor: string
  }
  leftBarTrackScale: {
    backgroundColor: string
    textColor: string
    lineColor: string
  }
  grid: {
    backgroundColor: string
  }
  cell: {
    saturation: number
    lightness: number
    hues: ClapSegmentCategoryHues

    waveform: {
      lineSpacing: number
      gradientStart: number
      gradientEnd: number
    }
  }
}

export type ClapSegmentColorScheme = {
  baseHue: number
  baseSaturation: number
  baseLightness: number
  
  backgroundColor: string
  backgroundColorHover: string
  backgroundColorDisabled: string
  foregroundColor: string
  borderColor: string
  textColor: string
  textColorHover: string

  waveformLineSpacing: number
  waveformGradientStart: number
  waveformGradientEnd: number
}