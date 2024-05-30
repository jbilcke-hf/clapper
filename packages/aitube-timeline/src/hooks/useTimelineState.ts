import { create } from "zustand"
import { ClapMediaOrientation, ClapProject, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { TimelineStore } from "@/types/timeline"
import { getDefaultState } from "@/utils/getDefaultState"
import { DEFAULT_COLUMNS_PER_SLICE, DEFAULT_DURATION_IN_MS_PER_STEP, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"
import { removeFinalVideos } from "@/utils/removeFinalVideo"

export const useTimelineState = create<TimelineStore>((set, get) => ({
  ...getDefaultState(),
  setClap: (clap?: ClapProject) => {
    if (!clap || !Array.isArray(clap?.segments)) {
      console.log(`useTimelineState: empty clap, so resetting`)
      set({
        ...getDefaultState()
      })
      return
    }
    console.log(`useTimelineState: setting the clap to`, clap)

    // we remove the big/long video
    const segments = removeFinalVideos(clap)
    const cellWidth = get().horizontalZoomLevel

    let typicalSegmentDurationInSteps = DEFAULT_COLUMNS_PER_SLICE * DEFAULT_DURATION_IN_MS_PER_STEP

    // TODO: should be done by the Clap parser and/or serializer
    // send a demand to Julian (@flngr) to get it fixed
    let nbIdentifiedTracks = 0
    for (const s of segments) {
      if (s.track > nbIdentifiedTracks) {
        nbIdentifiedTracks = s.track
      }

      if (s.category === ClapSegmentCategory.CAMERA) {
        const durationInSteps = (
          (s.endTimeInMs - s.startTimeInMs) / DEFAULT_DURATION_IN_MS_PER_STEP
        )
        typicalSegmentDurationInSteps = durationInSteps
      }
    }

    const typicalSegmentLengthInPixels = cellWidth * typicalSegmentDurationInSteps

    // TODO: compute the exact image ratio instead of using the media orientation,
    // since it might not match the actual assets
    const ratio = clap.meta.width / clap.meta.height
    
    // also storyboards and videos might have different sizes / ratios
    const previewHeight = Math.round(
      typicalSegmentLengthInPixels / ratio
    )

    console.log('DEBUG:', {
      orientation: clap.meta.orientation,
      typicalSegmentDurationInSteps,
      ratio,
      previewHeight
    })

    const trackToCellHeight: Record<number, number> = {
      // VIDEO
      0: previewHeight,

      // STORYBOARD
      1: previewHeight
    }

    set({
      ...getDefaultState(),
      clap,
      segments,
      visibleSegments: segments,
      nbIdentifiedTracks,
      trackToCellHeight,
    })
  },
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => {
    const { minHorizontalZoomLevel, maxHorizontalZoomLevel } = get()
    const horizontalZoomLevel = Math.min(maxHorizontalZoomLevel, Math.max(minHorizontalZoomLevel, newHorizontalZoomLevel))
    set({ horizontalZoomLevel })
  },
  
  setSegments: (segments: ClapSegment[] = []) => {
    set({ segments, visibleSegments: segments })
  },
  setVisibleSegments: (visibleSegments: ClapSegment[] = []) => { set({ visibleSegments }) },

  getCellHeight: (segmentOrTrackNumber?: number | ClapSegment): number => {
    const { trackToCellHeight } = get()
    const defaultCellHeight = PROMPT_STEP_HEIGHT_IN_PX
    let cellHeight = defaultCellHeight

    if (typeof segmentOrTrackNumber === "number" && !isNaN(segmentOrTrackNumber) && isFinite(segmentOrTrackNumber)) {
      const trackNumber = segmentOrTrackNumber 
      const value = trackToCellHeight[trackNumber]
      if (typeof value === "number" && !isNaN(value) && isFinite(value)) {
        cellHeight = value
      }
    } else if (typeof segmentOrTrackNumber === "object") {
      if (typeof segmentOrTrackNumber.track === "number" && !isNaN(segmentOrTrackNumber.track) && isFinite(segmentOrTrackNumber.track)) {
        const value = trackToCellHeight[segmentOrTrackNumber.track]
        if (typeof value === "number" && !isNaN(value) && isFinite(value)) {
          cellHeight = value
        }
      }
    }

    return cellHeight
  },


  getVerticalCellPosition: (start: number, end: number): number => {
    const { getCellHeight } = get()

    let height = 0
    for (let i = start; i < end; i++) {
      height += getCellHeight(i)
    }
    return height
  },
}))
