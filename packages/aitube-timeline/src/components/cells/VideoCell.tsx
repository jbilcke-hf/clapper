import { useEffect, useState } from "react"
import * as THREE from "three"
import { useSpring, a, animated, config } from "@react-spring/three"

import { SpecializedCellProps } from "./types"

export function VideoCell({
  segment: s,
  cellWidth,
  cellHeight,
  isHovered,
  setHoveredSegment,
  durationInSteps,
  startTimeInSteps,
  colorScheme,
  isResizing,
  track
}: SpecializedCellProps) {

  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = s.assetUrl;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    // vid.play();
    return vid;
  })

  useEffect(() => {
    if (isHovered && video) {
      if (video.paused) {
        video.play()
      }
    } else {
      if (!video.paused) {
        video.pause()
      }
    }
  }, [isHovered])

  return (
    <a.mesh
      key={s.id}
      position={[
        0,
        -cellHeight,
        1
      ]}
    >
      <planeGeometry
      args={[durationInSteps * cellWidth, cellHeight]} />
        <meshStandardMaterial
          emissive={"white"}
          emissiveIntensity={1.0}
          side={THREE.FrontSide}
          // toneMapped={false}
          transparent
          opacity={
            track.visible ? 1 : 0.5
          }
          >
          <videoTexture attach="map" args={[video]} />
          <videoTexture attach="emissiveMap" args={[video]} />
        </meshStandardMaterial>
    </a.mesh>
  )
}