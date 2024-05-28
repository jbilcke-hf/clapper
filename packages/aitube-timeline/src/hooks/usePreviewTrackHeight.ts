
import { DEFAULT_COLUMNS_PER_SLICE } from "@/constants/grid"

import { useCellWidth } from "./useCellWidth"

export function usePreviewTrackHeight() {
  const cellWidth = useCellWidth()

  const imageRatio = 0.5625 // 0.6
  const previewWidth = Math.round(
    // (horizontalZoomLevel / 40) *
    imageRatio
    * DEFAULT_COLUMNS_PER_SLICE // typically 4, but this might change in the future
    * cellWidth)
 
  return previewWidth
}