import React, { useCallback } from "react"
import { Plane, Text } from "@react-three/drei"
import { ClapSegmentCategory } from "@aitube/clap"

import {
useTimeline
} from "@/hooks"

import { leftBarTrackScaleWidth } from "@/constants/themes"
import { useHorizontaTrackLines } from "@/hooks/useHorizontalTrackLines"
import { hslToHex } from "@/utils"

// common track categories for quick cycling
const TRACK_CATEGORIES: string[] = [
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.MUSIC,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.ACTION,
  ClapSegmentCategory.EFFECT,
  ClapSegmentCategory.CHARACTER,
  ClapSegmentCategory.LOCATION,
  ClapSegmentCategory.TRANSITION,
  ClapSegmentCategory.GENERIC,
]

function getNextCategory(currentName: string): string {
  // if current is a category, cycle to next
  const idx = TRACK_CATEGORIES.indexOf(currentName as ClapSegmentCategory)
  if (idx >= 0) {
    return TRACK_CATEGORIES[(idx + 1) % TRACK_CATEGORIES.length]
  }
  // if it's something custom or empty, jump to first
  return TRACK_CATEGORIES[0]
}

function getCategoryColor(category: string): string {
  const hueMap: Record<string, number> = {
    [ClapSegmentCategory.VIDEO]: 200,
    [ClapSegmentCategory.IMAGE]: 160,
    [ClapSegmentCategory.SOUND]: 270,
    [ClapSegmentCategory.DIALOGUE]: 40,
    [ClapSegmentCategory.MUSIC]: 300,
    [ClapSegmentCategory.ACTION]: 10,
    [ClapSegmentCategory.EFFECT]: 180,
    [ClapSegmentCategory.CHARACTER]: 50,
    [ClapSegmentCategory.LOCATION]: 120,
    [ClapSegmentCategory.TRANSITION]: 30,
    [ClapSegmentCategory.GENERIC]: 0,
  }
  const hue = hueMap[category] || 0
  return hslToHex(hue, 40, 55)
}

export function LeftBarTrackScale() {
  // console.log(`re-rendering <LeftBarTrackScale>`)

  const contentHeight = useTimeline((s) => s.contentHeight)

  const getCellHeight = useTimeline((s) => s.getCellHeight)
  const theme = useTimeline(s => s.theme)

  const getVerticalCellPosition = useTimeline((s) => s.getVerticalCellPosition)

  const tracks = useTimeline(s => s.tracks)
  const toggleTrackVisibility = useTimeline((s) => s.toggleTrackVisibility)
  const setTrackType = useTimeline((s) => s.setTrackType)
  const addTrack = useTimeline((s) => s.addTrack)

  const setLeftBarTrackScale = useTimeline(s => s.setLeftBarTrackScale)

  const horizontalTrackLines = useHorizontaTrackLines()

  const handleCycleType = useCallback((trackId: number, currentName: string) => {
    const next = getNextCategory(currentName)
    setTrackType(trackId, next)
  }, [setTrackType])

  const handleAddTrack = useCallback(() => {
    addTrack(ClapSegmentCategory.VIDEO)
  }, [addTrack])

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
        {tracks.map(track => {
          const cellH = getCellHeight(track.id)
          const posY = -getVerticalCellPosition(0, track.id) - (cellH / 2)
          const isOccupied = track.name !== "(empty)"
          const typeColor = getCategoryColor(track.name)

          return (
          <Plane
          key={track.id}
          args={[leftBarTrackScaleWidth, cellH]}
          position={[
            leftBarTrackScaleWidth / 2,
            posY,
            -1
          ]}
          onClick={(e) => {
            toggleTrackVisibility(track.id)
            e.stopPropagation()
          }}
          >
            <meshBasicMaterial color={theme.leftBarTrackScale.backgroundColor} />
            {/* Eye icon for visibility toggle */}
            <Text
              position={[-38, 0, 2]}
              scale={[14, 14, 1]}
              lineHeight={1.0}
              color={theme.leftBarTrackScale.textColor}
              fontWeight={600}
              fillOpacity={track.visible ? 0.9 : 0.3}
              onClick={(e) => {
                toggleTrackVisibility(track.id)
                e.stopPropagation()
              }}
            >
              {track.visible ? "👁" : "👁‍🗨"}
            </Text>

            {/* Track number */}
            <Text
              position={[10, 8, 2]}
              scale={[11, 11, 1]}
              lineHeight={1.0}
              color={theme.leftBarTrackScale.textColor}
              fontWeight={700}
              fillOpacity={0.9}
            >
              {`T${track.id}`}
            </Text>

            {/* Track type badge - click to cycle categories */}
            {isOccupied && (
            <Text
              position={[10, -7, 2]}
              scale={[9, 9, 1]}
              lineHeight={1.0}
              color={typeColor}
              fontWeight={600}
              fillOpacity={0.95}
              onClick={(e) => {
                handleCycleType(track.id, track.name)
                e.stopPropagation()
              }}
            >
              {track.name}
            </Text>
            )}

            {/* Show "(empty)" label for unoccupied tracks */}
            {!isOccupied && (
            <Text
              position={[10, -7, 2]}
              scale={[8, 8, 1]}
              lineHeight={1.0}
              color={theme.leftBarTrackScale.textColor}
              fontWeight={400}
              fillOpacity={0.4}
            >
              (empty)
            </Text>
            )}
          </Plane>
          )
        })}

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
            handleAddTrack()
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
