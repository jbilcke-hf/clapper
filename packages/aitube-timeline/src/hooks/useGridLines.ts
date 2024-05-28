import { useEffect, useState } from "react"

import * as THREE from "three"

export const useGridLines = ({
  cellHeight,
  cellWidth,
  nbMaxTracks,
  nbMaxShots,
}: {
  cellHeight: number,
  cellWidth: number,
  nbMaxTracks: number,
  nbMaxShots: number,
}) => {
  const [gridlines, setGridLines] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const maxWidth = nbMaxShots * cellWidth
  const maxHeight = nbMaxTracks * cellHeight

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

    for (let i = 0; i < nbMaxTracks; i++) {
      const horizontalLinePoints = [
        new THREE.Vector3(0, -i * cellHeight, 1),
        new THREE.Vector3(maxWidth, -i * cellHeight, 1)
      ];
      const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints(horizontalLinePoints);

      thisLines.push(horizontalLineGeometry);
    }

    setGridLines(thisLines);
  }, [maxWidth, maxHeight, cellHeight, cellWidth, nbMaxTracks, nbMaxShots]);

  return gridlines;
};