import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimelineState } from "./useTimelineState"
import { leftBarTrackScaleWidth } from "@/constants/themes"

export const useHorizontaTrackLines = () => {
  const cellWidth = useTimelineState(s => s.horizontalZoomLevel)
  const getVerticalCellPosition = useTimelineState(s => s.getVerticalCellPosition)

  const tracks = useTimelineState(s => s.tracks)

  const [lines, setLines] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  useEffect(() => {

    const thisLines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    for (let i = 0; i <= tracks.length; i++) {
      const horizontalLinePoints = [
        new THREE.Vector3(0, -getVerticalCellPosition(0, i), 0),
        new THREE.Vector3(leftBarTrackScaleWidth, -getVerticalCellPosition(0, i), 0)
      ];
      const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);

      thisLines.push(horizontalLineGeometry);
    }

    setLines(thisLines);
  }, [
    cellWidth,
    // maxWidth,
    // nbMaxShots,
    leftBarTrackScaleWidth,
    JSON.stringify(tracks.map(t => `${t.visible}_${t.height}`))
  ]);

  return lines;
};