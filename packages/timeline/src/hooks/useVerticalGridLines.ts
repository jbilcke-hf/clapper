import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimeline } from "./useTimeline"
import { NB_MAX_SHOTS } from "@/constants/grid"

export const useVerticalGridLines = () => {
  const cellWidth = useTimeline(s => s.cellWidth)
  const contentHeight = useTimeline(s => s.contentHeight)
  const tracks = useTimeline(s => s.tracks)
  const [gridlines, setGridLines] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const nbMaxShots = useTimeline(s => s.nbMaxShots)

  useEffect(() => {

    const thisLines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    for (let i = 0; i < nbMaxShots; i++) {
      const verticalLinePoints = [
        new THREE.Vector3(i * cellWidth, 0, 0),
        new THREE.Vector3(i * cellWidth, -contentHeight, 0)
      ];
      const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);

      thisLines.push(verticalLineGeometry);
    }

    setGridLines(thisLines);
  }, [
    contentHeight,
    cellWidth,
    nbMaxShots,
    JSON.stringify(tracks.map((t: any) => `${t.visible}_${t.height}`))
  ]);

  return gridlines;
};