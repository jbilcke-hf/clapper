import { RoundedBox, Text } from "@react-three/drei"
import { useSpring, a, animated, config } from "@react-spring/three"

import { clampWebGLText } from "@/utils"

import { SpecializedCellProps } from "./types"

export function TextCell({
  segment: s,
  cellWidth,
  cellHeight,
  setHovered,
  durationInSteps,
  startTimeInSteps,
  baseSegmentColor,
}: SpecializedCellProps) {

  // this depends on the current row height
  const maxNbLines = 2

  // note: an alternative could be to create a small fade or blur effect,
  // but I think it might be expensive
  const lines = clampWebGLText(
    s.label || s.prompt,
    durationInSteps * cellWidth,
    maxNbLines
  )
  // const label = clampWebGLTextNaive(s.label, durationInSteps * cellWidth)

  const padding = 1

  return (
    <RoundedBox
      args={[
        (durationInSteps * cellWidth) - padding, // tiny padding
        cellHeight - padding, // tiny padding
        1
      ]} // Width, height, depth. Default is [1, 1, 1]
      radius={2.5} // Radius of the rounded corners. Default is 0.05
      smoothness={2} // The number of curve segments. Default is 4
      bevelSegments={1} // The number of bevel segments. Default is 4, setting it to 0 removes the bevel, as a result the texture is applied to the whole geometry.
      creaseAngle={0.4} // Smooth normals everywhere except faces that meet at an angle greater than the crease angle

      onClick={(e) => console.log('click')}
      onContextMenu={(e) => console.log('context menu')}
      onDoubleClick={(e) => console.log('double click')}
      // onWheel={(e) => console.log('wheel spins')}
      // onPointerUp={(e) => console.log('up')}
      // onPointerDown={(e) => console.log('down')}
      // onPointerOver={(e) => console.log('over')}
      // onPointerOut={(e) => console.log('out')}
      onPointerEnter={(e) => {
        console.log('enter')
        setHovered(s.id)
      }}
      onPointerLeave={(e) => {
        console.log('leave')
        setHovered(s.id)
      }}
      // onPointerMove={(e) => console.log('move')}
      // onPointerMissed={() => console.log('missed')}
      // onUpdate={(self) => console.log('props have been updated')}
    >
      <meshBasicMaterial color={baseSegmentColor.bg} />
      {/*
        <Html
          // as='div' // Wrapping element (default: 'div')
          // wrapperClass // The className of the wrapping element (default: undefined)
          // prepend // Project content behind the canvas (default: false)
          // center // Adds a -50%/-50% css transform (default: false) [ignored in transform mode]
          // fullscreen // Aligns to the upper-left corner, fills the screen (default:false) [ignored in transform mode]
          // distanceFactor={10} // If set (default: undefined), children will be scaled by this factor, and also by distance to a PerspectiveCamera / zoom by a OrthographicCamera.
          // zIndexRange={[100, 0]} // Z-order range (default=[16777271, 0])
          // portal={domnodeRef} // Reference to target container (default=undefined)
          // transform // If true, applies matrix3d transformations (default=false)
          // sprite // Renders as sprite, but only in transform mode (default=false)
          // calculatePosition={(el: Object3D, camera: Camera, size: { width: number; height: number }) => number[]} // Override default positioning function. (default=undefined) [ignored in transform mode]
          // occlude={[ref]} // Can be true or a Ref<Object3D>[], true occludes the entire scene (default: undefined)
          // onOcclude={(visible) => null} // Callback when the visibility changes (default: undefined)
          // {...groupProps} // All THREE.Group props are valid
          // {...divProps} // All HTMLDivElement props are valid
        >
          <div className={cn(
            `select-none text-xs text-gray-950/80`,
            )}>
            {s.label || ""}
          </div>
        </Html>
          */}
      <a.mesh>
        <Text
          position={[
            // by default we are centered in the middle,
            // so we need to shift it back to the left
             (-(durationInSteps * cellWidth) / 2)

             // but also add a lil padding
             + (cellWidth / 2),
             0,
             1
          ]}

          // this controls the font size (the first two 5)
          scale={[4, 4, 1]}
          
          // scale={[
          //   (s.durationInSteps * cellWidth) / 5, // tiny padding
          //   cellHeight / 10, // tiny padding
          //   1
          // ]}
          
          lineHeight={1.0}
          color="#000000" // default
          fillOpacity={0.7}
          anchorX="left" // default
          anchorY="middle" // default
        >
          {lines.join("\n")}
        </Text>
    
      </a.mesh>
    </RoundedBox>
  )
}