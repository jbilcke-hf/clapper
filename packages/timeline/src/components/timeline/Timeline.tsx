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

export function Timeline({ width, height }: { width: number; height: number }) {
  const { size } = useThree()

  const setContainerSize = useTimeline(s => s.setContainerSize)
  useEffect(() => {
    setContainerSize({ width, height })
  }, [width, height, setContainerSize])

  const contentHeight = useTimeline(s => s.contentHeight)
  const contentWidth = useTimeline(s => s.contentWidth)

  /*
  console.log(`Issue with size? `, {
    "width (coming from parent app)": width,
    "content width": contentWidth,
    "WebGL context's size.width": size.width,
  })
    */
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
