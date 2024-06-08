import { Circle, Image, Text } from "@react-three/drei"
import { invalidate, useThree } from "@react-three/fiber"
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
  // const ref = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(null)
 
  /*
  const renderSegment = useTimeline(s => s.renderSegment)

  const [inProgress, setInProgress] = useState(false)
  // const [isButtonHovered, setButtonHovered] = useState(false)
  const onRender = async () => {
    setInProgress(true)
    try {
      // console.log(`click on RedrawButton for segment ` + segment.id)
      const segment = await renderSegment(s)
      if (ref.current) {
        // update the image src
      }

      // note that this will poison-pill the current
      invalidate()
      // ref.current.url
    } catch (err) {
      
    } finally {
      setInProgress(false)
    }
  }
    */

  return (
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
  )
}