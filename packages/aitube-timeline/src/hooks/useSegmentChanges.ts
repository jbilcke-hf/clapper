import { useEffect, useRef, useState } from "react"

import { useTimeline } from "./useTimeline"
import { TimelineSegment } from "@/types"

function getKey(segment: TimelineSegment) {
  const keyItems = [
    segment.id,

    // properties of the timeline segment
    segment.startAtLine,
    segment.endAtLine,
    segment.visibility,
    segment.isSelected,
    segment.isHovered,
    segment.isHoveredOnBody,
    segment.isHoveredOnLeftHandle,
    segment.isHoveredOnRightHandle,
    segment.isGrabbedOnBody,
    segment.isGrabbedOnLeftHandle,
    segment.isGrabbedOnRightHandle,
    segment.isActive,
    segment.isPlaying,
    segment.editionStatus,

    // properties of the segment
    segment.status,
    segment.label,
    segment.prompt,
    segment.assetUrl.slice(0, 1024),
  ]

  const segmentKey = keyItems.join("✇✇")

  return segmentKey
}

/**
 * Can be used to subscribe to individual changes in a segment
 * 
 * Note: it is not efficient to track everything
 * 
 * @param segment
 * @returns 
 */
export function useSegmentChanges(segment: TimelineSegment): number {
  const [changes, setChanges] = useState(0)
  const silentChangesInSegments = useTimeline(s => s.silentChangesInSegments)

  const changesRef = useRef(0)
  const hashRef = useRef(getKey(segment))

  useEffect(() => {
    // at this stage, *ANY* segment might have changed
    // so we need to recompute some kind of hash change
    const newHash = getKey(segment)
    if (hashRef.current === newHash) { return }
    setChanges(changesRef.current++)
  }, [silentChangesInSegments])
 
  return changes
}