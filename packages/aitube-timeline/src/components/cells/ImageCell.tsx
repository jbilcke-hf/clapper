import { Image } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useSpring, a, animated, config } from "@react-spring/three"

import { SpecializedCellProps } from "./types"

export function ImageCell({
  segment: s,
  cellWidth,
  cellHeight,
  setHovered,
  durationInSteps,
  startTimeInSteps,
  baseSegmentColor,
}: SpecializedCellProps) {
  return (
    <Image
      opacity={1.0}
      position={[
        0,
        -s.track * cellHeight,
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