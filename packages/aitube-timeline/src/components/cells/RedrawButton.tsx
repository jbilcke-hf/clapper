import { ClapSegment } from "@aitube/clap"
import { Circle, Text } from "@react-three/drei"

import { useTimelineState } from "@/hooks"

export function RedrawButton({
  segment,
  cellWidth,
  cellHeight,
  isHovered,
  durationInSteps,
}: {
  segment: ClapSegment
  cellWidth: number
  cellHeight: number
  isHovered: boolean
  durationInSteps: number
}) {
  // const [isButtonHovered, setButtonHovered] = useState(false)
  const handleClick = () => {
    console.log('hum?')
  }
  return (
      <Circle
           position={[
            (durationInSteps * (cellWidth / 2)) - 26,
            -(cellHeight / 2) + 26,
            1
          ]}
          args={[
            16,
            32
          ]}
          onClick={(e) => {
            // console.log(`click on RedrawButton for segment ` + segment.id)
            useTimelineState.getState().renderSegment(segment)

            e.stopPropagation()
            return false
          }}
      >
        <meshBasicMaterial
        color="#333333"
        transparent
        opacity={isHovered ? 0.8 : 0.0}
        />
        <Text
          position={[
            0,
            0,
            2
          ]}

          scale={[
            19,
            19,
            1
          ]}

          lineHeight={1.0}
          color="#dddddd"
          fillOpacity={isHovered ? 1.0 : 0.0}
          anchorX="center"
          anchorY="middle"
          fontWeight={400}
        >
          🎲
        </Text>
      </Circle>
  )
}