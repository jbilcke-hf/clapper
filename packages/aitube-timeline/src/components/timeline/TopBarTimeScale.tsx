import React, { useRef } from "react"

import { Plane, Text } from "@react-three/drei"

import {
useTimeline
} from "@/hooks"

import { hslToHex } from "@/utils"
import { useTimeScaleGraduations } from "@/hooks/useTimeScaleGraduations"
import { DEFAULT_DURATION_IN_MS_PER_STEP, NB_MAX_SHOTS } from "@/constants/grid"
import { formatTimestamp } from "@/utils/formatTimestamp"
import { useFrame, useThree } from "@react-three/fiber"

import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "@/constants/themes"

export function TopBarTimeScale() {
  // const { size } = useThree()

  // we should use the non-reactive version
  const cellWidth = useTimeline((s) => s.cellWidth)
  // const cellWidth = useTimeline.getState().horizontalZoomLevel
  const contentWidth = useTimeline((s) => s.contentWidth)
  const contentHeight = useTimeline((s) => s.contentHeight)
  
  const isResizing = useTimeline(s => s.isResizing)

  const unit = 10

  // note: recomputing this is expensive and creates a visual delay
  const timeScaleGraduations = useTimeScaleGraduations({
    unit
  });

  let timestampInMs = 0

  const setHorizontalZoomLevel = useTimeline((s) => s.setHorizontalZoomLevel)

  // console.log(`re-rendering <TopBarTimeScale>`)

  const setTopBarTimelineScale = useTimeline(s => s.setTopBarTimelineScale)
  
  return (
    <group
      ref={r => {
        if (r) {
          setTopBarTimelineScale(r)
        }
      }}
      position={[-leftBarTrackScaleWidth, 0, -3]}
      onWheel={(e) => {
        if (e.offsetY > topBarTimeScaleHeight) { return }

        const wheelFactor = 0.3

        setHorizontalZoomLevel(
          // Math.round(
            useTimeline.getState().cellWidth + (wheelFactor * e.deltaY)
          // )
        )
        e.stopPropagation()
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