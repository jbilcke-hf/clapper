import * as THREE from "three"
import { ClapEntity, ClapMeta, ClapProject, ClapScene, ClapSegment, ClapTracks } from "@aitube/clap"

import { ClapSegmentColorScheme, ClapTimelineTheme } from "./theme"
import { TimelineControlsImpl } from "@/components/controls/types"
import { TimelineCameraImpl } from "@/components/camera/types"
import { IsPlaying, JumpAt, TimelineCursorImpl, TogglePlayback } from "@/components/timeline/types"
import { RenderingStrategy, SegmentResolver } from "./rendering"

export enum SegmentVisibility {
  // the segment is visible, and the user explicitly requested to render it before the others
  DEMANDED = "DEMANDED",

  // TODO: add some implicit intermediary priority options
  // such as SELECTED, HOVERED..

  // the segment (or at least a portion of it) is currently visible in the sliding window
  VISIBLE = "VISIBLE",

  // the segment is hidden, but not too far from the sliding window
  BUFFERED = "BUFFERED",

  // fully hidden, far from the sliding window
  HIDDEN = "HIDDEN"
}


export enum SegmentEditionStatus {
  // the segment is frozen and read-only and cannot be edited
  // this is useful if you want a track to be read-only
  LOCKED = "LOCKED",

  // the segment is editable and cannot be edited
  EDITABLE = "EDITABLE",

  // the segment is being resized
  RESIZING = "RESIZING",

  // the segment is being dragged around
  DRAGGING = "DRAGGING",

  // the segment's is being edited (eg. in the edit pop-over)
  EDITING = "EDITING",
}

export enum SegmentArea {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  MIDDLE = 'MIDLE'
}

// some data can only exist inside a browser session (eg. AudioBuffer)
// or at least data that only make sense on client side
// we could put things like a mouse hover or selected state in here
// or simply large, recursive elements (like the scene)
export type BrowserOnlySegmentData = {

  // used to give more context to the LLM, so it can have the full text of the scene
  scene?: ClapScene

  // used for convenience, to easily match the script editor with segments
  startAtLine?: number
  endAtLine?: number

  audioBuffer?: AudioBuffer

  visibility: SegmentVisibility

  // Cache for textures
  textures: Record<string, THREE.Texture>

  /**
   * the following fields have been added to this type only very recently
   * and their implementation is not finished,
   * so they may not contain the value you wish for.
   * 
   * please don't rely on them just yet.
   * 
   * Moreover they will be undefined by default, so you need 
   * const isSelected = rs.isSelected || false
   * const editionStatus = rs.editionStatus || SegmentEditionStatus.EDITABLE
   */
  // of the segment is currently selected by the user
  isSelected: boolean

  // if the segment is hovered by the mouse (anywhere)
  // note: if the mouse is pressed, this will also trigger this to TRUE
  isHovered: boolean
  
  // if the segment's body is hovered by the mouse
  isHoveredOnBody: boolean

  // if the segment's left handle is hovered by the mouse
  isHoveredOnLeftHandle: boolean

  // if the segment's right handle is hovered by the mouse
  isHoveredOnRightHandle: boolean

  // if the segment's body is being grabbed by the mouse
  isGrabbedOnBody: boolean

  // if the segment's left handle is being grabbed by the mouse
  isGrabbedOnLeftHandle: boolean

  // if the segment's right handle is being grabbed by the mouse
  isGrabbedOnRightHandle: boolean

  // if the segment is currently crossed by the timeline cursor
  isActive: boolean
  
  // if the segment is currently being played
  isPlaying: boolean
  
  editionStatus: SegmentEditionStatus
}

export type TimelineSegment = ClapSegment & BrowserOnlySegmentData

export type ContentSizeMetrics = {
  nbMaxShots: number
  nbMaxTracks: number
  nbIdentifiedTracks: number
  contentWidth: number
  contentHeight: number
  tracks: ClapTracks
  cellWidth: number
  defaultCellHeight: number
  defaultSegmentDurationInSteps: number
  defaultSegmentLengthInPixels: number
  defaultMediaRatio: number
  defaultPreviewHeight: number
}



