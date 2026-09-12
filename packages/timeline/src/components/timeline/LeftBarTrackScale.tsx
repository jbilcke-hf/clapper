import React, { useCallback } from "react"
import { Plane, Text } from "@react-three/drei"
import { ClapTrack } from "@aitube/clap"

import {
useTimeline
} from "@/hooks"

import { leftBarTrackScaleWidth } from "@/constants/themes"
import { useHorizontaTrackLines } from "@/hooks/useHorizontalTrackLines"
import { LineGeometry } from "three/examples/jsm/Addons.js"
import { hslToHex } from "@/utils"
import { TIMELINE_AUTHORING_CATEGORIES, getTrackCategory } from "@/utils/timelineAuthoring"

export function LeftBarTrackScale() {
  // console.log(`re-rendering <LeftBarTrackScale>`)
  
  const contentHeight = useTimeline((s) => s.contentHeight)
  
  const getCellHeight = useTimeline((s) => s.getCellHeight)
  const theme = useTimeline(s => s.theme)

  const getVerticalCellPosition = useTimeline((s) => s.getVerticalCellPosition)

  const tracks = useTimeline(s => s.tracks)
  const toggleTrackVisibility = useTimeline((s) => s.toggleTrackVisibility)
  const createTrack = useTimeline(s => s.createTrack)
  const setTrackCategory = useTimeline(s => s.setTrackCategory)
  const setSelectedTrack = useTimeline(s => s.setSelectedTrack)

  const setLeftBarTrackScale = useTimeline(s => s.setLeftBarTrackScale)

  const horizontalTrackLines = useHorizontaTrackLines()

  const handleCycleType = useCallback((trackId: number, currentName: string) => {
    const currentCategory = getTrackCategory({ name: currentName } as ClapTrack)
    const currentIndex = currentCategory ? TIMELINE_AUTHORING_CATEGORIES.indexOf(currentCategory) : -1
    const nextCategory = TIMELINE_AUTHORING_CATEGORIES[(currentIndex + 1) % TIMELINE_AUTHORING_CATEGORIES.length]
    setTrackCategory(trackId, nextCategory)
  }, [setTrackCategory])

  const lastTrackIndex = tracks.length - 1
  const lastTrackBottom = tracks.length > 0
    ? -getVerticalCellPosition(0, lastTrackIndex) - getCellHeight(lastTrackIndex)
    : 0

  return (
    <group
      ref={r => {
        if (r) {
          setLeftBarTrackScale(r)
        }
      }}
      position={[-leftBarTrackScaleWidth, contentHeight / 2, 0]}
      >
      <group position={[0, 0, 0]}>
      {horizontalTrackLines.map((lineGeometry, idx) => (
        <line
          // @ts-ignore
          geometry={lineGeometry}
          key={idx}>
          <lineBasicMaterial
            attach="material"
            color={theme.leftBarTrackScale.lineColor}
            linewidth={1}
          />
        </line>
      ))}
      </group>
      <group position={[0, 0, 0]}>
        {tracks.map(track => (
          <Plane
          key={track.id}
          args={[leftBarTrackScaleWidth, getCellHeight(track.id)]}
          position={[
            leftBarTrackScaleWidth / 2,
            -getVerticalCellPosition(0, track.id) - (getCellHeight(track.id) / 2),
            -1
          ]}
          onClick={(e) => {
            setSelectedTrack(track.id)
            e.stopPropagation()
          }}
          >
            <meshBasicMaterial color={theme.leftBarTrackScale.backgroundColor} />
            <Text
              
              position={[
                -38,
                0, // -getVerticalCellPosition(0, track.id),
                2
              ]}

              scale={[
                16,
                16,
                1
              ]}

              lineHeight={1.0}
              color={theme.leftBarTrackScale.textColor}
              // fillOpacity={0.7}
              anchorX="center" // default
              anchorY="middle" // default

              // keep in mind this will impact the font width
              // so you will have to change the "Arial" or "bold Arial"
              // in the function which computes a character's width
              fontWeight={600}
              fillOpacity={track.visible ? 0.9 : 0.5}
              visible={
                true
              }
          onClick={(e) => {
            toggleTrackVisibility(track.id)
            e.stopPropagation()
          }}
            >
              👁️
            </Text>
           <Text
     
            position={[
              10,
              8, // -getVerticalCellPosition(0, track.id),
              2
            ]}

            scale={[
              12,
              12,
              1
            ]}

            lineHeight={1.0}
            color={theme.leftBarTrackScale.textColor}
            // fillOpacity={0.7}
            anchorX="center" // default
            anchorY="middle" // default

            // keep in mind this will impact the font width
            // so you will have to change the "Arial" or "bold Arial"
            // in the function which computes a character's width
            fontWeight={600}
            fillOpacity={0.9}
            visible={
              true
            }
          >
            Track {
            track.id
            }
          </Text>
          <Text
            
            position={[
              10,
              -8, // -getVerticalCellPosition(0, track.id),
              2
            ]}

            scale={[
              11,
              11,
              1
            ]}

            lineHeight={1.0}
            color={theme.leftBarTrackScale.textColor}
            // fillOpacity={0.7}
            anchorX="center" // default
            anchorY="middle" // default

            // keep in mind this will impact the font width
            // so you will have to change the "Arial" or "bold Arial"
            // in the function which computes a character's width
            fontWeight={600}
            fillOpacity={0.8}
            visible={
              true
            }
            onClick={(e) => {
              handleCycleType(track.id, track.name)
              e.stopPropagation()
            }}
          >
            {
            track.name
            }
          </Text>
          </Plane>
        ))}
        {/* "Add Track" button at the bottom of the track list */}
        <Plane
          key="add-track-btn"
          args={[leftBarTrackScaleWidth - 4, 24]}
          position={[
            leftBarTrackScaleWidth / 2,
            lastTrackBottom - 20,
            -1
          ]}
          onClick={(e) => {
            createTrack()
            e.stopPropagation()
          }}
        >
          <meshBasicMaterial
            color={theme.leftBarTrackScale.backgroundColor}
            transparent
            opacity={0.6}
          />
          <Text
            position={[0, 0, 2]}
            scale={[11, 11, 1]}
            lineHeight={1.0}
            color={theme.leftBarTrackScale.textColor}
            fontWeight={600}
            fillOpacity={0.7}
          >
            + Add Track
          </Text>
        </Plane>
      </group>
    </group>
  )
}