import React, { useEffect } from "react"
import { Plane } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"

import { DEFAULT_NB_TRACKS } from "@/constants"
import {
  useTimelineState
} from "@/hooks"


import { NB_MAX_SHOTS } from "@/constants/grid"
import { Grid } from "./Grid"
import { Cells } from "./Cells"
import { TopBarTimeScale } from "./TopBarTimeScale"
import { clamp } from "@/utils/clamp"
import { LeftBarTrackScale } from "./LeftBarTrackScale"
import { Cursor } from "./Cursor"

export function Timeline({ width, height }: { width: number; height: number }) {
  const { size } = useThree()

  const setContainerSize = useTimelineState(s => s.setContainerSize)
  useEffect(() => {
    setContainerSize({ width, height })
  }, [width, height, setContainerSize])

  const contentHeight = useTimelineState(s => s.contentHeight)
  const contentWidth = useTimelineState(s => s.contentWidth)

  // console.log(`re-rendering <Timeline>`)
  return (
    <mesh
      // this any is a code smell, we are forcing the react spring data structure into
      // the three one - feel free to fix this
      // {...dragSpring as any}
      // {...bindDrag()}
      position={[0,0,0]}
    >
      <Plane
        args={[contentWidth, contentHeight]}
        position={[
          -(size.width / 2),
          0,
          -1
        ]}>
        {/* background */}
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0}
          
        />
        {/*
        not a fan of all those props.. I think we could drop this
        */}
        <Grid />
        <TopBarTimeScale />
        <LeftBarTrackScale />
        <Cells />
        <Cursor />
      </Plane>
    </mesh>
  );
};
