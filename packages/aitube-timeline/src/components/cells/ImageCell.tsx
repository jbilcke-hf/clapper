import { Circle, Image, Text } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useSpring, a, animated, config } from "@react-spring/three"

import { SpecializedCellProps } from "./types"
import { RedrawButton } from "./RedrawButton"

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
    <>
    <group>
      <Image
        opacity={
          track.visible ? 1 : 0.5
        }
        position={[
          0,
          -cellHeight,
          0
        ]}
        scale={[
          durationInSteps * cellWidth,
          cellHeight,
        ]}
        transparent
        url={s.assetUrl}
      >
      </Image>
    </group>
    <RedrawButton
        segment={s}
        cellWidth={cellWidth}
        cellHeight={cellHeight}
        isHovered={isHovered}
        durationInSteps={durationInSteps}
      />
    </>
  )
}