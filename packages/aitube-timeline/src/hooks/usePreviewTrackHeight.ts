
import { DEFAULT_COLUMNS_PER_SLICE } from "@/constants/grid"

import { useTimelineState } from "./useTimelineState"

export function usePreviewTrackHeight() {
  const cellWidth = useTimelineState(s => s.horizontalZoomLevel)

  const imageRatio = 0.5625 // 0.6
  const previewHeight = Math.round(
    // (horizontalZoomLevel / 40) *
    imageRatio
    * DEFAULT_COLUMNS_PER_SLICE // typically 4, but this might change in the future
    * cellWidth)
 
  return previewHeight
}