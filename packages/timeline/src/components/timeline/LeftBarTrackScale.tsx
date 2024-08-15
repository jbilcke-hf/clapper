import React from "react"
import { Plane, Text } from "@react-three/drei"

import {
useTimeline
} from "@/hooks"

import { leftBarTrackScaleWidth } from "@/constants/themes"
import { useHorizontaTrackLines } from "@/hooks/useHorizontalTrackLines"
import { LineGeometry } from "three/examples/jsm/Addons.js"
import { hslToHex } from "@/utils"

export function LeftBarTrackScale() {
  // console.log(`re-rendering <LeftBarTrackScale>`)
  
  const contentHeight = useTimeline((s) => s.contentHeight)
  
  const getCellHeight = useTimeline((s) => s.getCellHeight)
  const theme = useTimeline(s => s.theme)

  const getVerticalCellPosition = useTimeline((s) => s.getVerticalCellPosition)

  const tracks = useTimeline(s => s.tracks)
  const toggleTrackVisibility = useTimeline((s) => s.toggleTrackVisibility)

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
            fillOpacity={0.7}
            visible={
              true
            }
          >
            {
            track.name
            }
          </Text>
          </Plane>
        ))}
      </group>
    </group>
  )
}