import React, { useEffect, useState } from "react"
import * as THREE from "three"
import { Plane } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useSpring, a, animated, config } from "@react-spring/three"

import { DEFAULT_NB_TRACKS } from "@/constants"
import {
  useVisibleSegments,
  useAxis,
  useGridLines,
  useTimelineState
} from "@/hooks"

import { Cell } from "@/components/cells"
import { hslToHex } from "@/utils"

export function TimelineGrid() {
  const { size, viewport } = useThree()

  const typicalSegmentDurationInSteps = useTimelineState(s => s.typicalSegmentDurationInSteps)
  const cellWidth = useTimelineState(s => s.horizontalZoomLevel)
  const getCellHeight = useTimelineState(s => s.getCellHeight)
  const getVerticalCellPosition = useTimelineState(s => s.getVerticalCellPosition)

  const baseCellHeight = getCellHeight()
  
  const nbMaxShots = ((3 * 60 * 60) / 2) // 3 hours converted to seconds, and divided by 2 (a shot is about 2 sec)
  const nbMaxTracks = DEFAULT_NB_TRACKS

  // refresh rate for the grid (high value == delay before we see the "hidden" cells)
  // this should be a fact of the number of segments,
  // as this puts a strain on the rendering FPS
  //
  // another solution can also consist in rendering more hidden cells,
  // to avoid having to re-compute
  const refreshRateInMs = 500

  // const aspect = size.width / viewport.width;

  // const controls = useThree((state) => state.controls)
  // const camera = useThree((state) => state.camera)

  const width = nbMaxShots * cellWidth
  const height = getVerticalCellPosition(0, nbMaxTracks)

  const axis = useAxis(width, height)

  const gridlines = useGridLines({
    nbMaxShots,
  });

  // note: this one is async, so it creates a delay
  // we could cheat by detecting the cell width change and apply it
  // faster on the current geometries 
  const visibleSegments = useVisibleSegments({
    nbMaxTracks,
    refreshRateInMs,
  });

  const [hovered, setHovered] = useState("")

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'

    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  const [props, set] = useSpring(() => ({
    pos: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
  }))
  
  return (
    <mesh
      // this any is a code smell, we are forcing the react spring data structure into
      // the three one - feel free to fix this
      // {...dragSpring as any}
      // {...bindDrag()}
      position={[0,0,0]}
    >
      <Plane args={[width, height]} position={[
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
        <group position={[0, height / 2, -3]}>
          {gridlines.map((lineGeometry, idx) => (
            <line
              // @ts-ignore
              geometry={lineGeometry}
              key={idx}>
              <lineBasicMaterial
                attach="material"
                color={
                  idx % typicalSegmentDurationInSteps === 0
                  ? hslToHex(0, 0, 70)
                  : hslToHex(0, 0, 50)
                }
                linewidth={1}
              />
            </line>
          ))}
        </group>

        <group position={[0, height / 2, -3]}>
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

        <group position={[
          0,
          // height/2 is to shift the group above, to make it centered
          // cellHeight/2 is to also take into account the height of a cell
          // (baseCellHeight / 2) - (baseCellHeight / 2),
          height / 2,
           -1
           ]}>
          {visibleSegments.map((s) =>
            <Cell
              key={s.id}
              segment={s}
              setHovered={setHovered}
            />
          )}
        </group>
      </Plane>
    </mesh>
  );
};
