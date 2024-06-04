import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimelineState } from "./useTimelineState"

export const useVerticalGridLines = ({
  nbMaxShots,
}: {
  nbMaxShots: number
}) => {
  const cellWidth = useTimelineState(s => s.horizontalZoomLevel)
  const tracks = useTimelineState(s => s.tracks)
  const getVerticalCellPosition = useTimelineState(s => s.getVerticalCellPosition)
  const [gridlines, setGridLines] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const maxHeight = useTimelineState(s => s.maxHeight)

  useEffect(() => {

    const thisLines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    for (let i = 0; i < nbMaxShots; i++) {
      const verticalLinePoints = [
        new THREE.Vector3(i * cellWidth, 0, 0),
        new THREE.Vector3(i * cellWidth, -getVerticalCellPosition(0, tracks.length), 0)
      ];
      const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);

      thisLines.push(verticalLineGeometry);
    }

    setGridLines(thisLines);
  }, [
    maxHeight,
    cellWidth,
    nbMaxShots,
    JSON.stringify(tracks.map(t => `${t.visible}_${t.height}`))
  ]);

  return gridlines;
};