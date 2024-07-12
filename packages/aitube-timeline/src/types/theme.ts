import { ClapSegmentCategory } from "@aitube/clap"

export type ClapSegmentCategoryHSL = {
  hue: number
  saturation: number
  lightness: number
}

export type ClapSegmentCategoryColors = Record<ClapSegmentCategory, ClapSegmentCategoryHSL>

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
    categoryColors: ClapSegmentCategoryColors

    waveform: {
      lineSpacing: number
      gradientStart: number
      gradientEnd: number
    }
  }
  playbackCursor: {
    lineColor: string
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