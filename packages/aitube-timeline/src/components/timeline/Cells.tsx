import React, { useEffect } from "react"
import { useSpring, a, animated, config } from "@react-spring/three"

import { DEFAULT_NB_TRACKS } from "@/constants"
import {
  useVisibleSegments,
  useTimelineState
} from "@/hooks"

import { Cell } from "@/components/cells"

export function Cells({
  width,
  height
}: {
  width: number
  height: number
}) {

  const nbMaxTracks = DEFAULT_NB_TRACKS

  // refresh rate for the grid (high value == delay before we see the "hidden" cells)
  // this should be a fact of the number of segments,
  // as this puts a strain on the rendering FPS
  //
  // another solution can also consist in rendering more hidden cells,
  // to avoid having to re-compute
  const refreshRateInMs = 500

  // note: this one is async, so it creates a delay
  // we could cheat by detecting the cell width change and apply it
  // faster on the current geometries 
  const visibleSegments = useVisibleSegments({
    nbMaxTracks,
    refreshRateInMs,
  });


  /*
  const [props, set] = useSpring(() => ({
    pos: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
  }))
  */
  
  // console.log(`re-rendering ${visibleSegments.length} <Cells>`)

  return (
    <group position={[
      0,
      // height/2 is to shift the group above, to make it centered
      // cellHeight/2 is to also take into account the height of a cell
      // (baseCellHeight / 2) - (baseCellHeight / 2),
      height / 2,
       -4
       ]}>
      {visibleSegments.map((s) =>
        <Cell
          key={s.id}
          segment={s}
        />
      )}
    </group>
  );
};
