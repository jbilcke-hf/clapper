import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimelineState } from "./useTimelineState"

// note: those bug for loop just to render graduations might not be efficient
// maybe either we pre-compute everything and we let the runtime figure out what to render on screen,
// or we implement our own code to do that.. I don't know
export const useTimeScaleGraduations = ({
  nbMaxShots,
  unit
}: {
  nbMaxShots: number
  unit: number
}) => {
  const cellWidth = useTimelineState(s => s.horizontalZoomLevel)

  const [timeScaleGraduations, setTimeScaleGraduations] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);
  const maxHeight = useTimelineState(s => s.maxHeight)

  const bigTickHeight = 12
  const smallTickHeight = 8

  useEffect(() => {

    const lines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    if (cellWidth > 32) {
      for (let i = 0; i < nbMaxShots * 2; i++) {
        const verticalLinePoints = [
          new THREE.Vector3(i * (cellWidth / 2), 2, 1),
          new THREE.Vector3(
            i * (cellWidth / 2),
            i % unit === 0 ? bigTickHeight : smallTickHeight,
            1
          )
        ];
        const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
        lines.push(verticalLineGeometry);
      }
    } else if (cellWidth > 16) {
      for (let i = 0; i < nbMaxShots; i++) {
        const verticalLinePoints = [
          new THREE.Vector3(i * cellWidth, 2, 1),
          new THREE.Vector3(
            i * (cellWidth),
            i % unit === 0 ? bigTickHeight : smallTickHeight,
            1
          )
        ];
        const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
        lines.push(verticalLineGeometry);
      }
    } else if (cellWidth > 8) {
      for (let i = 0; i < nbMaxShots; i++) {
        if (i % 10 !== 0) { continue }
        const verticalLinePoints = [
          new THREE.Vector3(i * cellWidth, 2, 1),
          new THREE.Vector3(
            i * cellWidth,
            smallTickHeight,
            1
          )
        ];
        const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);

        lines.push(verticalLineGeometry);
      }
    } else {
      for (let i = 0; i < nbMaxShots; i++) {
        if (i % 20 !== 0) { continue }
        const verticalLinePoints = [
          new THREE.Vector3(i * cellWidth, 2, 1),
          new THREE.Vector3(
            i * cellWidth,
            smallTickHeight,
            1
          )
        ];
        const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);

        lines.push(verticalLineGeometry);
      }
    }

    setTimeScaleGraduations(lines);
  }, [maxHeight, cellWidth, nbMaxShots]);

  return timeScaleGraduations;
};