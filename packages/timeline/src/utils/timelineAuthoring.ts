import {
  ClapOutputType,
  ClapSegmentCategory,
  ClapTrack,
  ClapTracks,
} from "@aitube/clap"

export const TIMELINE_AUTHORING_CATEGORIES: ClapSegmentCategory[] = [
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.MUSIC,
  ClapSegmentCategory.ACTION,
  ClapSegmentCategory.CAMERA,
  ClapSegmentCategory.GENERIC,
]

const TRACK_CATEGORY_VALUES = new Set<string>(Object.values(ClapSegmentCategory))

export function getTrackCategory(track?: ClapTrack): ClapSegmentCategory | undefined {
  if (!track || !TRACK_CATEGORY_VALUES.has(track.name)) {
    return undefined
  }

  return track.name as ClapSegmentCategory
}

export function isPreviewCategory(category: ClapSegmentCategory): boolean {
  return category === ClapSegmentCategory.IMAGE || category === ClapSegmentCategory.VIDEO
}

export function outputTypeForCategory(category: ClapSegmentCategory): ClapOutputType {
  if (category === ClapSegmentCategory.IMAGE) {
    return ClapOutputType.IMAGE
  }
  if (category === ClapSegmentCategory.VIDEO) {
    return ClapOutputType.VIDEO
  }
  if (
    category === ClapSegmentCategory.DIALOGUE ||
    category === ClapSegmentCategory.SOUND ||
    category === ClapSegmentCategory.MUSIC
  ) {
    return ClapOutputType.AUDIO
  }
  if (category === ClapSegmentCategory.TRANSITION) {
    return ClapOutputType.TRANSITION
  }
  if (category === ClapSegmentCategory.EVENT) {
    return ClapOutputType.EVENT
  }
  if (category === ClapSegmentCategory.INTERFACE) {
    return ClapOutputType.INTERFACE
  }
  if (category === ClapSegmentCategory.PHENOMENON) {
    return ClapOutputType.PHENOMENON
  }

  return ClapOutputType.TEXT
}

export function snapTimeToStep(timeInMs: number, stepInMs: number): number {
  if (!Number.isFinite(timeInMs) || !Number.isFinite(stepInMs) || stepInMs <= 0) {
    return Math.max(0, timeInMs || 0)
  }

  return Math.max(0, Math.round(timeInMs / stepInMs) * stepInMs)
}

export function segmentRangesOverlap(
  firstStartInMs: number,
  firstEndInMs: number,
  secondStartInMs: number,
  secondEndInMs: number
): boolean {
  return firstStartInMs < secondEndInMs && secondStartInMs < firstEndInMs
}

export function hasTrackOverlap({
  segments,
  track,
  startTimeInMs,
  endTimeInMs,
  excludeSegmentId,
}: {
  segments: Array<{
    id: string
    track: number
    startTimeInMs: number
    endTimeInMs: number
  }>
  track: number
  startTimeInMs: number
  endTimeInMs: number
  excludeSegmentId?: string
}): boolean {
  return segments.some(segment => (
    segment.track === track &&
    segment.id !== excludeSegmentId &&
    segmentRangesOverlap(
      startTimeInMs,
      endTimeInMs,
      segment.startTimeInMs,
      segment.endTimeInMs
    )
  ))
}

export function findNextAvailableStartTime({
  segments,
  track,
  startTimeInMs,
  durationInMs,
  excludeSegmentId,
}: {
  segments: Array<{
    id: string
    track: number
    startTimeInMs: number
    endTimeInMs: number
  }>
  track: number
  startTimeInMs: number
  durationInMs: number
  excludeSegmentId?: string
}): number {
  let candidateStart = Math.max(0, startTimeInMs)
  let candidateEnd = candidateStart + durationInMs
  let moved = true

  while (moved) {
    moved = false
    for (const segment of segments) {
      if (segment.track !== track || segment.id === excludeSegmentId) {
        continue
      }
      if (segmentRangesOverlap(candidateStart, candidateEnd, segment.startTimeInMs, segment.endTimeInMs)) {
        candidateStart = segment.endTimeInMs
        candidateEnd = candidateStart + durationInMs
        moved = true
      }
    }
  }

  return candidateStart
}

export function getTrackAtPointY({
  tracks,
  pointY,
  defaultCellHeight,
}: {
  tracks: ClapTracks
  pointY: number
  defaultCellHeight: number
}): number | undefined {
  let trackTop = 0

  for (const track of tracks) {
    if (!track) {
      continue
    }
    const trackHeight = track.height || defaultCellHeight
    const trackBottom = trackTop - trackHeight

    if (pointY <= trackTop && pointY >= trackBottom) {
      return track.id
    }

    trackTop = trackBottom
  }

  return undefined
}
