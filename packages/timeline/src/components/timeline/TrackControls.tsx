import React, { useState } from "react"
import { Plane, Text } from "@react-three/drei"
import { ClapSegmentCategory } from "@aitube/clap"
import { useTimeline } from "@/hooks"
import { leftBarTrackScaleWidth } from "@/constants/themes"

export function TrackControls() {
  const theme = useTimeline(s => s.theme)
  const tracks = useTimeline(s => s.tracks)
  const contentHeight = useTimeline((s) => s.contentHeight)

  // Position at the bottom of the track scale
  const yPosition = -(contentHeight / 2) + 30

  return (
    <group position={[-leftBarTrackScaleWidth, yPosition, 0]}>
      <Plane
        args={[leftBarTrackScaleWidth, 50]}
        position={[leftBarTrackScaleWidth / 2, 0, -1]}
      >
        <meshBasicMaterial color={theme.leftBarTrackScale.backgroundColor} />
        <Text
          position={[0, 0, 2]}
          scale={[12, 12, 1]}
          lineHeight={1.0}
          color={theme.leftBarTrackScale.textColor}
          anchorX="center"
          anchorY="middle"
          fontWeight={600}
          fillOpacity={0.9}
        >
          + Add Track
        </Text>
      </Plane>
    </group>
  )
}
