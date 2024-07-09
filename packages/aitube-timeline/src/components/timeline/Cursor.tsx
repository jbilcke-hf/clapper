import React from "react"

import {
  useTimeline
} from "@/hooks"

import { useCursorGeometry } from "@/hooks/useCursorGeometry"
import { leftBarTrackScaleWidth } from "@/constants/themes"

export function Cursor() {
  const theme = useTimeline(s => s.theme)
  const setTimelineCursor = useTimeline(s => s.setTimelineCursor)

  const contentHeight = useTimeline(s => s.contentHeight)
  const cursorGeometries = useCursorGeometry()


  const exponent = 3; // Adjust this value to control the steepness of the curve

  // console.log(`re-rendering <Cursor>`)
  
  return (
    <>
      <group
      position={[
        leftBarTrackScaleWidth,
       (contentHeight / 2),
        -4
      ]}
      ref={r => {
        if (r) {
          setTimelineCursor(r)
        }
      }}
      >
      {cursorGeometries.map((lineGeometry, idx) => {
        const t = idx / (cursorGeometries.length - 1); // Normalized index (0 to 1)
        const opacity = Math.pow(t, exponent); // Apply power function for curved gradient
        const isLast = idx >= (cursorGeometries.length - 2)
        return (
          <line
            // @ts-ignore
            geometry={lineGeometry}
            key={idx}>
            <lineBasicMaterial
              attach="material"
              color={theme.playbackCursor.lineColor}
              linewidth={1}
              opacity={isLast ? 1.0 : opacity}
              transparent
            />
          </line>
        )
        })}
      </group>

    </>
  );
};
