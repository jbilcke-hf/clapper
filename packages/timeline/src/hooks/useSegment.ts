import { useEffect, useState } from "react"

import { useTimeline } from "./useTimeline"
import { TimelineSegment } from "@/types"

/**
 * Can be used to subscribe to a segment
 * @param segment
 * @returns 
 */
export function useSegment(segmentId: string): TimelineSegment | undefined {
  const [segment, setSegment] = useState<TimelineSegment>()
  const atLeastOneSegmentChanged = useTimeline(s => s.atLeastOneSegmentChanged)

  useEffect(() => {
    // TODO: not implemented yet
  }, [atLeastOneSegmentChanged])
 
  return segment
}