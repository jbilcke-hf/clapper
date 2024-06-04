import React from "react"

import {
  useTimelineState
} from "@/hooks"

import { useCursorGeometry } from "@/hooks/useCursorGeometry"
import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "@/constants/themes"

export function Cursor({
  width,
  height
}: {
  width: number
  height: number
}) {
  const setTimelineCursor = useTimelineState(s => s.setTimelineCursor)

  const cursorGeometries = useCursorGeometry();

  // console.log(`re-rendering <Cursor>`)
  
  return (
    <>
      <group
      position={[
        leftBarTrackScaleWidth,
       (height / 2),
        -7
      ]}
      ref={r => {
        if (r) {
          setTimelineCursor(r)
        }
      }}
      >
      {cursorGeometries.map((lineGeometry, idx) => (
        <line
          // @ts-ignore
          geometry={lineGeometry}
          key={idx}>
          <lineBasicMaterial
            attach="material"
            color="#ffffff"
            linewidth={1}
          />
        </line>
      ))}
      </group>

    </>
  );
};
