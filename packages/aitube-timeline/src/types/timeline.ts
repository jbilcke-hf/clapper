import * as THREE from "three"
import { ClapSegment } from "@aitube/clap"

export type TimelineState = {
  segments: ClapSegment[]
  segmentsChanged: number
  visibleSegments: ClapSegment[]

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

  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => void
  setSegments: (segments?: ClapSegment[]) => void
  setVisibleSegments: (visibleSegments?: ClapSegment[]) => void
}