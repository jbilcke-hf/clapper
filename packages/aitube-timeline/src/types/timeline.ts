import * as THREE from "three"
import { ClapProject, ClapSegment } from "@aitube/clap"

import { ClapSegmentColorScheme, ClapTimelineTheme } from "./theme"
import { TimelineControlsImpl } from "@/components/controls/types"
import { TimelineCameraImpl } from "@/components/camera/types"

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

export type TimelineStoreState = {
  clap?: ClapProject
  theme: ClapTimelineTheme

  segments: ClapSegment[]
  segmentsChanged: number
  visibleSegments: ClapSegment[]
  nbIdentifiedTracks: number

  isEmpty: boolean
  isLoading: boolean

  tracks: Tracks

  minHorizontalZoomLevel: number
  maxHorizontalZoomLevel: number
  horizontalZoomLevel: number
  originalHorizontalZoomLevel: number

  position: THREE.Vector3
  scale: THREE.Vector3
  initialized: boolean
  beforeSteps: number
  afterSteps: number
  timeout: NodeJS.Timeout
  cellHeight: number
  cellWidth: number
  nbMaxTracks: number

  typicalSegmentDurationInSteps: number

  // note: this is a mirror value of 
  // it might change rapidly (many times per seconds), so use with care!
  currentZoomLevel: number

  hoveredSegment?: ClapSegment

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

  // max height of the timeline
  maxHeight: number

  // used to track current camera position, at zoom level 1.0
  scrollX: number
  scrollY: number

  // used to determine how long it has been since we touch the scroll
  // we use this information to render the grid faster, by disabling all text
  // until a given debouncing time has elapsed
  resizeStartedAt: number
  isResizing: boolean

  topBarTimelineScale?: THREE.Group<THREE.Object3DEventMap>
  leftBarTrackScale?: THREE.Group<THREE.Object3DEventMap>
}


export type TimelineStoreModifiers = {
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => void
  setSegments: (segments?: ClapSegment[]) => void
  setVisibleSegments: (visibleSegments?: ClapSegment[]) => void
  getCellHeight: (trackNumber?: number) => number
  getVerticalCellPosition: (start: number,end: number) => number
  getSegmentColorScheme: (segment?: ClapSegment) => ClapSegmentColorScheme
  setHoveredSegment: (hoveredSegment?: ClapSegment) => void
  setTimelineCamera: (timelineCamera?: TimelineCameraImpl) => void
  setTimelineControls: (timelineControls?: TimelineControlsImpl) => void
  setTopBarTimelineScale: (topBarTimelineScale?: THREE.Group<THREE.Object3DEventMap>) => void
  setLeftBarTrackScale: (leftBarTrackScale?: THREE.Group<THREE.Object3DEventMap>) => void
  handleMouseWheel: ({ deltaX, deltaY }: { deltaX: number, deltaY: number }) => void
  toggleTrackVisibility: (trackId: number) => void
}

export type TimelineStore = TimelineStoreState & TimelineStoreModifiers
