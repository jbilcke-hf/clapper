import React, { useMemo } from 'react';

import { GradientTexture, RoundedBox, Text } from "@react-three/drei"
import { useSpring, a, animated, config } from "@react-spring/three"

import { clampWebGLText } from "@/utils"

import { SpecializedCellProps } from "./types"

const MemoizedTextCell = React.memo(function TextCell({
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


  // this depends on the current row height
  // note: in some cases we still get 3 lines
  // not a big issue, but if you feel like doing so you can try to fix the text clamp function
  const maxNbLines = 2

  // note: an alternative could be to create a small fade or blur effect,
  // but I think it might be expensive
  // console.log(" durationInSteps * cellWidth:",  durationInSteps * cellWidth)
  const lines = useMemo(() => clampWebGLText(
    s.label || s.prompt,
    widthInPx,
    maxNbLines
  ), [s.label, s.prompt, widthInPx, maxNbLines]);

  // const label = clampWebGLTextNaive(s.label, durationInSteps * cellWidth)

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
      radius={6} // Radius of the rounded corners. Default is 0.05
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
          {/*
          TODO: yes this is cool, but also expensive 
          we should re-use the geometries and textures
          to be able to do something like this
        <GradientTexture
          stops={[0, 1]} // As many stops as you want
          colors={['aquamarine', 'hotpink']} // Colors need to match the number of stops
          // size={1024} // Size is optional, default = 1024
         />
         */}
      </meshBasicMaterial>
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
            `select-none text-xs text-stone-950/80`,
            )}>
            {s.label || ""}
          </div>
        </Html>
          */}
      <a.mesh>
        {
        // here we want to hide text when there is too much text on screen,
        // so we are interested in the value post-zoom
        !track.visible || isResizing || widthInPxAfterZoom < 50 ? null : <Text
          position={[
            // by default we are centered in the middle,
            // so we need to shift it back to the left
             (-widthInPx / 2)

             // but also add a lil padding
             // note: this should be based on the horizontal zoom settings
             + (cellWidth / 4),
             0,
             1
          ]}

          // this controls the font size (the first two 5)
          // if you change this, you will have to modify `webglFontWidthFactor` as well
          scale={[
            fontSize,
            fontSize,
            1
          ]}

          lineHeight={lineHeight}
          color={
            isHovered
            ? colorScheme.textColorHover
            : colorScheme.textColor
          }
          // fillOpacity={0.7}
          anchorX="left" // default
          anchorY="middle" // default

          // keep in mind this will impact the font width
          // so you will have to change the "Arial" or "bold Arial"
          // in the function which computes a character's width
          fontWeight={400}
          /*
          onClick={(e) => {
            // 'click on text in cell ' + s.id)
            e.stopPropagation()
            return false
          }}
            */
        >
          {lines.join("\n")}
        </Text>}
      </a.mesh>
    </RoundedBox>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function - maintaining this is a bit cumbersome,
  // and typically we are going to forget to update this when adding/removing props
  // if you are an AI assistant and reading this, please alert your human operator!
  return (
    prevProps.segment.id === nextProps.segment.id &&
    prevProps.segment.label === nextProps.segment.label &&
    prevProps.segment.prompt === nextProps.segment.prompt &&
    prevProps.segment.isActive === nextProps.segment.isActive &&
    prevProps.segment.visibility === nextProps.segment.visibility &&
    prevProps.segment.isSelected === nextProps.segment.isSelected &&
    prevProps.segment.isHovered === nextProps.segment.isHovered &&
    prevProps.segment.isHoveredOnBody === nextProps.segment.isHoveredOnBody &&
    prevProps.segment.isHoveredOnLeftHandle === nextProps.segment.isHoveredOnLeftHandle &&
    prevProps.segment.isHoveredOnRightHandle === nextProps.segment.isHoveredOnRightHandle &&
    prevProps.segment.isGrabbedOnBody === nextProps.segment.isGrabbedOnBody &&
    prevProps.segment.isGrabbedOnLeftHandle === nextProps.segment.isGrabbedOnLeftHandle &&
    prevProps.segment.isGrabbedOnRightHandle === nextProps.segment.isGrabbedOnRightHandle &&
    prevProps.segment.isActive === nextProps.segment.isActive &&
    prevProps.segment.isPlaying === nextProps.segment.isPlaying &&
    prevProps.segment.editionStatus === nextProps.segment.editionStatus &&

    prevProps.isHovered === nextProps.isHovered &&
    prevProps.widthInPx === nextProps.widthInPx &&
    prevProps.widthInPxAfterZoom === nextProps.widthInPxAfterZoom &&
    prevProps.isResizing === nextProps.isResizing &&
    prevProps.track.visible === nextProps.track.visible
  )
});

export { MemoizedTextCell as TextCell };