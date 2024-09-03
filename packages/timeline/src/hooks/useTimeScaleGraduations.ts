import { useEffect, useState } from "react"
import * as THREE from "three"

import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "@/constants/themes"

import { useTimeline } from "./useTimeline"

// note: those big for-loop just to render graduations are not efficient
// please open a PR if you have a better idea, thank you
//
// maybe either we pre-compute everything and we let the runtime figure out what to render on screen,
// or we implement our own code to do that.. I don't know
export const useTimeScaleGraduations = ({
  unit
}: {
  unit: number
}) => {
  const containerWidth = useTimeline(s => s.containerWidth)
  const cellWidth = useTimeline(s => s.cellWidth)
  const nbMaxShots = useTimeline(s => s.nbMaxShots)
  const contentWidth = useTimeline((s) => s.contentWidth)

  const [timeScaleGraduations, setTimeScaleGraduations] = useState([] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[]);

  const bigTickHeight = 12
  const smallTickHeight = 8

  const maxWidth = contentWidth

  useEffect(() => {

    const lines = [] as THREE.BufferGeometry<THREE.NormalBufferAttributes>[];

    let x = 0
    if (cellWidth > 32) {
      for (let i = 0; i < nbMaxShots * 2; i++) {
        x = i * (cellWidth / 2)
        if (x > maxWidth) {
          break
        }
        const verticalLinePoints = [
          new THREE.Vector3(x, 2, 1),
          new THREE.Vector3(
            x,
            i % unit === 0 ? bigTickHeight : smallTickHeight,
            1
          )
        ];
        const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);
        lines.push(verticalLineGeometry);
      }
    } else if (cellWidth > 16) {
      for (let i = 0; i < nbMaxShots; i++) {
        x = i * (cellWidth)
        if (x > maxWidth) {
          break
        }
        const verticalLinePoints = [
          new THREE.Vector3(x, 2, 1),
          new THREE.Vector3(
            x,
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
        x = i * (cellWidth)
        if (x > maxWidth) {
          break
        }
        const verticalLinePoints = [
          new THREE.Vector3(x, 2, 1),
          new THREE.Vector3(
            x,
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
        x = i * (cellWidth)
        if (x > maxWidth) {
          break
        }
        const verticalLinePoints = [
          new THREE.Vector3(x, 2, 1),
          new THREE.Vector3(
            x,
            smallTickHeight,
            1
          )
        ];
        const verticalLineGeometry = new THREE.BufferGeometry().setFromPoints(verticalLinePoints);

        lines.push(verticalLineGeometry);
      }
    }

    setTimeScaleGraduations(lines);
  }, [cellWidth, nbMaxShots, leftBarTrackScaleWidth, contentWidth]);

  return timeScaleGraduations;
};