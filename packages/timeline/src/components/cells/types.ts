import { ClapTrack } from "@aitube/clap"

import { ClapSegmentColorScheme, TimelineSegment } from "@/types"
import { SegmentArea } from "@/types/timeline"

export type SpecializedCellProps = {
  segment: TimelineSegment
  cellWidth: number
  cellHeight: number
  isHovered: boolean
  setHoveredSegment: (params?: {
    segment?: TimelineSegment
    area?: SegmentArea 
  }) => void
  durationInSteps: number
  startTimeInSteps: number
  colorScheme: ClapSegmentColorScheme
  widthInPx: number
  widthInPxAfterZoom: number
  isResizing: boolean
  track: ClapTrack
}
