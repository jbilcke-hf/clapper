import * as THREE from "three"

import { DEFAULT_NB_TRACKS, pastel, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"
import { TimelineStoreState } from "@/types/timeline"
import { RenderingStrategy } from "@/types"
import { NB_MAX_SHOTS } from "@/constants/grid"

// those settings will change between .clap project reloads
export function getDefaultProjectState() {
  return {
    clap: undefined,
    segments: [],
    segmentsChanged: 0,
    loadedSegments: [],
    visibleSegments: [],

    isEmpty: true,
    isLoading: false,

    position: new THREE.Vector3(),
    scale: new THREE.Vector3(),
    initialized: false,
    beforeSteps: 0,
    afterSteps: 0,
    timeout: 0 as unknown as NodeJS.Timeout,

    minHorizontalZoomLevel: 6,
    maxHorizontalZoomLevel: 100,
    originalHorizontalZoomLevel: PROMPT_STEP_HEIGHT_IN_PX,
    
    nbMaxShots: NB_MAX_SHOTS,
    nbMaxTracks: DEFAULT_NB_TRACKS,
    nbIdentifiedTracks: 0,
    contentWidth: 1024,
    contentHeight: 800,
    cellWidth: PROMPT_STEP_HEIGHT_IN_PX,
    tracks: [],
    defaultCellHeight: PROMPT_STEP_HEIGHT_IN_PX,
    defaultSegmentDurationInSteps: 4,
    defaultSegmentLengthInPixels: 4 * PROMPT_STEP_HEIGHT_IN_PX,
    defaultMediaRatio: 896 / 512,
    defaultPreviewHeight: PROMPT_STEP_HEIGHT_IN_PX,
    typicalSegmentDurationInSteps: 4,

    // @deprecated, we now use a static WebGL camera zoom level set at 1.0
    currentZoomLevel: 1.0, 

    hoveredSegment: undefined,

    scrollX: 0,
    scrollY: 450,
    resizeStartedAt: 0,
    isResizing: false,

    finalVideo: undefined,
    
    cursorTimestampAt: 0,
  }
}

// those settings will NOT changes between .clap project reloads
export function getDefaultPreferencesState() {
  return {
    isReady: false,
    width: 1024,
    height: 800,
    theme: pastel,
    timelineControls: undefined,
    topBarTimelineScale: undefined,
    leftBarTrackScale: undefined,
    timelineCursor: undefined,
    imageRenderingStrategy: RenderingStrategy.ON_DEMAND,
    videoRenderingStrategy: RenderingStrategy.ON_DEMAND,
    soundRenderingStrategy: RenderingStrategy.ON_DEMAND,
    voiceRenderingStrategy: RenderingStrategy.ON_DEMAND,
    musicRenderingStrategy: RenderingStrategy.ON_DEMAND,
    segmentRenderer: undefined,
  }
}

export function getDefaultState(): TimelineStoreState {
  return {
    ...getDefaultProjectState(),
    ...getDefaultPreferencesState(),
  }
}