import React, { useEffect, useRef } from "react"

import { Plane, Text } from "@react-three/drei"

import {
useTimeline
} from "@/hooks"

import { hslToHex } from "@/utils"
import { useTimeScaleGraduations } from "@/hooks/useTimeScaleGraduations"
import { DEFAULT_DURATION_IN_MS_PER_STEP, NB_MAX_SHOTS } from "@/constants/grid"
import { formatTimestamp } from "@/utils/formatTimestamp"

import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "@/constants/themes"
import { useThree } from "@react-three/fiber"

export function TopBarTimeScale() {
  const { size } = useThree()

  const jumpAt = useTimeline(s => s.jumpAt)
  const togglePlayback = useTimeline(s => s.togglePlayback)

  const wasPlayingRef = useRef<boolean | undefined>(undefined)

  // we should use the non-reactive version
  const cellWidth = useTimeline((s) => s.cellWidth)
  // const cellWidth = useTimeline.getState().horizontalZoomLevel
  const contentWidth = useTimeline((s) => s.contentWidth)

  const isResizing = useTimeline(s => s.isResizing)

  const unit = 10

  // note: recomputing this is expensive and creates a visual delay
  const timeScaleGraduations = useTimeScaleGraduations({
    unit
  });

  let timestampInMs = -DEFAULT_DURATION_IN_MS_PER_STEP

  const setHorizontalZoomLevel = useTimeline((s) => s.setHorizontalZoomLevel)

  // console.log(`re-rendering <TopBarTimeScale>`)

  const setCursorTimestampAtInMs = useTimeline(s => s.setCursorTimestampAtInMs)
  const setIsDraggingCursor = useTimeline(s => s.setIsDraggingCursor)
  const setTopBarTimeScale = useTimeline(s => s.setTopBarTimeScale)
  
  // it can be annoying to have to be exactly on the right top bar track when dragging the cursor
  // to improve the UX, we allow the user to move the mouse ANYWHERE on the screen while doing so
  useEffect(() => {
    const onMouseMove = (evt: MouseEvent) => {
      const {
        isDraggingCursor,
        timelineCursor,
        topBarTimeScale,
        timelineCamera
      } = useTimeline.getState()
      if (!timelineCursor || !isDraggingCursor || !topBarTimeScale || !timelineCamera) { return }

      // if we are actualling pressing a button
      if (evt.buttons) {
        const mouseX = evt.x

        const newPositionOfTheCursorX = mouseX //- leftBarTrackScaleWidth 
        // TODO: take the left column into account for the calculation

        const positionInsideTheTimelineX = newPositionOfTheCursorX + timelineCamera.position.x

        const newCursorTimestampAtInMs = (positionInsideTheTimelineX / cellWidth) * DEFAULT_DURATION_IN_MS_PER_STEP
        
        setCursorTimestampAtInMs(newCursorTimestampAtInMs)
        jumpAt(newCursorTimestampAtInMs)
      } else {
        // user stopped pressing the mouse outside the timeline area

        setIsDraggingCursor(false)
        if (typeof wasPlayingRef.current === "boolean") {
          if (wasPlayingRef.current) {
            togglePlayback(true)
          }
        }
      }
      evt.stopPropagation()
      return false
    }
    document.addEventListener("mousemove", onMouseMove)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
    }
  }, [])

  return (
    <group
      ref={r => {
        if (r) {
          setTopBarTimeScale(r)
        }
      }}
      position={[-leftBarTrackScaleWidth, 0, -3]}
      onWheel={(e) => {
        if (e.offsetY > topBarTimeScaleHeight) { return }

        const disableWheel = true
        if (disableWheel) {
        console.log(`user tried to change the horizontal scale, but it is disabled due to rescaling bugs (@Julian fix this!)`)
        e.stopPropagation()
        return false
        }

        const wheelFactor = 0.3

        setHorizontalZoomLevel(
          // Math.round(
            useTimeline.getState().cellWidth + (wheelFactor * e.deltaY)
          // )
        )
        e.stopPropagation()
        return false
      }}
      onPointerDown={(e) => {
        const cursorX = e.point.x + (size.width / 2)
        const cursorTimestampAtInMs = (cursorX / cellWidth) * DEFAULT_DURATION_IN_MS_PER_STEP
        const { wasPlaying } = togglePlayback(false)
        wasPlayingRef.current = wasPlaying
        setCursorTimestampAtInMs(cursorTimestampAtInMs)
        jumpAt(cursorTimestampAtInMs)
        setIsDraggingCursor(true)
        e.stopPropagation()
        return false
      }}
      onPointerUp={(e) => {
        setIsDraggingCursor(false)
        if (typeof wasPlayingRef.current === "boolean") {
          if (wasPlayingRef.current) {
            togglePlayback(true)
          }
        }
        e.stopPropagation()
        return false
      }}
      onPointerMove={e => {
        // TODO move this into the whole parent container?
        // the problem is.. are we still gonna get events

        // console.log(e)
        // handle the "timeline cursor drag"
        if (e.pressure > 0) {
          const cursorX = e.point.x + (size.width / 2)
          const cursorTimestampAtInMs = (cursorX / cellWidth) * DEFAULT_DURATION_IN_MS_PER_STEP
          setCursorTimestampAtInMs(cursorTimestampAtInMs)
          jumpAt(cursorTimestampAtInMs)
        }
        e.stopPropagation()
        return false
      }}
      >
      <group

        position={[0, 0, -1]}>
        <Plane
           args={[leftBarTrackScaleWidth + contentWidth, topBarTimeScaleHeight]}
           position={[
            contentWidth / 2,
            (topBarTimeScaleHeight / 2) + 2,
            1
          ]}

        >

          <meshBasicMaterial
            // we need to set the color here to create a sticky overlay
              attach="material"
              color="rgb(125,124,120)"
            />
        </Plane>
      </group>
      <group position={[
        leftBarTrackScaleWidth,
        0,
        0
        ]}>
        {timeScaleGraduations.map((lineGeometry, idx) => (
          <line
            // @ts-ignore
            geometry={lineGeometry}
            key={idx}>
            <lineBasicMaterial
              attach="material"
              color={
                idx % unit === 0
                ? hslToHex(0, 0, 90)
                : hslToHex(0, 0, 70)
              }
              linewidth={1}
            />
          </line>
        ))}
      </group>
      <group position={[leftBarTrackScaleWidth, 0, 0]} visible={!isResizing}>
        {isResizing ? [] : timeScaleGraduations.map((lineGeometry, idx) => (
          <Text
            key={idx}
            position={[
              idx * cellWidth,
              // idx % unit === 0 ? topBarTimeScaleHeight : 25,
              24,
              1
            ]}

            scale={[
              idx % unit === 0 ? 12 : 10,
              idx % unit === 0 ? 12 : 10,
              1
            ]}

            lineHeight={1.0}
            color={
              "#ffffff"
            }
            // fillOpacity={0.7}
            anchorX="center" // default
            anchorY="middle" // default

            // keep in mind this will impact the font width
            // so you will have to change the "Arial" or "bold Arial"
            // in the function which computes a character's width
            fontWeight={200}
            visible={
              // always hide the 0
              idx === 0
              ? false

              // always show the text if we have enough room
              : cellWidth > 40
              ? true

              // if this is too tight, we only display the coarse time ticks
              : cellWidth > 4
              ? idx % unit === 0

              : false
            }
          >
            {
            formatTimestamp(
              timestampInMs += DEFAULT_DURATION_IN_MS_PER_STEP, {
                hours: false, // idx % unit === 0,
                minutes: idx % unit === 0,
                seconds: true,
                milliseconds: cellWidth > 20,
            })}
          </Text>
        ))}
      </group>
    </group>
  )
}