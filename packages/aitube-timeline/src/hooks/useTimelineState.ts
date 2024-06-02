import { create } from "zustand"
import * as THREE from "three"
import { ClapProject, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { TimelineStore, Track, Tracks } from "@/types/timeline"
import { getDefaultState } from "@/utils/getDefaultState"
import { DEFAULT_COLUMNS_PER_SLICE, DEFAULT_DURATION_IN_MS_PER_STEP, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"
import { removeFinalVideos } from "@/utils/removeFinalVideo"
import { hslToHex } from "@/utils/hslToHex"
import { ClapSegmentCategoryHues, ClapSegmentColorScheme } from "@/types"
import { TimelineControlsImpl } from "@/components/controls/types"
import { TimelineCameraImpl } from "@/components/camera/types"

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

    set({ isLoading: true })

    console.log(`useTimelineState: setting the clap to`, clap)

    // we remove the big/long video
    const segments = removeFinalVideos(clap)
    const { horizontalZoomLevel, getCellHeight, getVerticalCellPosition } = get()
    const cellWidth = horizontalZoomLevel

    let typicalSegmentDurationInSteps = DEFAULT_COLUMNS_PER_SLICE * DEFAULT_DURATION_IN_MS_PER_STEP

    // TODO: many of those checks about average duration, nb of tracks, collisions...
    // should be done by the Clap parser and/or serializer
    // send a demand to Julian (@flngr) to get it fixed!

    let idCollisionDetector = new Set<string>()

    let tracks: Tracks = []

    for (const s of segments) {
      
      if (idCollisionDetector.has(s.id)) {
        console.log(`collision detected! there is already a segment with id ${s.id}`)
        continue
      }
      idCollisionDetector.add(s.id)

      if (!tracks[s.track]) {
        const isPreview =
          s.category === ClapSegmentCategory.STORYBOARD ||
          s.category === ClapSegmentCategory.VIDEO
        tracks[s.track] = {
          id: s.track,
          // name: `Track ${s.track}`,
          name: `${s.category}`,
          isPreview,
          height: isPreview
            ? PROMPT_STEP_HEIGHT_IN_PX * 3
            : PROMPT_STEP_HEIGHT_IN_PX,
          hue: 0,
          occupied: true,
          visible: true,
        }
      } else {
        
        const track = tracks[s.track]
        const categories = track.name.split(",").map(x => x.trim())
        if (!categories.includes(s.category)) {
          tracks[s.track].name = "(misc)"

          /*
          if (categories.length < 2) {
            categories.push(s.category)
            track.name = categories.join(", ")
          } else if (!track.name.includes("..")) {
            track.name = track.name + ".."
          }
          */
        }
        
  
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
    const ratio = (clap.meta?.width || 640) / (clap.meta?.height || 480)
    
    // also storyboards and videos might have different sizes / ratios
    const previewHeight = Math.round(
      typicalSegmentLengthInPixels / ratio
    )

    const nbIdentifiedTracks = tracks.length
    const maxHeight = getCellHeight() + getVerticalCellPosition(0, nbIdentifiedTracks)
  
    for (let id = 0; id < tracks.length; id++) {
      if (!tracks[id]) {
        tracks[id] = {
          id,
          name: `(empty)`,
          isPreview: false,
          height: PROMPT_STEP_HEIGHT_IN_PX,
          hue: 0,
          occupied: false, // <-- setting this to false is the important part
          visible: true,
        }
      }
    }

    const isEmpty = segments.length > 0
    set({
      ...getDefaultState(),
      clap,
      segments,
      visibleSegments: [],
      tracks,
      maxHeight,
      nbIdentifiedTracks,
      typicalSegmentDurationInSteps,
      isEmpty,
      isLoading: false,
    })
  },
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => {
    const { minHorizontalZoomLevel, maxHorizontalZoomLevel } = get()
    const horizontalZoomLevel = Math.min(maxHorizontalZoomLevel, Math.max(minHorizontalZoomLevel, newHorizontalZoomLevel))
    set({
      horizontalZoomLevel,
      resizeStartedAt: performance.now(),
      isResizing: true,
    })
  },
  
  setSegments: (segments: ClapSegment[] = []) => {
    set({ segments, visibleSegments: [] })
  },
  setVisibleSegments: (visibleSegments: ClapSegment[] = []) => { set({ visibleSegments }) },

  getCellHeight: (trackNumber?: number): number => {
    const defaultCellHeight = PROMPT_STEP_HEIGHT_IN_PX
    let cellHeight = defaultCellHeight
 
    const {
      clap,
      horizontalZoomLevel,
      tracks,
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
      const track = tracks[trackNumber]
      if (track) {
        cellHeight =
          track.isPreview && track.visible
          ? previewHeight
          : track.visible
          ? track.height
          : defaultCellHeight
      } else {
        // missing data
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
      
      backgroundColor: hslToHex(baseHue, baseSaturation + 10, baseLightness),
      backgroundColorHover: hslToHex(baseHue, baseSaturation + 20, baseLightness + 1),
      backgroundColorDisabled: hslToHex(baseHue, baseSaturation - 10, baseLightness - 2),
      foregroundColor: hslToHex(baseHue, baseSaturation + 40, baseLightness),
      borderColor: hslToHex(baseHue, baseSaturation + 40, baseLightness + 10),
      textColor: hslToHex(baseHue, baseSaturation + 55, baseLightness - 60),
      textColorHover: hslToHex(baseHue, baseSaturation + 55, baseLightness - 50),
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
    
      backgroundColor: hslToHex(baseHue, baseSaturation + 10, baseLightness),
      backgroundColorHover: hslToHex(baseHue, baseSaturation + 20, baseLightness + 1),
      backgroundColorDisabled: hslToHex(baseHue, baseSaturation - 10, baseLightness - 2),
      foregroundColor: hslToHex(baseHue, baseSaturation + 40, baseLightness),
      borderColor: hslToHex(baseHue, baseSaturation + 40, baseLightness + 10),
      textColor: hslToHex(baseHue, baseSaturation + 55, baseLightness - 60),
      textColorHover: hslToHex(baseHue, baseSaturation + 55, baseLightness - 50),
    }

    return colorScheme
  },
  setHoveredSegment: (hoveredSegment?: ClapSegment) => {
    // note: we do all of this in order to avoid useless state updates
    if (hoveredSegment) {
      if (get().hoveredSegment?.id !== hoveredSegment?.id) {
        set({ hoveredSegment })
      }
    } else {
      if (get().hoveredSegment) {
        set({ hoveredSegment: undefined })
      }
    }

  },
  setTimelineCamera: (timelineCamera?: TimelineCameraImpl) => {
    set({ timelineCamera })
  },
  setTimelineControls: (timelineControls?: TimelineControlsImpl) => {
    set({ timelineControls })
  },
  setTopBarTimelineScale: (topBarTimelineScale?: THREE.Group<THREE.Object3DEventMap>) => {
    set({ topBarTimelineScale })
  },
  setLeftBarTrackScale: (leftBarTrackScale?: THREE.Group<THREE.Object3DEventMap>) => {
    set({ leftBarTrackScale })
  },
  handleMouseWheel: ({ deltaX, deltaY }: { deltaX: number, deltaY: number }) => {
    const { scrollX, scrollY } = get()
    set({
      scrollX: scrollX + deltaX,
      scrollY: scrollY - deltaY,
    })
  },
  toggleTrackVisibility: (trackId: number) => {
    const { tracks } = get()
    set({
      tracks: tracks.map(t => (
        t.id === trackId
        ? { ...t, visible: !t.visible }
        : t
      )),
    })
  }
}))
