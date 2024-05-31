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
}: SpecializedCellProps) {
  return (
    <Image
      opacity={1.0}
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