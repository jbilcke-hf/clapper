import { ClapMeta, newClap } from "@aitube/clap"

import { DEFAULT_NB_TRACKS, pastel, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"
import { TimelineStorePreferencesState, TimelineStoreProjectState, TimelineStoreState } from "@/types/timeline"
import { DEFAULT_DURATION_IN_MS_PER_STEP, NB_MAX_SHOTS } from "@/constants/grid"

// those settings WILL change between .clap project reloads
export function getDefaultProjectState(): TimelineStoreProjectState {
  return {
    ...newClap().meta,
    scenes: [],
    segments: [],
    loadedSegments: [],
    visibleSegments: [],
    lineNumberToMentionedSegments: {},

    entities: [],
    entityIndex: {},
    entitiesChanged: 0,

    isLoading: false,
    showBetaFeatures: true,

    initialized: false,
    timeout: 0 as unknown as NodeJS.Timeout,

    minHorizontalZoomLevel: 6,
    maxHorizontalZoomLevel: 100,
    originalHorizontalZoomLevel: PROMPT_STEP_HEIGHT_IN_PX,
    
    nbMaxShots: NB_MAX_SHOTS,
    nbMaxTracks: DEFAULT_NB_TRACKS,
    nbIdentifiedTracks: 0,
    contentWidth: 4096,
    contentHeight: 800,
    cellWidth: PROMPT_STEP_HEIGHT_IN_PX,
    tracks: [],
    defaultCellHeight: PROMPT_STEP_HEIGHT_IN_PX,
    defaultSegmentDurationInSteps: 4,
    defaultSegmentLengthInPixels: 4 * PROMPT_STEP_HEIGHT_IN_PX,
    defaultImageRatio: 896 / 512,
    defaultPreviewHeight: PROMPT_STEP_HEIGHT_IN_PX,
    typicalSegmentDurationInSteps: 4,

    // @deprecated, we now use a static WebGL camera zoom level set at 1.0
    currentZoomLevel: 1.0, 

    // for developer convenience, the information about hovered, edited, selected..
    // is both present inside each segment and also aliased here, for fast access
    hoveredSegment: undefined,
    editedSegment: undefined,
    selectedSegments: [],
    
    allSegmentsChanged: 0,
    atLeastOneSegmentChanged: 0,
  
    // the purpose is to allow an external component
    // to modify the segments in-line, and then trigger a redraw
    silentChangesInSegment: {},

    scrollX: 0,
    scrollY: 450,
    resizeStartedAt: 0,
    isResizing: false,

    finalVideo: undefined,
    
    cursorTimestampAtInMs: 0,
    isDraggingCursor: false,
  }
}

// those settings will NOT changes between .clap project reloads
export function getDefaultPreferencesState(): TimelineStorePreferencesState {
  return {
    canvas: undefined,
    isReady: false,
    containerWidth: 1800,
    containerHeight: 800,
    theme: pastel,

    durationInMsPerStep: DEFAULT_DURATION_IN_MS_PER_STEP,
  
    timelineControls: undefined,
    topBarTimeScale: undefined,
    leftBarTrackScale: undefined,
    timelineCursor: undefined,

    // note: those are stateless functions, use as empty
    // mocls that are normally overriden at runtime
    segmentResolver: async (segment) => segment,
    jumpAt: () => {},
    isPlaying: () => false,
    togglePlayback: () => ({ wasPlaying: false, isPlaying: false }),

    invalidate: () => {},
  }
}

export function getDefaultState(): TimelineStoreState {
  return {
    ...getDefaultProjectState(),
    ...getDefaultPreferencesState(),
  }
}