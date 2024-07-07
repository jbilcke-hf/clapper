import { ClapTrack } from "@aitube/clap"

import { ClapSegmentColorScheme, TimelineSegment } from "@/types"

export type SpecializedCellProps = {
  segment: TimelineSegment
  cellWidth: number
  cellHeight: number
  isHovered: boolean
  setHoveredSegment: (hoveredSegment?: TimelineSegment) => void
  durationInSteps: number
  startTimeInSteps: number
  colorScheme: ClapSegmentColorScheme
  widthInPx: number
  widthInPxAfterZoom: number
  isResizing: boolean
  track: ClapTrack
}