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
import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "@/constants/themes"

export function Timeline({ width, height }: { width: number; height: number }) {
  const { size } = useThree()

  const setContainerSize = useTimeline(s => s.setContainerSize)
  useEffect(() => {
    setContainerSize({ width, height })
  }, [width, height, setContainerSize])

  const contentHeight = useTimeline(s => s.contentHeight)
  const contentWidth = useTimeline(s => s.contentWidth)
  const addClipAtPointer = useTimeline(s => s.addClipAtPointer)

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
        ]}
        onDoubleClick={(e) => {
          if (
            e.offsetX < leftBarTrackScaleWidth ||
            e.offsetY < topBarTimeScaleHeight
          ) {
            return
          }

          void addClipAtPointer({
            offsetX: e.offsetX,
            offsetY: e.offsetY,
          })
          e.stopPropagation()
          return false
        }}>
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0}
        />
        <Grid />
        <TopBarTimeScale />
        <LeftBarTrackScale />
        <Cells />
        <Cursor />
      </Plane>
    </mesh>
  );
};
