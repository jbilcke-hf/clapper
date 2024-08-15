import { useEffect, useState } from "react"

import * as THREE from "three"
import { useTimeline } from "./useTimeline"

export const useAxis = () => {
  const [axis, setAxis] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const contentHeight = useTimeline(s => s.contentHeight)
  const contentWidth = useTimeline(s => s.contentWidth)

  useEffect(() => {
    const horizontalTop = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(contentWidth, 0, 1)
    ]);

    const vertical = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, -contentHeight, 1)
    ]);

    /*
    const horizontalBottom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -maxHeight, 1),
      new THREE.Vector3(width, -maxHeight, 1)
    ]);
    */
    setAxis([horizontalTop, vertical, 
      //horizontalBottom
      ]);
  }, [contentWidth, contentHeight]);

  return axis;
}