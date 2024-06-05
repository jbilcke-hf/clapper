import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimelineState } from "./useTimelineState"
import { useThree } from "@react-three/fiber";
import { leftBarTrackScaleWidth } from "@/constants/themes";

export const useCursorGeometry = () => {


  const [gridlines, setGridLines] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const contentHeight = useTimelineState(s => s.contentHeight)
 
  useEffect(() => {

    const thisLines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    for (let i = 0; i < 3; i++) {
      const verticalLinePoints = [
        new THREE.Vector3(i, 60, 7),
        new THREE.Vector3(i, -contentHeight, 7)
      ];
      const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);

      thisLines.push(verticalLineGeometry);
    }
   
    setGridLines(thisLines);
  }, [contentHeight]);

  return gridlines;
};