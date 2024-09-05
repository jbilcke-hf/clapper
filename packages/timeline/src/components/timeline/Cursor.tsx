import React, { useMemo, useRef, useState } from "react"
import * as THREE from "three"

import { useAnimationFrame, useTimeline } from "@/hooks"
import { useCursorGeometry } from "@/hooks/useCursorGeometry"
import { leftBarTrackScaleWidth } from "@/constants/themes"

const CURSOR_WIDTH_IN_PX = 2

const SPEED_RESOLUTION = 50 // px/sec
const MAX_SPEED = 200
const GRADIENT_EXPONENT = 3

export function Cursor() {
  const theme = useTimeline(s => s.theme)
  const timelineCursor = useTimeline(s => s.timelineCursor)
  const setTimelineCursor = useTimeline(s => s.setTimelineCursor)
  const contentHeight = useTimeline(s => s.contentHeight)
  const cursorGeometries = useCursorGeometry()

  const lastPositionRef = useRef(0)
  const lastTimeRef = useRef(0)
  const lastSpeedRef = useRef(0)
  const lineMatRefs = useRef<THREE.LineBasicMaterial[]>([])

  useAnimationFrame((deltaTime) => {
    if (!timelineCursor) return

    const currentPosition = timelineCursor.position.x
    const currentTime = performance.now()

    if (lastTimeRef.current) {
      const timeDiff = (currentTime - lastTimeRef.current) / 1000
      const positionDiff = currentPosition - lastPositionRef.current
      const speed = Math.abs(positionDiff / timeDiff)
      const direction = Math.sign(positionDiff)

      const granularSpeed = Math.floor(speed / SPEED_RESOLUTION) * SPEED_RESOLUTION

      if (granularSpeed !== lastSpeedRef.current) {
        const visibility = Math.min(granularSpeed / MAX_SPEED, 1)

        lineMatRefs.current.forEach((mat, idx) => {
          const t = idx / (lineMatRefs.current.length - 1)
          const opacity = visibility * Math.pow(t, GRADIENT_EXPONENT)
          const isAlwaysVisible = idx >= (lineMatRefs.current.length - CURSOR_WIDTH_IN_PX)
          mat.opacity = isAlwaysVisible ? 1.0 : opacity
        })

        lastSpeedRef.current = granularSpeed
      }

              // note: we need to avoid having a scale of 0
      if (direction !== 0) {
        timelineCursor.scale.x = direction
      }
    }

    lastPositionRef.current = currentPosition
    lastTimeRef.current = currentTime
  }, [timelineCursor])

  const memoizedGroup = useMemo(() => (
    <group
      position={[leftBarTrackScaleWidth, (contentHeight / 2), -4]}
      ref={r => { if (r) setTimelineCursor(r) }}
    >
      {cursorGeometries.map((lineGeometry, idx) => {
        const t = idx / (cursorGeometries.length - 1)
        const opacity = Math.pow(t, GRADIENT_EXPONENT)
        const isAlwaysVisible = idx >= (cursorGeometries.length - CURSOR_WIDTH_IN_PX)
        return (
          <line
          // @ts-ignore-line
          geometry={lineGeometry}
          key={idx}>
            <lineBasicMaterial
              ref={(ref) => { if (ref) lineMatRefs.current[idx] = ref }}
              attach="material"
              color={theme.playbackCursor.lineColor}

              // note: in WebGL lines larger than 1 are not guaranteed to be
              // supported by the browser, so let's assume it is always 1px
              linewidth={1}

              opacity={isAlwaysVisible ? 1.0 : opacity}
              transparent
            />
          </line>
        )
      })}
    </group>
  ), [theme, contentHeight, cursorGeometries, setTimelineCursor])

  return memoizedGroup
}
