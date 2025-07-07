import React, { useMemo } from "react"

import { DEFAULT_NB_TRACKS } from "@/constants"
import {
  useAxis,
  useVerticalGridLines,
  useHorizontalGridLines,
  useTimeline
} from "@/hooks"

import { hslToHex } from "@/utils"

export function Grid() {
  console.log(`component <Grid /> called`)
  // we have a problem in this component, it creates a 0.25 seconds lag
  const typicalSegmentDurationInSteps = useTimeline(s => s.typicalSegmentDurationInSteps)
  const contentHeight = useTimeline(s => s.contentHeight)


  const axis = useAxis()

  const verticalGridLines = useVerticalGridLines()
  const horizontalGridLines = useHorizontalGridLines()

  const memoizedGrid = useMemo(() => {
    console.log(`re-rendering <Grid> (expensive!), due to: ${JSON.stringify({
      typicalSegmentDurationInSteps,
      contentHeight,
    }, null, 2)}`)
    return (
      <>
        <group position={[0, contentHeight / 2, -12]}>
        {verticalGridLines.map((lineGeometry, idx) => (
          <line
            // @ts-ignore
            geometry={lineGeometry}
            key={idx}>
            <lineBasicMaterial
              attach="material"
              color={
                idx % typicalSegmentDurationInSteps === 0
                ? hslToHex(0, 0, 70)
                : hslToHex(0, 0, 55)
              }
              linewidth={1}
            />
          </line>
        ))}
        </group>

        <group position={[0, contentHeight / 2, -12]}>
        {horizontalGridLines.map((lineGeometry, idx) => (
          <line
            // @ts-ignore
            geometry={lineGeometry}
            key={idx}>
            <lineBasicMaterial
              attach="material"
              color={
                hslToHex(0, 0, 70)
              }
              linewidth={1}
            />
          </line>
        ))}
        </group>

        <group position={[0, contentHeight / 2, -12]}>
        {axis.map((lineGeometry, idx) => (
          <line
            // @ts-ignore
            geometry={lineGeometry}
            key={idx}>
            <lineBasicMaterial
              attach="material"
              color={"#ffffff"}
              transparent
              opacity={0.3}
              linewidth={1}
            />
          </line>
        ))}
        </group>

      </>
    )
  }, [
    typicalSegmentDurationInSteps,
    contentHeight,
  ])
  
  return memoizedGrid
};
