import * as THREE from "three"
import { ClapProject, ClapSegment } from "@aitube/clap"

import { ClapSegmentColorScheme, ClapTimelineTheme } from "./theme"
import { TimelineControlsImpl } from "@/components/controls/types"
import { TimelineCameraImpl } from "@/components/camera/types"
import { IsPlaying, JumpAt, TimelineCursorImpl, TogglePlayback } from "@/components/timeline/types"
import { RenderingStrategy, SegmentResolver } from "./rendering"

export type Track = {
  id: number
  name: string
  isPreview: boolean
  height: number
  hue: number
  occupied: boolean
  visible: boolean
}

export type Tracks = Track[]

export type ContentSizeMetrics = {
  nbMaxShots: number
  nbMaxTracks: number
  nbIdentifiedTracks: number
  contentWidth: number
  contentHeight: number
  tracks: Tracks
  cellWidth: number
  defaultCellHeight: number
  defaultSegmentDurationInSteps: number
  defaultSegmentLengthInPixels: number
  defaultMediaRatio: number
  defaultPreviewHeight: number
}



export type TimelineStoreProjectState = {
  clap?: ClapProject

  segments: ClapSegment[]
  segmentsChanged: number
  totalDurationInMs: number
  loadedSegments: ClapSegment[]
  visibleSegments: ClapSegment[]
  nbIdentifiedTracks: number

  isEmpty: boolean
  isLoading: boolean

  // -- metrics computed by computeContentSizeMetrics --
  nbMaxShots: number
  nbMaxTracks: number
  contentWidth: number
  contentHeight: number
  tracks: Tracks
  cellWidth: number
  defaultCellHeight: number
  defaultSegmentDurationInSteps: number
  defaultSegmentLengthInPixels: number
  defaultMediaRatio: number
  defaultPreviewHeight: number
  // -------------------------------------------------

  minHorizontalZoomLevel: number
  maxHorizontalZoomLevel: number
  originalHorizontalZoomLevel: number

  position: THREE.Vector3
  scale: THREE.Vector3
  initialized: boolean
  beforeSteps: number
  afterSteps: number
  timeout: NodeJS.Timeout

  typicalSegmentDurationInSteps: number

  // note: this is a mirror value of 
  // it might change rapidly (many times per seconds), so use with care!
  currentZoomLevel: number

  hoveredSegment?: ClapSegment

  // used to track silent in-line changes in the segments
  // that way we don't need to re-draw the whole thing
  silentChangesInSegments: number

  isDraggingCursor: boolean

  // used to track current camera position, at zoom level 1.0
  scrollX: number
  scrollY: number

  // used to determine how long it has been since we touch the scroll
  // we use this information to render the grid faster, by disabling all text
  // until a given debouncing time has elapsed
  resizeStartedAt: number
  isResizing: boolean

  // the final video, if available
  finalVideo?: ClapSegment

  // position of the current timestamp
  cursorTimestampAtInMs: number
}


export type TimelineStorePreferencesState = {
  // used to track the timeline state
  // this helps informing parent app user
  // that the timeline has been recreated inside the React tree for instance
  isReady: boolean

  // container width and height
  width: number
  height: number
  
  theme: ClapTimelineTheme
  
  /**
   * The timeline camera
   * 
   * Note: there will be no update of this value in case the camera settings have changed
   */
  timelineCamera?: TimelineCameraImpl

  /**
   * The timeline controls
   * 
   * Note: there will be no update of this value in case the controls settings have changed
   */
  timelineControls?: TimelineControlsImpl

  // ref to the cursor element
  timelineCursor?: TimelineCursorImpl

  topBarTimeScale?: THREE.Group<THREE.Object3DEventMap>
  leftBarTrackScale?: THREE.Group<THREE.Object3DEventMap>

  // those can be overridden
  segmentResolver: SegmentResolver
  jumpAt: JumpAt
  isPlaying: IsPlaying
  togglePlayback: TogglePlayback
}

export type TimelineStoreState = TimelineStoreProjectState & TimelineStorePreferencesState


export type TimelineStoreModifiers = {
  setClap: (clap?: ClapProject) => Promise<void>
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => void
  setSegments: (segments?: ClapSegment[]) => void
  setLoadedSegments: (loadedSegments?: ClapSegment[]) => void
  setVisibleSegments: (visibleSegments?: ClapSegment[]) => void
  getCellHeight: (trackNumber?: number) => number
  getVerticalCellPosition: (start: number, end: number) => number
  getSegmentColorScheme: (segment?: ClapSegment) => ClapSegmentColorScheme
  setHoveredSegment: (hoveredSegment?: ClapSegment) => void

  // used to track silent in-line changes in the segments
  // that way we don't need to re-draw the whole thing
  trackSilentChangeInSegments: () => void

  setTimelineCamera: (timelineCamera?: TimelineCameraImpl) => void
  setTimelineControls: (timelineControls?: TimelineControlsImpl) => void
  setTopBarTimeScale: (topBarTimeScale?: THREE.Group<THREE.Object3DEventMap>) => void
  setLeftBarTrackScale: (leftBarTrackScale?: THREE.Group<THREE.Object3DEventMap>) => void
  handleMouseWheel: ({ deltaX, deltaY }: { deltaX: number; deltaY: number }) => void
  toggleTrackVisibility: (trackId: number) => void
  setContainerSize: ({ width, height }: { width: number; height: number }) => void
  setTimelineCursor: (timelineCursor?: TimelineCursorImpl) => void
  setIsDraggingCursor: (isDraggingCursor: boolean) => void
  setCursorTimestampAtInMs: (cursorTimestampAtInMs?: number) => void
  setJumpAt: (jumpAt: JumpAt) => void
  setIsPlaying: (isPlaying: IsPlaying) => void
  setTogglePlayback: (togglePlayback: TogglePlayback) => void
  saveClapAs: (params: {
    // if embedded is true, the file will be larger, as all the content,
    // image, video, audio..
    // will be embedded into it (except the last big video)
    embedded?: boolean

    saveToFilePath?: string

    // note: the native select picker doesn't work in all browsers (eg. not in Firefox)
    // but it's not an issue, in our case we can save using Node/Electron + the cloud
    showTargetDirPopup?: boolean

    // some extra text to append to the file name
    extraLabel?: string
  }) => Promise<number>
  setSegmentResolver: (segmentResolver: SegmentResolver) => void
  resolveSegment: (segment: ClapSegment) => Promise<ClapSegment>
  findFreeTrack: (params: { startTimeInMs?: number; endTimeInMs?: number }) => number 
}

export type TimelineStore = TimelineStoreState & TimelineStoreModifiers
