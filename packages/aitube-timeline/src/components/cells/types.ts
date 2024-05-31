import { ClapSegmentColorScheme } from "@/types"
import { ClapSegment } from "@aitube/clap"

export type SpecializedCellProps = {
  segment: ClapSegment
  cellWidth: number
  cellHeight: number
  isHovered: boolean
  setHoveredSegment: (hoveredSegment?: ClapSegment) => void
  durationInSteps: number
  startTimeInSteps: number
  colorScheme: ClapSegmentColorScheme
  widthInPx: number
  widthInPxAfterZoom: number
}