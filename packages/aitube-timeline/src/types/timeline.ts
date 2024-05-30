import * as THREE from "three"
import { ClapProject, ClapSegment } from "@aitube/clap"

export type TimelineStoreState = {
  clap?: ClapProject

  segments: ClapSegment[]
  segmentsChanged: number
  visibleSegments: ClapSegment[]
  nbIdentifiedTracks: number

  minHorizontalZoomLevel: number
  maxHorizontalZoomLevel: number
  horizontalZoomLevel: number

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
}


export type TimelineStoreModifiers = {
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => void
  setSegments: (segments?: ClapSegment[]) => void
  setVisibleSegments: (visibleSegments?: ClapSegment[]) => void
  getCellHeight: (segmentOrTrackNumber?: number | ClapSegment) => number
  getVerticalCellPosition: (start: number,end: number) => number
}


export type TimelineStore = TimelineStoreState & TimelineStoreModifiers
