import { create } from "zustand"
import * as THREE from "three"
import { ClapEntity, ClapProject, ClapSegment, ClapSegmentCategory, ClapSegmentFilteringMode, filterSegments, newClap, serializeClap } from "@aitube/clap"

import { SegmentRenderer, TimelineStore, Track, Tracks } from "@/types/timeline"
import { getDefaultState } from "@/utils/getDefaultState"
import { DEFAULT_COLUMNS_PER_SLICE, DEFAULT_DURATION_IN_MS_PER_STEP, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"
import { removeFinalVideos } from "@/utils/removeFinalVideo"
import { hslToHex } from "@/utils/hslToHex"
import { ClapSegmentCategoryHues, ClapSegmentColorScheme, RenderingStrategy } from "@/types"
import { TimelineControlsImpl } from "@/components/controls/types"
import { TimelineCameraImpl } from "@/components/camera/types"
import { getFinalVideo } from "@/utils/getFinalVideo"
import { TimelineCursorImpl } from "@/components/timeline/types"
import { sliceSegments } from "@/utils"

export const useTimelineState = create<TimelineStore>((set, get) => ({
  ...getDefaultState(),
  setClap: async (clap?: ClapProject) => {
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

    const typicalSegmentLengthInPixels = cellWidth * typicalSegmentDurationInSteps

    // TODO: compute the exact image ratio instead of using the media orientation,
    // since it might not match the actual assets
    const ratio = (clap.meta?.width || 640) / (clap.meta?.height || 480)
    
    // also storyboards and videos might have different sizes / ratios
    const previewHeight = Math.round(
      typicalSegmentLengthInPixels / ratio
    )

    const defaultCellHeight = PROMPT_STEP_HEIGHT_IN_PX

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
          height:
            isPreview
            ? previewHeight
            : defaultCellHeight,
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

    const finalVideo = getFinalVideo(clap)
    
    const isEmpty = segments.length === 0

    const nbIdentifiedTracks = tracks.length
    const maxHeight = getCellHeight() + getVerticalCellPosition(0, nbIdentifiedTracks)
  
    /*
    // by default the buffer ("visibleSegments") will be empty,
    // waiting for some user interactions
    // we bootstrap it by giving it a pre-filtered list of segments
    //
    // TODO: we should move those computations to useVisibleSegments instead
    const howManyCellsAreVisible = (get().width / horizontalZoomLevel) + 10
    const beforeTimeInMs = howManyCellsAreVisible * DEFAULT_DURATION_IN_MS_PER_STEP

    const visibleSegments = await sliceSegments({
      segments,
      afterTimeInMs: 0,
      beforeTimeInMs,
      visibleSegments: []
    })
      */
    const visibleSegments: ClapSegment[] = []

    set({
      ...getDefaultState(),
      clap,
      segments,
      visibleSegments,
      segmentsChanged: 1,
      tracks,
      maxHeight,
      nbIdentifiedTracks,
      typicalSegmentDurationInSteps,
      isEmpty,
      isLoading: false,
      finalVideo,
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
    const {
      tracks: oldTracks,
      getCellHeight,
      getVerticalCellPosition
    } = get()

    const tracks = oldTracks.map(t => (
      t.id === trackId
      ? { ...t, visible: !t.visible }
      : t
    ))

    const maxHeight = getCellHeight() + getVerticalCellPosition(0, tracks.length)
  
    set({
      tracks,
      maxHeight,
    })
  },
  setContainerSize: ({ width, height }: { width: number; height: number }) => {

    const { tracks, getCellHeight, getVerticalCellPosition  } = get()

    const nbIdentifiedTracks = tracks.length
    const maxHeight = getCellHeight() + getVerticalCellPosition(0, nbIdentifiedTracks)
  
    set({
      width,
      height,
      resizeStartedAt: performance.now(),
      isResizing: true,
    })
  },
  setTimelineCursor: (timelineCursor?: TimelineCursorImpl) => {
    set({ timelineCursor })
  },
  setCursorTimestampAt: (cursorTimestampAt: number) => {
    set({ cursorTimestampAt })
  },
  saveClapAs: async ({
    embedded,

    saveToFilePath,

    showTargetDirPopup = false,

    // some extra text to append to the file name
    extraLabel = ""
  }: {
    // if embedded is true, the file will be larger, as all the content,
    // image, video, audio..
    // will be embedded into it (except the last big video)
    embedded?: boolean

    saveToFilePath?: string

    // note: the native select picker doesn't work in all browsers (eg. not in Firefox)
    // but it's not an issue, in our case we can save using Node/Electron + the cloud
    showTargetDirPopup?: boolean

    // some extra text to append to the file name
    extraLabel?: string
  } = {}) => {
    const clap = get().clap || newClap()

    const blob = await serializeClap(clap)

    // Create an object URL for the compressed clap blob
    const objectUrl = URL.createObjectURL(blob);
  
    // Create an anchor element and force browser download
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = saveToFilePath || `${clap.meta.title}${extraLabel}.clap`;
    document.body.appendChild(anchor); // Append to the body (could be removed once clicked)
    anchor.click(); // Trigger the download
  
    // Cleanup: revoke the object URL and remove the anchor element
    URL.revokeObjectURL(objectUrl);
    document.body.removeChild(anchor);

    return objectUrl.length
  },
  setStoryboardRenderingStrategy: (storyboardRenderingStrategy: RenderingStrategy) => {
    set({
      storyboardRenderingStrategy: storyboardRenderingStrategy || RenderingStrategy.ON_DEMAND
    })
  },
  setVideoRenderingStrategy: (videoRenderingStrategy: RenderingStrategy) => {
    set({
      videoRenderingStrategy: videoRenderingStrategy || RenderingStrategy.ON_DEMAND
    })
  },
  setSegmentRenderer: (segmentRenderer: SegmentRenderer) => {
    const defaultSegmentRenderer: SegmentRenderer = ( params: {
      segment: ClapSegment,
    
      // the slice to use for rendering
      segments: ClapSegment[],
    
      entities: Record<string, ClapEntity>
    }) => Promise.resolve(params.segment)

    set({
      segmentRenderer: (segmentRenderer || defaultSegmentRenderer)
    })
  },
  renderSegment: async (segment: ClapSegment) => {
    const { segmentRenderer, clap, segments } = get()

    return segmentRenderer({
      segment,
    
      // the slice to use for rendering
      segments: filterSegments(ClapSegmentFilteringMode.ANY, segment, segments),
    
      // TODO OPTIMIZATION:
      // we should filter the entities here,
      // to optimize the payload size
      entities: clap?.entityIndex || {},
    })
  },
}))
