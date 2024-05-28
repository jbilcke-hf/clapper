import React, { useEffect, useRef, useState } from "react"
import { GradientTexture, Plane, Text, RoundedBox, Center, Billboard, Html, MeshPortalMaterial } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useSpring, a, animated, config } from "@react-spring/three"

import { DEFAULT_DURATION_IN_MS_PER_STEP, DEFAULT_NB_TRACKS } from "@/constants"
import { clampWebGLText, getSegmentColorHex } from "@/utils"
import {
  usePreviewTrackHeight,
  useCellWidth,
  useStandardTrackHeight,
  useVisibleSegments,
  useAxis,
  useGridLines
} from "@/hooks"

export function TimelineGrid() {
  const { size, viewport } = useThree()

  const previewCellHeight = usePreviewTrackHeight()
  const cellHeight = useStandardTrackHeight() // cellHeight
  const cellWidth = useCellWidth() // 10

  const nbMaxShots = ((3 * 60 * 60) / 2) // 3 hours converted to seconds, and divided by 2 (a shot is about 2 sec)
  const nbMaxTracks = DEFAULT_NB_TRACKS

  const [scale, setScale] = useState(50)

  const aspect = size.width / viewport.width;

  const controls = useThree((state) => state.controls)
  const camera = useThree((state) => state.camera)

  const width = nbMaxShots * cellWidth
  const height = nbMaxTracks * cellHeight

  const axis = useAxis(width, height)
  const gridlines = useGridLines({
    cellHeight,
    cellWidth,
    nbMaxTracks,
    nbMaxShots,
  });

  // note: this one is async, so it creates a delay
  // we could cheat by detecting the cell width change and apply it
  // faster on the current geometries 
  const visibleSegments = useVisibleSegments({
    cellHeight,
    cellWidth,
    nbMaxTracks,
  });

  const [hovered, setHovered] = useState("")

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'

    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  const [props, set] = useSpring(() => ({
    pos: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 }
  }))
  
  return (
    <mesh
      // this any is a code smell, we are forcing the react spring data structure into
      // the three one - feel free to fix this
      // {...dragSpring as any}
      // {...bindDrag()}
    >
      <Plane args={[width, height]} position={[0,0,-1]}>
        {/* background */}
        <meshBasicMaterial attach="material" color={"rgb(35,42,56)"} />

        <group position={[0, height / 2, -1]}>
          {gridlines.map((lineGeometry, idx) => (
            <line
              // @ts-ignore
              geometry={lineGeometry}
              key={idx}>
              <lineBasicMaterial
                attach="material"
                color={"#374151"}
                linewidth={1}
              />
            </line>
          ))}
        </group>

        <group position={[0, height / 2, -1]}>
          {axis.map((lineGeometry, idx) => (
            <line
              // @ts-ignore
              geometry={lineGeometry}
              key={idx}>
              <lineBasicMaterial
                attach="material"
                color={"#4b5563"}
                linewidth={1}
              />
            </line>
          ))}
        </group>

        <group position={[
          0,
          // height/2 is to shift the group above, to make it centered
          // cellHeight/2 is to also take into account the height of a cell
          (height / 2) - (cellHeight / 2),
           -1
           ]}>
          {visibleSegments.map((s) => {

            // this depends on the current row height
            const maxNbLines = 2

            const durationInSteps = (s.endTimeInMs - s.startTimeInMs) * DEFAULT_DURATION_IN_MS_PER_STEP

            const startTimeInSteps = s.startTimeInMs * DEFAULT_DURATION_IN_MS_PER_STEP

            // note: an alternative could be to create a small fade or blur effect,
            // but I think it might be expensive
            const lines = clampWebGLText(
              s.label,
              durationInSteps * cellWidth,
              maxNbLines
            )
            // const label = clampWebGLTextNaive(s.label, durationInSteps * cellWidth)
   
            return (
            <a.mesh
              key={s.id}
              position={[
                (startTimeInSteps * cellWidth) + cellWidth,
                -s.track * cellHeight + cellHeight,
                1
              ]}
            >
              <RoundedBox
                args={[
                  (durationInSteps * cellWidth) - 0.1, // tiny padding
                  cellHeight - 0.1, // tiny padding
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
                <meshBasicMaterial
                  color={getSegmentColorHex(s).bg}
                />
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
                  <a.mesh
                    // scale={[2, 2, 1]}
                  >
        
                <Text
                  position={[
                    // shift it back to the left
                     -(cellWidth * 2) + (cellWidth / 4), // ((s.startTimeInSteps * cellWidth) + cellWidth) / 10,
                     0,
                     1
                  ]}

                  // this controls the font size (the first two 5)
                  scale={[5, 5, 1]}
                  /*
                  scale={[
                    (s.durationInSteps * cellWidth) / 5, // tiny padding
                    cellHeight / 10, // tiny padding
                    1
                  ]}
                  */
                  color="#000000" // default
                  fillOpacity={0.7}
                  anchorX="left" // default
                  anchorY="middle" // default
                >
                  {lines.join("\n")}
                </Text>
       
                </a.mesh>
              </RoundedBox>
            </a.mesh>
            )
          })}
        </group>

      </Plane>
    </mesh>
  );
};
