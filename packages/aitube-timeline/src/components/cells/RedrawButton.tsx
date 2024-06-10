import { useTimeline } from "@/hooks"
import { ClapSegment } from "@aitube/clap"
import { Circle, Text } from "@react-three/drei"
import { invalidate } from "@react-three/fiber"
import { useState, useTransition } from "react"

export function RedrawButton({
  segment,
  cellWidth,
  cellHeight,
  isHovered,
  durationInSteps,
  // isBusy,
  // onClick,
}: {
  segment: ClapSegment
  cellWidth: number
  cellHeight: number
  isHovered: boolean
  durationInSteps: number
  // isBusy: boolean
  // onClick: () => void
}) {
  const [_isPending, startTransition] = useTransition()
  const resolveSegment = useTimeline(s => s.resolveSegment)

  const [inProgress, setInProgress] = useState(false)
  // const [isButtonHovered, setButtonHovered] = useState(false)

  const onRender = async () => {
    startTransition(() => {
      setInProgress(true)
    })
    try {
        // console.log(`click on RedrawButton for segment ` + segment.id)
        const newSegment = await resolveSegment(segment)
        // if (ref.current) {
          // update the image src
        // }

        // note that this will poison-pill the current element,
        // since we transform a text mesh node into an image node
        // TODO: we should only have one mesh to avoid this
        // invalidate()
      
      // ref.current.url
    } catch (err) {
      
    } finally {
      startTransition(() => {
        // this fail/trigger an error, since the parent element will be destroyed
        setInProgress(false)
      })
    }
  }

  return (
      <Circle
           position={[
            (durationInSteps * (cellWidth / 2)) - 26,
            -(cellHeight) - (cellHeight / 2) + 26,
            1
          ]}
          args={[
            16,
            32
          ]}
          onClick={(e) => {
            if (!inProgress) {
              onRender()
            }
            e.stopPropagation()
            return false
          }}
      >
        <meshBasicMaterial
        color="#333333"
        transparent
        opacity={inProgress ? 0.5 : isHovered ? 0.8 : 0.0}
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
          fillOpacity={inProgress ? 0.5 : isHovered ? 1.0 : 0.0}
          anchorX="center"
          anchorY="middle"
          fontWeight={400}
        >
          {inProgress ? '🕓' : '🎲'}
          {/*
          also for a smoother animation,
          we should pre-render everything, and use opacity to switch between
          the states I think

          to create a "loader" we can also use this:
            🕛🕐🕑🕒🕓🕓🕔🕧🕖🕗🕘🕚
          */}
        </Text>
      </Circle>
  )
}