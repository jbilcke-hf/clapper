import React from "react"

import { DEFAULT_NB_TRACKS } from "@/constants"
import {
  useAxis,
  useVerticalGridLines,
  useHorizontalGridLines,
  useTimelineState
} from "@/hooks"

import { hslToHex } from "@/utils"
import { NB_MAX_SHOTS } from "@/constants/grid"

export function Grid({
  width,
  height
}: {
  width: number
  height: number
}) {
  const typicalSegmentDurationInSteps = useTimelineState(s => s.typicalSegmentDurationInSteps)

  const nbMaxShots = NB_MAX_SHOTS
  const nbMaxTracks = DEFAULT_NB_TRACKS

  const axis = useAxis(width, height)

  const verticalGridLines = useVerticalGridLines({
    nbMaxShots,
  });

  const horizontalGridLines = useHorizontalGridLines({
    nbMaxShots,
  });

  console.log(`re-rendering <Grid>`)
  

  return (
    <>
      <group position={[0, height / 2, -7]}>
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

      <group position={[0, height / 2, -7]}>
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

      <group position={[0, height / 2, -7]}>
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
