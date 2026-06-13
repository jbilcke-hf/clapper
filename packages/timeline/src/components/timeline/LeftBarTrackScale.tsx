import React from "react"
import { Html, Plane, Text } from "@react-three/drei"
import { ClapSegmentCategory } from "@aitube/clap"

import {
useTimeline
} from "@/hooks"

import { leftBarTrackScaleWidth } from "@/constants/themes"
import { useHorizontaTrackLines } from "@/hooks/useHorizontalTrackLines"
import { LineGeometry } from "three/examples/jsm/Addons.js"
import { hslToHex } from "@/utils"

const editableTrackCategories = [
  ClapSegmentCategory.GENERIC,
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.MUSIC,
  ClapSegmentCategory.ACTION,
]

export function LeftBarTrackScale() {
  // console.log(`re-rendering <LeftBarTrackScale>`)
  
  const contentHeight = useTimeline((s) => s.contentHeight)
  
  const getCellHeight = useTimeline((s) => s.getCellHeight)
  const theme = useTimeline(s => s.theme)

  const getVerticalCellPosition = useTimeline((s) => s.getVerticalCellPosition)

  const tracks = useTimeline(s => s.tracks)
  const createTrack = useTimeline((s) => s.createTrack)
  const toggleTrackVisibility = useTimeline((s) => s.toggleTrackVisibility)
  const setTrackCategory = useTimeline((s) => s.setTrackCategory)

  const setLeftBarTrackScale = useTimeline(s => s.setLeftBarTrackScale)


  const horizontalTrackLines = useHorizontaTrackLines()

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
        <Html
          position={[
            leftBarTrackScaleWidth / 2,
            18,
            4
          ]}
          center
        >
          <button
            aria-label="Create track"
            title="Create track"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              createTrack({ category: ClapSegmentCategory.GENERIC })
              event.stopPropagation()
            }}
            style={{
              width: 76,
              height: 20,
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 4,
              background: "rgba(0,0,0,0.45)",
              color: theme.leftBarTrackScale.textColor,
              fontSize: 13,
              fontWeight: 700,
              lineHeight: "18px",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </Html>
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
            toggleTrackVisibility(track.id)
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
          <Html
            position={[
              10,
              -8,
              3
            ]}
            center
          >
            <select
              aria-label={`Track ${track.id} type`}
              value={
                editableTrackCategories.includes(track.name as ClapSegmentCategory)
                  ? track.name
                  : ClapSegmentCategory.GENERIC
              }
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => {
                setTrackCategory({
                  trackId: track.id,
                  category: event.currentTarget.value as ClapSegmentCategory,
                })
                event.stopPropagation()
              }}
              style={{
                width: 76,
                maxWidth: 76,
                height: 18,
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 4,
                background: "rgba(0,0,0,0.35)",
                color: theme.leftBarTrackScale.textColor,
                fontSize: 10,
              }}
            >
              {editableTrackCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Html>
          </Plane>
        ))}
      </group>
    </group>
  )
}
