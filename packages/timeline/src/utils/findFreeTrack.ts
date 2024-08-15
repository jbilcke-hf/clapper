import { ClapSegment, ClapSegmentFilteringMode, filterSegmentsWithinRange } from "@aitube/clap"

import { DEFAULT_NB_TRACKS } from "@/constants"

// search in an array of segment for the first available track, within a given range
export function findFreeTrack({
  segments = [],
  startTimeInMs = 0,
  endTimeInMs = Number.MAX_SAFE_INTEGER,
}: {
  segments: ClapSegment[]
  startTimeInMs?: number
  endTimeInMs?: number
}): number {
  // console.log("findFreeTrack(): segments:", segments)

  // identify any occurence of a segment being in our desired range
  const collisions: ClapSegment[] = filterSegmentsWithinRange(
    ClapSegmentFilteringMode.ANY,
    startTimeInMs,
    endTimeInMs,
    segments
  )

  // console.log("findFreeTrack(): collisions:", collisions)

  const MIN_TRACK_NUMBER = 1

  // trivial case: no collision!
  if (!collisions.length) {
    return MIN_TRACK_NUMBER // let's assign the uppermost track by default
  }

  // identify all the used tracks (note: some tracks might be empty)
  const occupiedTracks: number[] = Object.keys(
      collisions.reduce((acc, segment) => ({
      ...acc,
      [segment.track]: true
    }), {} as Record<string, boolean>)
  ).map(key => Number(key)).sort((a, b) => a - b)

  // TODO: those constants should be dynamic
  let freeTrack = DEFAULT_NB_TRACKS - 1

  for (let trackNumber = MIN_TRACK_NUMBER; trackNumber < (DEFAULT_NB_TRACKS - 1); trackNumber++) {
    if (!occupiedTracks.includes(trackNumber)) {
      freeTrack = trackNumber
      break
    }
  }

  return freeTrack
}