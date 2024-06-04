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

export function Timeline() {
  const { size } = useThree()

  // careful, this will update everytime the horizontal zoom level changes
  // which can be intensive
  const cellWidth = useTimelineState(s => s.horizontalZoomLevel)
  const getVerticalCellPosition = useTimelineState(s => s.getVerticalCellPosition)

  const nbMaxShots = NB_MAX_SHOTS
  const nbMaxTracks = DEFAULT_NB_TRACKS

  // const aspect = size.width / viewport.width;

  const width = nbMaxShots * cellWidth
  const height = getVerticalCellPosition(0, nbMaxTracks)

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
        args={[width, height]}
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
        <Grid width={width} height={height} />
        <TopBarTimeScale width={width} height={height} />
        <LeftBarTrackScale width={width} height={height} />
        <Cells width={width} height={height} />
        <Cursor width={width} height={height} />
      </Plane>
    </mesh>
  );
};
