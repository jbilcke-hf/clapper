import * as THREE from "three"
import { create } from "zustand"
import { ClapSegment } from "@aitube/clap"


import { TimelineState } from "@/types/timeline"
import { DEFAULT_NB_TRACKS, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"

export const useTimelineState = create<TimelineState>((set, get) => ({
  segments: [],
  segmentsChanged: 0,
  visibleSegments: [],

  position: new THREE.Vector3(),
  scale: new THREE.Vector3(),
  initialized: false,
  beforeSteps: 0,
  afterSteps: 0,
  timeout: 0 as unknown as NodeJS.Timeout,

  minHorizontalZoomLevel: 25,
  maxHorizontalZoomLevel: 150,
  horizontalZoomLevel: 20, // 80,
  
  cellHeight: PROMPT_STEP_HEIGHT_IN_PX,
  cellWidth: 20,
  nbMaxTracks: DEFAULT_NB_TRACKS,

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
