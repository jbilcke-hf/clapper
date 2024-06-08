import { useEffect, useState } from "react"
import * as THREE from "three"

import { useTimeline } from "./useTimeline"

// note: those bug for loop just to render graduations might not be efficient
// maybe either we pre-compute everything and we let the runtime figure out what to render on screen,
// or we implement our own code to do that.. I don't know
export const useTimeScaleGraduations = ({
  unit
}: {
  unit: number
}) => {
  const cellWidth = useTimeline(s => s.cellWidth)
  const nbMaxShots = useTimeline(s => s.nbMaxShots)

  const [timeScaleGraduations, setTimeScaleGraduations] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

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
    }

    setTimeScaleGraduations(lines);
  }, [cellWidth, nbMaxShots]);

  return timeScaleGraduations;
};