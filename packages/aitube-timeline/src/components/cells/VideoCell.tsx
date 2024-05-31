import { useState } from "react"
import * as THREE from "three"
import { useSpring, a, animated, config } from "@react-spring/three"

import { SpecializedCellProps } from "./types"

export function VideoCell({
  segment: s,
  cellWidth,
  cellHeight,
  setHovered,
  durationInSteps,
  startTimeInSteps,
  colorScheme,
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

  return (
    <a.mesh
      key={s.id}
      position={[
        0,
        - ((1 + s.track) * cellHeight),
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
          >
          <videoTexture attach="map" args={[video]} />
          <videoTexture attach="emissiveMap" args={[video]} />
        </meshStandardMaterial>
    </a.mesh>
  )
}