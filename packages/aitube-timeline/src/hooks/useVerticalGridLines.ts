import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimelineState } from "./useTimelineState"

export const useVerticalGridLines = ({
  nbMaxShots,
}: {
  nbMaxShots: number
}) => {
  const cellWidth = useTimelineState(s => s.horizontalZoomLevel)
  const getVerticalCellPosition = useTimelineState(s => s.getVerticalCellPosition)

  const getCellHeight = useTimelineState(s => s.getCellHeight)
  const cellHeight = getCellHeight()

  const nbIdentifiedTracks = useTimelineState(s => s.nbIdentifiedTracks)

  const [gridlines, setGridLines] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const maxHeight = cellHeight + getVerticalCellPosition(0, nbIdentifiedTracks)

  useEffect(() => {

    const thisLines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    for (let i = 0; i < nbMaxShots; i++) {
      const verticalLinePoints = [
        new THREE.Vector3(i * cellWidth, 0, 1),
        new THREE.Vector3(i * cellWidth, -maxHeight, 1)
      ];
      const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);

      thisLines.push(verticalLineGeometry);
    }

    setGridLines(thisLines);
  }, [maxHeight, cellWidth, nbMaxShots]);

  return gridlines;
};