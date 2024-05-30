import { create } from "zustand"
import { ClapProject, ClapSegment } from "@aitube/clap"

import { TimelineStore } from "@/types/timeline"
import { getDefaultState } from "@/utils/getDefaultState"

export const useTimelineState = create<TimelineStore>((set, get) => ({
  ...getDefaultState(),
  setClap: (clap?: ClapProject) => {
    if (!clap || !Array.isArray(clap?.segments)) {
      console.log(`useTimelineState: empty clap, so resetting`)
      set({
        ...getDefaultState()
      })
      return
    }
    console.log(`useTimelineState: setting the clap to`, clap)
    set({
      ...getDefaultState(),
      clap,
      segments: clap.segments,
      visibleSegments: clap.segments,
    })
  },
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => {
    const { minHorizontalZoomLevel, maxHorizontalZoomLevel } = get()
    const horizontalZoomLevel = Math.min(maxHorizontalZoomLevel, Math.max(minHorizontalZoomLevel, newHorizontalZoomLevel))
    set({ horizontalZoomLevel })
  },
  
  setSegments: (segments: ClapSegment[] = []) => {
    set({ segments, visibleSegments: segments })
  },
  setVisibleSegments: (visibleSegments: ClapSegment[] = []) => { set({ visibleSegments }) },
}))
