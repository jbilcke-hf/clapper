import { Plane } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect } from "react"

import {
  useTimeline
} from "@/hooks"

import { Cells } from "./Cells"
import { Cursor } from "./Cursor"
import { Grid } from "./Grid"
import { LeftBarTrackScale } from "./LeftBarTrackScale"
import { TopBarTimeScale } from "./TopBarTimeScale"
import { leftBarTrackScaleWidth } from "@/constants"

/**
 * Invisible click zones over each track for creating clips.
 */
function TrackDropZones({ width }: { width: number }) {
  const tracks = useTimeline(s => s.tracks)
  const getCellHeight = useTimeline(s => s.getCellHeight)
  const getVerticalCellPosition = useTimeline(s => s.getVerticalCellPosition)
  const durationInMsPerStep = useTimeline(s => s.durationInMsPerStep)
  const cellWidth = useTimeline(s => s.cellWidth)
  const createClipOnTrack = useTimeline(s => s.createClipOnTrack)
  const setDragHoveredTrack = useTimeline(s => s.setDragHoveredTrack)
  const isDraggingSegment = useTimeline(s => s.isDraggingSegment)

  const zones = tracks.filter(t => t.visible).map(track => {
    const cellH = getCellHeight(track.id)
    const posY = -getVerticalCellPosition(0, track.id) - (cellH / 2)
    // position the zone to the right of the left bar
    const zoneWidth = Math.max(width, 2000)
    const zoneX = leftBarTrackScaleWidth + (zoneWidth / 2)

    return (
      <Plane
        key={`drop-${track.id}`}
        args={[zoneWidth, cellH]}
        position={[zoneX, posY, -10]}
        onPointerMove={(e) => {
          // track which track is hovered during drag operations
          if (isDraggingSegment) {
            setDragHoveredTrack(track.id)
          }
        }}
        onPointerOut={() => {
          if (isDraggingSegment) {
            setDragHoveredTrack(null)
          }
        }}
        onDoubleClick={(e) => {
          // calculate timestamp from click position
          const pointX = e.point.x
          const adjustedMs = ((pointX) / cellWidth) * durationInMsPerStep
          const snappedMs = Math.max(0, Math.round(adjustedMs / durationInMsPerStep) * durationInMsPerStep)
          createClipOnTrack(track.id, snappedMs)
          e.stopPropagation()
        }}
      >
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </Plane>
    )
  })

  return <>{zones}</>
}

export function Timeline({ width, height }: { width: number; height: number }) {
  const { size } = useThree()

  const setContainerSize = useTimeline(s => s.setContainerSize)

  useEffect(() => {
    setContainerSize({ width, height })
  }, [width, height, setContainerSize])

  // global pointer event listeners for drag operations
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // read latest state from store to avoid stale closures
      const state = useTimeline.getState()
      if (state.isDraggingSegment) {
        state.updateDragSegment(e.clientX, e.clientY, state.containerWidth)
      }
    }
    const handlePointerUp = () => {
      const state = useTimeline.getState()
      if (state.isDraggingSegment) {
        state.endDragSegment()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }
    }
  }, []) // empty deps: always reads fresh state from store

  const contentHeight = useTimeline(s => s.contentHeight)
  const contentWidth = useTimeline(s => s.contentWidth)

  // console.log(`re-rendering <Timeline>`)
  return (
    <mesh
      position={[0,0,0]}
    >
      <Plane
        args={[contentWidth, contentHeight]}
        position={[
          -(size.width / 2),
          0,
          -1
        ]}>
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0}
        />
        <Grid />
        <TopBarTimeScale />
        <LeftBarTrackScale />
        <TrackDropZones width={contentWidth} />
        <Cells />
        <Cursor />
      </Plane>
    </mesh>
  );
};
