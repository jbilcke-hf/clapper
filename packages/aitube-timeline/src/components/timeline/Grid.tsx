import React from "react"

import { DEFAULT_NB_TRACKS } from "@/constants"
import {
  useAxis,
  useVerticalGridLines,
  useHorizontalGridLines,
  useTimelineState
} from "@/hooks"

import { hslToHex } from "@/utils"

export function Grid() {
  const typicalSegmentDurationInSteps = useTimelineState(s => s.typicalSegmentDurationInSteps)
  const contentHeight = useTimelineState(s => s.contentHeight)


  const axis = useAxis()

  const verticalGridLines = useVerticalGridLines()
  const horizontalGridLines = useHorizontalGridLines()

  // console.log(`re-rendering <Grid>`)


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
  );
};
