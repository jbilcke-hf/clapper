import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimeline } from "./useTimeline"
import { leftBarTrackScaleWidth } from "@/constants";
import { topBarTimeScaleHeight } from "@/constants/themes";

export const useCursorGeometry = () => {


  const [gridlines, setGridLines] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const contentHeight = useTimeline(s => s.contentHeight)
 
  // the width of the cursor (this includes the cursor + a nice gradient trail)
  const widthInPx = 24

  useEffect(() => {

    const thisLines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    for (let i = 0; i < widthInPx; i++) {
      const verticalLinePoints = [
        new THREE.Vector3(i - widthInPx, 60, 1),
        new THREE.Vector3(i - widthInPx, -contentHeight, 1)
      ];
      const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);

      thisLines.push(verticalLineGeometry);
    }
   
    setGridLines(thisLines);
  }, [contentHeight]);

  return gridlines;
};