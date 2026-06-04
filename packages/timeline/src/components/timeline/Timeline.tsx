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

function TrackClipZones({
  contentWidth,
  containerWidth,
}: {
  contentWidth: number
  containerWidth: number
}) {
  const tracks = useTimeline(s => s.tracks)
  const cellWidth = useTimeline(s => s.cellWidth)
  const durationInMsPerStep = useTimeline(s => s.durationInMsPerStep)
  const getCellHeight = useTimeline(s => s.getCellHeight)
  const getVerticalCellPosition = useTimeline(s => s.getVerticalCellPosition)
  const createClip = useTimeline(s => s.createClip)

  return (
    <>
      {tracks.map(track => {
        const cellHeight = getCellHeight(track.id)
        return (
          <Plane
            key={`clip-zone-${track.id}`}
            args={[Math.max(contentWidth, 1), cellHeight]}
            position={[
              contentWidth / 2,
              -getVerticalCellPosition(0, track.id) - (cellHeight / 2),
              -11,
            ]}
            onDoubleClick={(event) => {
              const timelineX = Math.max(0, event.point.x + (containerWidth / 2))
              createClip({
                track: track.id,
                startTimeInMs: (timelineX / cellWidth) * durationInMsPerStep,
              })
              event.stopPropagation()
            }}
          >
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </Plane>
        )
      })}
    </>
  )
}

export function Timeline({ width, height }: { width: number; height: number }) {
  const { size } = useThree()

  const setContainerSize = useTimeline(s => s.setContainerSize)
  useEffect(() => {
    setContainerSize({ width, height })
  }, [width, height, setContainerSize])

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
        <TrackClipZones contentWidth={contentWidth} containerWidth={width} />
        <Cells />
        <Cursor />
      </Plane>
    </mesh>
  );
};
