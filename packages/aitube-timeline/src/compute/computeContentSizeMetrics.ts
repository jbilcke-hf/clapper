import { ClapProject } from "@aitube/clap"

import { ContentSizeMetrics, Tracks } from "@/types/timeline"

import { computeCellHeight } from "./computeCellHeight"
import { DEFAULT_COLUMNS_PER_SLICE, DEFAULT_DURATION_IN_MS_PER_STEP, DEFAULT_NB_TRACKS, NB_MAX_SHOTS, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants/grid"

export function computeContentSizeMetrics({
  clap,
  tracks,
  cellWidth,
  defaultSegmentDurationInSteps,
}: {
  clap?: ClapProject
  tracks: Tracks
  cellWidth: number
  defaultSegmentDurationInSteps: number
}): ContentSizeMetrics {

  // in the future those might be dynamic / coming from settings
  const nbMaxShots = NB_MAX_SHOTS
  const nbMaxTracks = DEFAULT_NB_TRACKS
  const defaultCellHeight = PROMPT_STEP_HEIGHT_IN_PX

  const defaultSegmentLengthInPixels = cellWidth * defaultSegmentDurationInSteps

  // TODO: compute the exact image ratio instead of using the media orientation,
  // since it might not match the actual assets
  const defaultMediaRatio = clap ? (
    (clap.meta.width || 896) / (clap.meta.height || 512)
  ) : 1.75
  
  // also storyboards and videos might have different sizes / ratios
  const defaultPreviewHeight = Math.round(
    defaultSegmentLengthInPixels / defaultMediaRatio
  )
  
  let contentHeight = 0
  const newTracks: Tracks = tracks.map(track => {
    contentHeight += computeCellHeight({
      trackNumber: track.id,
      tracks,
      defaultCellHeight,
      defaultPreviewHeight
    })
    return {
      ...track,
      contentHeight,
    }
  })
  return {
    nbMaxShots,
    nbMaxTracks,
    nbIdentifiedTracks: newTracks.length,
    contentWidth: nbMaxShots * cellWidth,
    contentHeight,
    tracks: newTracks,
    cellWidth,
    defaultCellHeight,
    defaultSegmentDurationInSteps,
    defaultSegmentLengthInPixels,
    defaultMediaRatio,
    defaultPreviewHeight,
  }
}