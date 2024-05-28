import { useTimelineState } from "./useTimelineState"

export function useCellWidth() {
  const horizontalZoomLevel = useTimelineState((s) => s.horizontalZoomLevel)
  return horizontalZoomLevel
}