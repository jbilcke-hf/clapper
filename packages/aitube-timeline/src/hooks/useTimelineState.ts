import { create } from "zustand"
import { ClapProject, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { TimelineStore } from "@/types/timeline"
import { getDefaultState } from "@/utils/getDefaultState"
import { DEFAULT_COLUMNS_PER_SLICE, DEFAULT_DURATION_IN_MS_PER_STEP, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"
import { removeFinalVideos } from "@/utils/removeFinalVideo"
import { hslToHex } from "@/utils/hslToHex"
import { ClapSegmentCategoryHues, ClapSegmentColorScheme } from "@/types"

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
      typicalSegmentDurationInSteps,
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

  getCellHeight: (trackNumber?: number): number => {
    const defaultCellHeight = PROMPT_STEP_HEIGHT_IN_PX
    let cellHeight = defaultCellHeight
 
    const {
      clap,
      trackToCellHeight,
      horizontalZoomLevel,
      originalHorizontalZoomLevel,
      typicalSegmentDurationInSteps
    } = get()
    
    if (!clap) { return cellHeight }

    const cellWidth = horizontalZoomLevel

    const typicalSegmentLengthInPixels = cellWidth * typicalSegmentDurationInSteps

    // TODO: compute the exact image ratio instead of using the media orientation,
    // since it might not match the actual assets
    const ratio = clap.meta.width / clap.meta.height
    
    // also storyboards and videos might have different sizes / ratios
    const previewHeight = Math.round(
      typicalSegmentLengthInPixels / ratio
    )

    
    if (typeof trackNumber === "number" && !isNaN(trackNumber) && isFinite(trackNumber)) {
      if (trackNumber === 0 || trackNumber === 1) {
       //  DISABLED
       //  cellHeight = previewHeight

        if (trackToCellHeight[trackNumber]) {
          cellHeight = trackToCellHeight[trackNumber]
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
  getSegmentColorScheme: (segment?: ClapSegment): ClapSegmentColorScheme => {

    const { theme } = get()

    let baseHue = 0
    let baseSaturation = theme.cell.saturation
    let baseLightness = theme.cell.lightness
    
    let colorScheme: ClapSegmentColorScheme = {
      baseHue,
      baseSaturation,
      baseLightness,
      
      backgroundColor: hslToHex(baseHue, baseSaturation, baseLightness),
      foregroundColor: hslToHex(baseHue, baseSaturation, baseLightness),
      borderColor: hslToHex(baseHue, baseSaturation, baseLightness),
      textColor: hslToHex(baseHue, baseSaturation, baseLightness),
    }

    if (!segment) { return colorScheme }

    const clapSegmentCategoryHues: ClapSegmentCategoryHues = theme.cell.hues

    const candidateHue = clapSegmentCategoryHues[segment.category]
    if (!candidateHue) { return colorScheme }

    baseHue = candidateHue

    colorScheme = {
      baseHue,
      baseSaturation,
      baseLightness,
    
      backgroundColor: hslToHex(baseHue, baseSaturation, baseLightness),
      foregroundColor: hslToHex(baseHue, baseSaturation, baseLightness),
      borderColor: hslToHex(baseHue, baseSaturation, baseLightness),
      textColor: hslToHex(baseHue, baseSaturation + 40, 30),
    }

    return colorScheme
  }
}))
