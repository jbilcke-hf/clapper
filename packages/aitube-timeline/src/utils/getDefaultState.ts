
import * as THREE from "three"


import { DEFAULT_NB_TRACKS, pastel, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"
import { TimelineStoreState } from "@/types/timeline"

export function getDefaultState(): TimelineStoreState {

  return {
    clap: undefined,
    theme: pastel,
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

    // horizontalZoomLevel is the WIDTH of a grid cell, in pixels
    // by initializing it with PROMPT_STEP_HEIGHT_IN_PX (the default grid cell HEIGHT in pixels)
    // we can achieve a square shape
    horizontalZoomLevel: PROMPT_STEP_HEIGHT_IN_PX,
    originalHorizontalZoomLevel: PROMPT_STEP_HEIGHT_IN_PX,
    
    cellHeight: PROMPT_STEP_HEIGHT_IN_PX,

    // @deprecated
    cellWidth: PROMPT_STEP_HEIGHT_IN_PX,

    nbMaxTracks: DEFAULT_NB_TRACKS,

    trackToCellHeight: {
      // VIDEO
      0: PROMPT_STEP_HEIGHT_IN_PX * 3,

      // STORYBOARD
      1: PROMPT_STEP_HEIGHT_IN_PX * 3,
    },
    typicalSegmentDurationInSteps: 4,

    currentZoomLevel: 1.0,
  }
}