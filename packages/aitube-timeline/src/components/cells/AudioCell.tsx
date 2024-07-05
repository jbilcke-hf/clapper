import { RoundedBox } from "@react-three/drei"
import { SpecializedCellProps } from "./types"
import { Waveform } from "./Waveform"

export function AudioCell({
  segment: s,
  cellWidth,
  cellHeight,
  isHovered,
  setHoveredSegment,
  durationInSteps,
  startTimeInSteps,
  colorScheme,
  widthInPx,
  widthInPxAfterZoom,
  isResizing,
  track
}: SpecializedCellProps) {
  
  const padding = 1.2

  const fontSize = 13
  const lineHeight = 1.2

  return (
    <RoundedBox
      key={s.id}
      position={[
        0,
        -cellHeight,
        0
      ]}
      args={[
        widthInPx - padding, // tiny padding
        cellHeight - padding, // tiny padding
        1
      ]} // Width, height, depth. Default is [1, 1, 1]
      radius={2.5} // Radius of the rounded corners. Default is 0.05
      smoothness={2} // The number of curve segments. Default is 4
      bevelSegments={1} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
      creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle
    >
      <meshBasicMaterial
        color={
          track.visible ? (
            isHovered
            ? colorScheme.backgroundColorHover
            : colorScheme.backgroundColor
          ) : colorScheme.backgroundColorDisabled
        }
        // transparent
        // opacity={}
        >
      </meshBasicMaterial>
      <Waveform
        segment={s}
        track={track}
        cellWidth={cellWidth}
        cellHeight={cellHeight}
        durationInSteps={durationInSteps}
        opacity={1.0}
        color={colorScheme.textColor}
        variant="compact"
        thickness={0}
        lineSpacing={colorScheme.waveformLineSpacing}
        topOrBottomFillOpacity={colorScheme.waveformGradientStart}
        middleFillOpacity={colorScheme.waveformGradientEnd}
      />
    </RoundedBox>
  )
}