import { useEffect, useRef, useState } from "react"

import { useTimeline } from "./useTimeline"
import { ClapSegment } from "@aitube/clap"

function getKey(segment: ClapSegment) {
  const keyItems = [
    segment.id,
    segment.label,
    segment.prompt,
    segment.assetUrl.slice(0, 1024),
    segment.status
  ]

  const hash = keyItems.join("::")

  return hash
}

/**
 * Can be used to subscribe to individual changes in a segment
 * 
 * Note: it is not efficient to track everything
 * 
 * @param segment
 * @returns 
 */
export function useSegmentChanges(segment: ClapSegment): number {
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