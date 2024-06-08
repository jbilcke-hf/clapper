import { create } from "zustand"
import * as THREE from "three"
import { ClapEntity, ClapProject, ClapSegment, ClapSegmentCategory, ClapSegmentFilteringMode, filterSegments, newClap, serializeClap } from "@aitube/clap"

import { TimelineStore, Tracks } from "@/types/timeline"
import { getDefaultProjectState, getDefaultState } from "@/utils/getDefaultState"
import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants"
import { removeFinalVideos } from "@/utils/removeFinalVideos"
import { hslToHex } from "@/utils/hslToHex"
import { ClapSegmentCategoryHues, ClapSegmentColorScheme, RenderingStrategy, SegmentRenderer } from "@/types"
import { TimelineControlsImpl } from "@/components/controls/types"
import { TimelineCameraImpl } from "@/components/camera/types"
import { getFinalVideo } from "@/utils/getFinalVideo"
import { TimelineCursorImpl } from "@/components/timeline/types"
import { computeContentSizeMetrics } from "@/compute/computeContentSizeMetrics"
import { findFreeTrack } from "@/utils/findFreeTrack"

export const useTimeline = create<TimelineStore>((set, get) => ({
  ...getDefaultState(),
  setClap: async (clap?: ClapProject) => {

    // this re-initialize everything that is related to the current .clap project
    set({
      ...getDefaultProjectState()
    })

    if (!clap || !Array.isArray(clap?.segments)) {
      console.log(`useTimeline: no clap to show`)
      return
    }
    
    (window as any).useTimeline = useTimeline

    set({ isLoading: true })

    console.log(`useTimeline: setting the clap to`, clap)

    // we remove the big/long video
    const segments = removeFinalVideos(clap)

    const {
      defaultCellHeight,
      cellWidth,
    } = get()

    // TODO: many of those checks about average duration, nb of tracks, collisions...
    // should be done by the Clap parser and/or serializer
    // send a demand to Julian (@flngr) to get it fixed!

    let idCollisionDetector = new Set<string>()

    let tracks: Tracks = []

    let defaultSegmentDurationInSteps = get().defaultSegmentDurationInSteps
 
    let totalDurationInMs = 0
  
    // TODO: this whole approach is a bit weak,
    // having an heuristic is okay but we should do it:
    // track by track
    // for each track, count length occurrences to keep the most recurring one
    // do something for images/videos that don't have the right ratio,
    // eg. add black banding
    for (const s of segments) {
      totalDurationInMs = s.endTimeInMs > totalDurationInMs ? s.endTimeInMs : totalDurationInMs

      if (s.category === ClapSegmentCategory.CAMERA) {
        const durationInSteps = (
          (s.endTimeInMs - s.startTimeInMs) / DEFAULT_DURATION_IN_MS_PER_STEP
        )
        // TODO: we should do this row by row
        // and look at the most recurring duration,
        // using a table
        defaultSegmentDurationInSteps = durationInSteps
        break
      }
    }

    const defaultSegmentLengthInPixels = cellWidth * defaultSegmentDurationInSteps

    // TODO: compute the exact image ratio instead of using the media orientation,
    // since it might not match the actual assets
    const defaultMediaRatio = clap ? (
      (clap.meta.width || 896) / (clap.meta.height || 512)
    ) : (896 / 512)
    
    // also storyboards and videos might have different sizes / ratios
    const defaultPreviewHeight = Math.round(
      defaultSegmentLengthInPixels / defaultMediaRatio
    )

    /*
    console.log("WTF:", JSON.parse(JSON.stringify({
      defaultSegmentDurationInSteps,
      cellWidth,
      defaultPreviewHeight,
      defaultCellHeight,
      "clap.meta.width": clap.meta.width,
      "(clap.meta.height": clap.meta.height,
      defaultSegmentLengthInPixels,
      defaultMediaRatio
    })))
    */
    
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
            ? defaultPreviewHeight
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
        defaultSegmentDurationInSteps = durationInSteps
      }
    }



    for (let id = 0; id < tracks.length; id++) {
      if (!tracks[id]) {
        tracks[id] = {
          id,
          name: `(empty)`,
          isPreview: false,
          height: defaultCellHeight,
          hue: 0,
          occupied: false, // <-- setting this to false is the important part
          visible: true,
        }
      }
    }

    const finalVideo = getFinalVideo(clap)
    
    const isEmpty = segments.length === 0

    set({
      clap,
      segments,
      loadedSegments: [],
      visibleSegments: [],
      segmentsChanged: 1,
      totalDurationInMs,

      isEmpty,
      isLoading: false,
      finalVideo,

      ...computeContentSizeMetrics({
        clap,
        tracks,
        cellWidth,
        defaultSegmentDurationInSteps,
      })
    })
  },
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => {
    const {
      minHorizontalZoomLevel,
      maxHorizontalZoomLevel,
      clap,
      tracks,
      defaultSegmentDurationInSteps,
      cellWidth: previousCellWidth
    } = get()
    const cellWidth = Math.min(maxHorizontalZoomLevel, Math.max(minHorizontalZoomLevel, newHorizontalZoomLevel))
    
    // nothing changed
    if (Math.round(cellWidth) === Math.round(previousCellWidth)) { return }

    const resizeStartedAt = performance.now()
    const isResizing = true

    set({
      resizeStartedAt,
      isResizing,
      ...computeContentSizeMetrics({
        clap,
        tracks,
        cellWidth,
        defaultSegmentDurationInSteps,
      })
    })
  },
  
  setSegments: (segments: ClapSegment[] = []) => {
    set({ segments, loadedSegments: [] })
  },
  setLoadedSegments: (loadedSegments: ClapSegment[] = []) => { set({ loadedSegments }) },
  setVisibleSegments: (visibleSegments: ClapSegment[] = []) => { set({ visibleSegments }) },

  getCellHeight: (trackNumber?: number): number => {
    const { defaultCellHeight, tracks } = get()
    const track = tracks[trackNumber!]
    return track?.height || defaultCellHeight
  },

  getVerticalCellPosition: (start: number, end: number): number => {
    const { defaultCellHeight, tracks } = get()
    let height = 0
    for (let i = start; i < end; i++) {
      const track = tracks[i!]
      height += track?.height || defaultCellHeight
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
    // TODO: compute the limits here, to avoid doing re-renderings for nothing
    set({
      scrollX: scrollX + deltaX,
      scrollY: scrollY - deltaY,
    })
  },
  toggleTrackVisibility: (trackId: number) => {
    const {
      clap,
      tracks,
      cellWidth,
      defaultSegmentDurationInSteps,
    } = get()

    set({
      ...computeContentSizeMetrics({
        clap,
        tracks: tracks.map(t => (
          t.id === trackId
          ? { ...t, visible: !t.visible }
          : t
        )),
        cellWidth,
        defaultSegmentDurationInSteps
      })
    })
  },
  setContainerSize: ({ width, height }: { width: number; height: number }) => {
    const { width: previousWidth, height: previousHeight } = get()
    const changed = 
      (Math.round(previousWidth) !== Math.round(height))
      || (Math.round(previousHeight) !== Math.round(height))
    if (!changed) { return }

    set({
      width,
      height,
      resizeStartedAt: performance.now(),
      isResizing: true,
      /*

      changing the *container* size has absolutely no impact on the content
      
      ...computeContentSizeMetrics({
        clap,
        tracks,
        cellWidth,
        defaultSegmentDurationInSteps
      })
       */
    })
  },
  setTimelineCursor: (timelineCursor?: TimelineCursorImpl) => {
    set({ timelineCursor })
  },
  setCursorTimestampAt: (cursorTimestampAt: number) => {
    set({ cursorTimestampAt })
  },

  // this function has an issue, it saves stuff as .txt, which is bad
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
  setImageRenderingStrategy: (imageRenderingStrategy: RenderingStrategy) => {
    set({
      imageRenderingStrategy: imageRenderingStrategy || RenderingStrategy.ON_DEMAND
    })
  },
  setVideoRenderingStrategy: (videoRenderingStrategy: RenderingStrategy) => {
    set({
      videoRenderingStrategy: videoRenderingStrategy || RenderingStrategy.ON_DEMAND
    })
  },
  setSoundRenderingStrategy: (soundRenderingStrategy: RenderingStrategy) => {
    set({
      soundRenderingStrategy: soundRenderingStrategy || RenderingStrategy.ON_DEMAND
    })
  },
  setVoiceRenderingStrategy: (voiceRenderingStrategy: RenderingStrategy) => {
    set({
      voiceRenderingStrategy: voiceRenderingStrategy || RenderingStrategy.ON_DEMAND
    })
  },
  setMusicRenderingStrategy: (musicRenderingStrategy: RenderingStrategy) => {
    set({
      musicRenderingStrategy: musicRenderingStrategy || RenderingStrategy.ON_DEMAND
    })
  },
  setSegmentRenderer: (segmentRenderer: SegmentRenderer) => {
    set({ segmentRenderer })
  },
  renderSegment: async (segment: ClapSegment): Promise<ClapSegment> => {
    const { segmentRenderer, clap, segments } = get()

    if (!segmentRenderer || !clap) {
      return segment
      // throw new Error(`please call setSegmentRender(...) first`)
    }
  
    const entities = clap.entityIndex || {}

    const speakingCharactersIds = segments.map(s =>
      s.category === ClapSegmentCategory.DIALOGUE ? s.entityId : null
    ).filter(id => id) as string[]

    const generalCharactersIds = segments.map(s =>
      s.category === ClapSegmentCategory.CHARACTER ? s.entityId : null
    ).filter(id => id) as string[]

    const mainCharacterId: string | undefined = speakingCharactersIds.at(0) || generalCharactersIds.at(0) || undefined

    const mainCharacterEntity: ClapEntity | undefined = mainCharacterId ? (entities[mainCharacterId] || undefined) : undefined

    const {
      id,
      assetUrl,
      assetDurationInMs,
      assetFileFormat,
      assetSourceType,
      status
    } = await segmentRenderer({
      segment,
    
      // the slice to use for rendering
      segments: filterSegments(ClapSegmentFilteringMode.ANY, segment, segments),

      entities,
      
      speakingCharactersIds,
      generalCharactersIds,
      mainCharacterId,
      mainCharacterEntity,
      meta: clap.meta
    })

    // note: this actually modifies the old object in-place
    const newSegment = Object.assign(segment, {
      id,
      assetUrl,
      assetDurationInMs,
      assetFileFormat,
      assetSourceType,
      status
    })

    return newSegment
  },
  findStuffToRender: async () => {
    // note: this run independently for the manual re-render,
    // which the user can always do
    const {
      imageRenderingStrategy,
      videoRenderingStrategy,
      soundRenderingStrategy,
      voiceRenderingStrategy,
      musicRenderingStrategy,
      segments,
      loadedSegments,
    } = get()

    if (imageRenderingStrategy === RenderingStrategy.ON_DEMAND) {
      // for now this has its own workflow, managed elsewhere
    } else if (imageRenderingStrategy === RenderingStrategy.ON_SCREEN_ONLY) {

    } else if (imageRenderingStrategy === RenderingStrategy.ON_SCREEN_THEN_SURROUNDING) {
      
    } else if (imageRenderingStrategy === RenderingStrategy.ON_SCREEN_THEN_ALL) {
          
    } else {
      // do nothing
    }
  },
  findFreeTrack: ({
    startTimeInMs,
    endTimeInMs
  }: {
    startTimeInMs?: number
    endTimeInMs?: number
  }): number => {
    const { segments } = get()
    return findFreeTrack({ segments, startTimeInMs, endTimeInMs })
  }
}))
