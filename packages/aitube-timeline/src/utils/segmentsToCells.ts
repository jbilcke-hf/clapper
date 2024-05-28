import * as THREE from "three"
import { ClapSegment } from "@aitube/clap"

import { Cell } from "@/types/grid"

import { getSegmentColorHex } from "./getSegmentColorHex"
import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants"
import { sleep } from "./sleep"

// TODO put this in a web workers for smoother operations?
export async function segmentsToCells({
  segments,
  cellHeight,
  cellWidth,
  nbMaxTracks,
  afterTimeInMs,
  beforeTimeInMs,
}: {
  segments: ClapSegment[]
  cellHeight: number
  cellWidth: number
  nbMaxTracks: number
  afterTimeInMs: number
  beforeTimeInMs: number
}): Promise<Cell[]> {

  const cells: Cell[] = [];

  console.log("starting segmentsToCells cellWidth = ${cellWidth}`")
  // const maxWidth = nbMaxShots * cellWidth
  // const maxHeight = nbTracks * cellHeight

  // TODO: we should take our time, to not do this too quickly
  // we want to let it "breath"

  let i = 0

  let addAsyncDelayEveryItems = 100
  let addAsyncDelayInMs = 50

  console.log(`segmentsToCell(): slicing [${afterTimeInMs}:${beforeTimeInMs}] of ${segments.length} segments`)
  // TODO: we should probably try to keep the existing structure if possible

  // since the for loop is a blocker, we turn it into an async thing
  for (const segment of segments) {

    // this helps spliting the segment scanning work, even if we have a huge number of segments
    const reachedMilestone = !(++i % addAsyncDelayEveryItems)
    if (reachedMilestone) {
      // console.log("reached milestone")
      await sleep(addAsyncDelayInMs)
    }

    // we only keep segments within a given range
    // those are not necessarily visible (there is a security margin)
    if (
      segment.startTimeInMs < afterTimeInMs ||
      segment.endTimeInMs > beforeTimeInMs
    ) { continue }

    const colors = getSegmentColorHex(segment)

    // TODO: put this somewhere else, in a separate function
    // that way we will be able to dynamically adjust it
    const startTimeInSteps = segment.startTimeInMs / DEFAULT_DURATION_IN_MS_PER_STEP
    const durationInSteps = (segment.endTimeInMs - segment.startTimeInMs) / DEFAULT_DURATION_IN_MS_PER_STEP

    const cell: Cell = {
      position: new THREE.Vector3(
        (startTimeInSteps * cellWidth) + cellWidth,

        //  we are negative here as the reference point is in top left
        -segment.track * cellHeight + cellHeight,
        1
      ),

      // TODO use segment data to determine the cell height and width
      width: (durationInSteps * cellWidth) - 0.2, // tiny padding
      height: cellHeight - 0.2, // tiny padding

      color: colors.bg
    };

    cells.push(cell)
  }
  // console.log("segmentsToCells ended!")

  return cells
}
