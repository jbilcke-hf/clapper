import { SegmentVisibility } from "@/types"

// used for sort
export const segmentVisibilityPriority: Record<SegmentVisibility, number> = {
  // the segment is visible, and the user explicitly requested to render it before the others
  [SegmentVisibility.DEMANDED]: 3,

  // TODO: add some implicit intermediary priority options
  // such as SELECTED, HOVERED..

  // the segment (or at least a portion of it) is currently visible in the sliding window
  [SegmentVisibility.VISIBLE]: 2,

  // the segment is hidden, but not too far from the sliding window
  [SegmentVisibility.BUFFERED]: 1,

  // fully hidden, far from the sliding window
  [SegmentVisibility.HIDDEN]: 0
}
