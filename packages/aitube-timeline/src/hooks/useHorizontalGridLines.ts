import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimelineState } from "./useTimelineState"

export const useHorizontalGridLines = ({
  nbMaxShots,
}: {
  nbMaxShots: number
}) => {
  const cellWidth = useTimelineState(s => s.horizontalZoomLevel)
  const getVerticalCellPosition = useTimelineState(s => s.getVerticalCellPosition)

  const nbIdentifiedTracks = useTimelineState(s => s.nbIdentifiedTracks)

  const [gridlines, setGridLines] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const maxWidth = nbMaxShots * cellWidth

  useEffect(() => {

    const thisLines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    for (let i = 0; i <= nbIdentifiedTracks; i++) {
      const horizontalLinePoints = [
        new THREE.Vector3(0, -getVerticalCellPosition(0, i), 1),
        new THREE.Vector3(maxWidth, -getVerticalCellPosition(0, i), 1)
      ];
      const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);

      thisLines.push(horizontalLineGeometry);
    }

    setGridLines(thisLines);
  }, [maxWidth, cellWidth, nbIdentifiedTracks, nbMaxShots]);

  return gridlines;
};