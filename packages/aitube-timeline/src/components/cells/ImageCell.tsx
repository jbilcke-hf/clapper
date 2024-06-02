import { Image } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useSpring, a, animated, config } from "@react-spring/three"

import { SpecializedCellProps } from "./types"

export function ImageCell({
  segment: s,
  cellWidth,
  cellHeight,
  isHovered,
  setHoveredSegment,
  durationInSteps,
  startTimeInSteps,
  colorScheme,
  isResizing,
  track,
}: SpecializedCellProps) {
  return (
    <Image
      opacity={
        track.visible ? 1 : 0.5
      }
      position={[
        0,
        -cellHeight,
        1
      ]}
      scale={[
        durationInSteps * cellWidth,
        cellHeight,
      ]}
      transparent
      url={s.assetUrl}
    />
  )
}