import { useEffect, useState } from "react"

import * as THREE from "three"
import { useTimelineState } from "./useTimelineState";

export const useAxis = (width: number, height: number) => {
  const [axis, setAxis] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const maxHeight = useTimelineState(s => s.maxHeight)

  useEffect(() => {
    const horizontalTop = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(width, 0, 1)
    ]);

    const vertical = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, -maxHeight, 1)
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
  }, [width, height]);

  return axis;
}