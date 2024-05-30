
import * as THREE from "three"


import { DEFAULT_NB_TRACKS, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"
import { TimelineStoreState } from "@/types/timeline"

export function getDefaultState(): TimelineStoreState {

  return {
    clap: undefined,
    segments: [],
    segmentsChanged: 0,
    visibleSegments: [],
    nbIdentifiedTracks: 0,
    
    position: new THREE.Vector3(),
    scale: new THREE.Vector3(),
    initialized: false,
    beforeSteps: 0,
    afterSteps: 0,
    timeout: 0 as unknown as NodeJS.Timeout,

    minHorizontalZoomLevel: 2,
    maxHorizontalZoomLevel: 100,
    horizontalZoomLevel: 8, // 80,
    
    cellHeight: PROMPT_STEP_HEIGHT_IN_PX,
    cellWidth: 20,
    nbMaxTracks: DEFAULT_NB_TRACKS,

    trackToCellHeight: {
      // VIDEO
      0: PROMPT_STEP_HEIGHT_IN_PX * 3,

      // STORYBOARD
      1: PROMPT_STEP_HEIGHT_IN_PX * 3,
    },
  }
}