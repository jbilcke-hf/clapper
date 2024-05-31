import * as THREE from "three"
import { ClapProject, ClapSegment } from "@aitube/clap"
import { ClapSegmentColorScheme, ClapTimelineTheme } from "./theme"

export type TimelineStoreState = {
  clap?: ClapProject
  theme: ClapTimelineTheme

  segments: ClapSegment[]
  segmentsChanged: number
  visibleSegments: ClapSegment[]
  nbIdentifiedTracks: number

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

  trackToCellHeight: Record<number, number>
  typicalSegmentDurationInSteps: number

  // note: this is a mirror value of 
  // it might change rapidly (many times per seconds), so use with care!
  currentZoomLevel: number
}


export type TimelineStoreModifiers = {
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => void
  setSegments: (segments?: ClapSegment[]) => void
  setVisibleSegments: (visibleSegments?: ClapSegment[]) => void
  getCellHeight: (trackNumber?: number) => number
  getVerticalCellPosition: (start: number,end: number) => number
  getSegmentColorScheme: (segment?: ClapSegment) => ClapSegmentColorScheme
}


export type TimelineStore = TimelineStoreState & TimelineStoreModifiers
