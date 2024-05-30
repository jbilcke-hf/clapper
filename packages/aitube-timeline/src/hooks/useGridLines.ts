import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimelineState } from "./useTimelineState"

export const useGridLines = ({
  nbMaxShots,
}: {
  nbMaxShots: number
}) => {
  const cellWidth = useTimelineState(s => s.horizontalZoomLevel)
  const getCellHeight = useTimelineState(s => s.getCellHeight)
  const getVerticalCellPosition = useTimelineState(s => s.getVerticalCellPosition)

  const nbIdentifiedTracks = useTimelineState(s => s.nbIdentifiedTracks)

  const [gridlines, setGridLines] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const maxWidth = nbMaxShots * cellWidth
  const maxHeight = getVerticalCellPosition(0, nbIdentifiedTracks)

  useEffect(() => {

    const thisLines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    // TODO: this is a 
    for (let i = 0; i < nbMaxShots; i++) {
      const verticalLinePoints = [
        new THREE.Vector3(i * cellWidth, 0, 1),
        new THREE.Vector3(i * cellWidth, -maxHeight, 1)
      ];
      const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);

      thisLines.push(verticalLineGeometry);
    }

    for (let i = 0; i < nbIdentifiedTracks; i++) {
      const horizontalLinePoints = [
        new THREE.Vector3(0, -getVerticalCellPosition(0, i), 1),
        new THREE.Vector3(maxWidth, -getVerticalCellPosition(0, i), 1)
      ];
      const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);

      thisLines.push(horizontalLineGeometry);
    }

    setGridLines(thisLines);
  }, [maxWidth, maxHeight, cellWidth, nbIdentifiedTracks, nbMaxShots]);

  return gridlines;
};