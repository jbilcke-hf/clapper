import { ClapSegmentCategory } from "@aitube/clap"

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
}