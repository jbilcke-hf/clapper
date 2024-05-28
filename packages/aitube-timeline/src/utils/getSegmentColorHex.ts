import { ClapSegment } from "@aitube/clap"
import { getSegmentColor, segmentCategories, SegmentColor } from "@aitube/colors"

const segmentColorToBgColorHex: Record<SegmentColor, string> = {
  blue: '#60a5fa',
  red: '#f87171',
  rose: '#fb7185',
  green: '#4ade80',

  green2: '#a2de53',
  green3: '#90aa89',
  
  violet: '#a78bfa',
  amber: '#fbbf24',
  yellow: '#facc15',
  yellow2: '#facc6e',
  teal: '#2dd4bf',
  cyan: '#22d3ee',
  orange: '#fb923c',
  orange2: '#dea253',

  sky: '#38bdf8',
  stone: '#a8a29e',
  // stone2: '#78716c',
  sand: '#c8b07c',

  zinc: '#a1a1aa',
  zinc2: '#d4d4d8',
  lime: '#a3e635',
  indigo: '#818cf8',
  purple: '#c084fc',
  purple2: '#afbfcb',
  pink: '#f472b6',
  pink2: '#bf91b8',
  pink3: '#bfa0b8',
 
  neutral: '#a3a3a3',
  neutral2: '#969187',
  gray: '#9ca3af',
  gray2: '#9ca3af'
}

/**
 * 
 * @param segment 
 * @returns 
 */
export function getSegmentColorHex(segment?: ClapSegment): { bg: string } {
  const segmentColor: SegmentColor = getSegmentColor(segment?.category || segmentCategories.generic)

  const bg = segmentColorToBgColorHex[segmentColor] || segmentColorToBgColorHex.gray

  return {
    bg
  }
}