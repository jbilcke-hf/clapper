import { ClapSegmentCategory } from "@aitube/clap"

export type ClapSegmentCategoryHues = Record<ClapSegmentCategory, number>

export type ClapTimelineTheme = {
  grid: {
    backgroundColor: string
  },
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
  foregroundColor: string
  borderColor: string
  textColor: string
  textColorHover: string
}