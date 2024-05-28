import { useEffect, useState } from "react"

import * as THREE from "three"

export const useAxis = (width: number, height: number) => {
  const [axis, setAxis] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  useEffect(() => {
    const OX = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(width, 0, 1)
    ]);

    const OY = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, -height, 1)
    ]);
    setAxis([OY, OX]);
  }, [width, height]);

  return axis;
}