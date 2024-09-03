import { ClapSegmentCategoryColors, ClapSegmentColorScheme } from "@/types/theme"
import { hslToHex } from "./hslToHex"
import { TimelineSegment, useTimeline } from ".."

// TODO: optimize this to not re-compute thing that didn't change much

export function getSegmentColorScheme(segment: TimelineSegment): ClapSegmentColorScheme {

  const { theme } = useTimeline.getState()

  let baseHue = 0

  let baseSaturation = theme.cell.categoryColors.GENERIC.saturation
  let baseLightness = theme.cell.categoryColors.GENERIC.lightness
  
  let backgroundColorSaturation = (segment.isSelected ? 2.2 : 1.4) * baseSaturation
  let backgroundColorHoverSaturation = (segment.isSelected ? 2.2 : 1.8) * baseSaturation

  let colorScheme: ClapSegmentColorScheme = {
    baseHue,
    baseSaturation,
    baseLightness,
    
    backgroundColor: hslToHex(baseHue, backgroundColorSaturation, baseLightness),
    backgroundColorHover: hslToHex(baseHue, backgroundColorHoverSaturation, baseLightness + 1),
    backgroundColorDisabled: hslToHex(baseHue, baseSaturation - 15, baseLightness - 2),
    foregroundColor: hslToHex(baseHue, baseSaturation + 40, baseLightness),
    borderColor: hslToHex(baseHue, baseSaturation + 40, baseLightness + 10),
    textColor: hslToHex(baseHue, baseSaturation + 55, baseLightness - 60),
    textColorHover: hslToHex(baseHue, baseSaturation + 55, baseLightness - 50),

    waveformLineSpacing: theme.cell.waveform.lineSpacing,
    waveformGradientStart: theme.cell.waveform.gradientStart,
    waveformGradientEnd: theme.cell.waveform.gradientEnd,
  }

  if (!segment) { return colorScheme }

  const clapSegmentCategoryColors: ClapSegmentCategoryColors = theme.cell.categoryColors

  const candidateHSL = clapSegmentCategoryColors[segment.category]
  if (!candidateHSL) { return colorScheme }

  baseHue = candidateHSL.hue
  baseSaturation = candidateHSL.saturation
  baseLightness = candidateHSL.lightness

  colorScheme = {
    baseHue,
    baseSaturation,
    baseLightness,
  
    backgroundColor: hslToHex(baseHue, backgroundColorSaturation, baseLightness),
    backgroundColorHover: hslToHex(baseHue, backgroundColorHoverSaturation, baseLightness + 1),
    backgroundColorDisabled: hslToHex(baseHue, baseSaturation - 15, baseLightness - 2),
    foregroundColor: hslToHex(baseHue, baseSaturation + 40, baseLightness),
    borderColor: hslToHex(baseHue, baseSaturation + 40, baseLightness + 10),
    textColor: hslToHex(baseHue, baseSaturation + 55, baseLightness - 60),
    textColorHover: hslToHex(baseHue, baseSaturation + 55, baseLightness - 50),

    waveformLineSpacing: theme.cell.waveform.lineSpacing,
    waveformGradientStart: theme.cell.waveform.gradientStart,
    waveformGradientEnd: theme.cell.waveform.gradientEnd,
  }

  return colorScheme
}