export type TimelineStoreProjectState = {
  meta: ClapMeta

  segments: TimelineSegment[]

  totalDurationInMs: number
  loadedSegments: TimelineSegment[]
  visibleSegments: TimelineSegment[]
  nbIdentifiedTracks: number
  lineNumberToMentionedSegments: Record<number, TimelineSegment[]>

  entities: ClapEntity[]
  entityIndex: Record<string, ClapEntity>
  entitiesChanged: number

  isEmpty: boolean
  isLoading: boolean

  // -- metrics computed by computeContentSizeMetrics --
  nbMaxShots: number
  nbMaxTracks: number
  contentWidth: number
  contentHeight: number
  tracks: ClapTracks
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

  initialized: boolean
  timeout: NodeJS.Timeout

  typicalSegmentDurationInSteps: number

  // note: this is a mirror value of 
  // it might change rapidly (many times per seconds), so use with care!
  currentZoomLevel: number

  // for developer convenience, the information about hovered, edited, selected..
  // is both present inside each segment and also aliased here, for fast access
  hoveredSegment?: TimelineSegment
  editedSegment?: TimelineSegment
  selectedSegments: TimelineSegment[]

  allSegmentsChanged: number
  atLeastOneSegmentChanged: number

  // the purpose is to allow an external component
  // to modify the segments in-line, and then trigger a redraw
  silentChangesInSegment: Record<string, number>

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
  finalVideo?: TimelineSegment

  // position of the current timestamp
  cursorTimestampAtInMs: number
}


export type TimelineStorePreferencesState = {
  canvas?: HTMLCanvasElement
  
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
  setCanvas: (canvas?: HTMLCanvasElement) => void
  clear: () => void
  setClap: (clap?: ClapProject) => Promise<void>
  getClap: () => Promise<ClapProject>
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => void
  setSegments: (segments?: TimelineSegment[]) => void
  setLoadedSegments: (loadedSegments?: TimelineSegment[]) => void
  setVisibleSegments: (visibleSegments?: TimelineSegment[]) => void
  getCellHeight: (trackNumber?: number) => number
  getVerticalCellPosition: (start: number, end: number) => number
  getSegmentColorScheme: (segment: TimelineSegment) => ClapSegmentColorScheme
  setHoveredSegment: (params?: {
    hoveredSegment?: TimelineSegment
    area?: SegmentArea 
  }) => void
  setEditedSegment: (editedSegment?: TimelineSegment) => void
  setSelectedSegment: (params?: {
    segment?: TimelineSegment
    isSelected?: boolean
    onlyOneSelectedAtOnce?: boolean
  }) => void

  // the purpose of those functions is to allow an external component
  // to modify the segments in-line, and then trigger a redraw
  trackSilentChangeInSegment: (segmentId: string) => void
  trackSilentChangeInSegments: (segmentIds: string[]) => void

  setTimelineTheme: (theme: ClapTimelineTheme) => void
  setTimelineCamera: (timelineCamera?: TimelineCameraImpl) => void
  setTimelineControls: (timelineControls?: TimelineControlsImpl) => void
  setTopBarTimeScale: (topBarTimeScale?: THREE.Group<THREE.Object3DEventMap>) => void
  setLeftBarTrackScale: (leftBarTrackScale?: THREE.Group<THREE.Object3DEventMap>) => void
  setScrollX: (scrollX: number) => void
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
  resolveSegment: (segment: TimelineSegment) => Promise<TimelineSegment>
  addSegments: ({
    segments,
    startTimeInMs,
    track,
  }: {
    segments?: TimelineSegment[]
    startTimeInMs?: number
    track?: number
  }) => Promise<void>
  assignTrack: ({
    segment,
    track,
    triggerChange,
  }: {
    segment: TimelineSegment
    track: number
    triggerChange?: boolean
  }) => Promise<void>
  addSegment: ({
    segment,
    startTimeInMs,
    track,
  }: {
    segment: TimelineSegment
    startTimeInMs?: number
    track?: number
}) => Promise<void>

  /**
   * Find an available free track
   * 
   * @param params 
   * @returns 
   */
  findFreeTrack: (params: { startTimeInMs?: number; endTimeInMs?: number }) => number


  fitSegmentToAssetDuration: (segment: TimelineSegment, durationInMs?: number) => Promise<void>

  /**
   * Delete segments from the 
   * @param ids 
   * @returns 
   */
  deleteSegments: (ids: string[]) => void

  addEntities: (entities: ClapEntity[]) => Promise<void>
  updateEntities: (entities: ClapEntity[]) => Promise<void>
  deleteEntities: (entities: (ClapEntity|string)[]) => Promise<void>
}

export type TimelineStore = TimelineStoreState & TimelineStoreModifiers
