import { create } from "zustand"
import * as THREE from "three"
import { ClapEntity, ClapProject, ClapSegment, ClapSegmentCategory, newClap, serializeClap } from "@aitube/clap"

import { TimelineStore, Tracks } from "@/types/timeline"
import { getDefaultProjectState, getDefaultState } from "@/utils/getDefaultState"
import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants"
import { removeFinalVideos } from "@/utils/removeFinalVideos"
import { hslToHex } from "@/utils/hslToHex"
import { ClapSegmentCategoryHues, ClapSegmentColorScheme, SegmentResolver } from "@/types"
import { TimelineControlsImpl } from "@/components/controls/types"
import { TimelineCameraImpl } from "@/components/camera/types"
import { getFinalVideo } from "@/utils/getFinalVideo"
import { IsPlaying, JumpAt, TimelineCursorImpl, TogglePlayback } from "@/components/timeline/types"
import { computeContentSizeMetrics } from "@/compute/computeContentSizeMetrics"
import { findFreeTrack } from "@/utils/findFreeTrack"

export const useTimeline = create<TimelineStore>((set, get) => ({
  ...getDefaultState(),


  clear: () => {
    // this re-initialize everything that is related to the current .clap project
    set({
      ...getDefaultProjectState()
    })
  },

  setClap: async (clap?: ClapProject) => {
    const { clear } = get()

    clear()

    if (!clap || !Array.isArray(clap?.segments)) {
      console.log(`useTimeline: no clap to show`)
      return
    }
    
    (window as any).useTimeline = useTimeline

    set({ isLoading: true })

    // console.log(`useTimeline: setting the clap to`, clap)

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
 
    // let's trust developers for respecting this
    let totalDurationInMs = Math.max(0, clap.meta.durationInMs || 0)

    // TODO: this whole approach is a bit weak,
    // having an heuristic is okay but we should do it:
    // track by track
    // for each track, count length occurrences to keep the most recurring one
    // do something for images/videos that don't have the right ratio,
    // eg. add black banding
    for (const s of segments) {

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

    for (const s of segments) {
      
      // TODO: move this idCollision detector into the state,
      // so that we can use it later?
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

    clap.meta.durationInMs = totalDurationInMs

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
        totalDurationInMs,
      })
    })

    // one more thing: we need to call this,
    // as this will trigger various stuff in the parent
    get().jumpAt(0)
  },
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => {
    const {
      minHorizontalZoomLevel,
      maxHorizontalZoomLevel,
      clap,
      tracks,
      defaultSegmentDurationInSteps,
      cellWidth: previousCellWidth,
      totalDurationInMs,
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
        totalDurationInMs,
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
  trackSilentChangeInSegment: (segmentId: string) => {
    const { silentChangesInSegments, silentChangesInSegment } = get()
    set({
      silentChangesInSegments: 1 + silentChangesInSegments,
      silentChangesInSegment: Object.assign(silentChangesInSegment, {
        [segmentId]: 1 + (silentChangesInSegment[segmentId] || 0)
      })
    })
  },
  setTimelineCamera: (timelineCamera?: TimelineCameraImpl) => {
    set({ timelineCamera })
  },
  setTimelineControls: (timelineControls?: TimelineControlsImpl) => {
    set({ timelineControls })
  },
  setTopBarTimeScale: (topBarTimeScale?: THREE.Group<THREE.Object3DEventMap>) => {
    set({ topBarTimeScale })
  },
  setLeftBarTrackScale: (leftBarTrackScale?: THREE.Group<THREE.Object3DEventMap>) => {
    set({ leftBarTrackScale })
  },
  // used when we move the full-length scroller
  setScrollX: (scrollX: number) => {
    set({ scrollX })
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
      totalDurationInMs,
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
        defaultSegmentDurationInSteps,
        totalDurationInMs,
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
  setIsDraggingCursor: (isDraggingCursor: boolean) => {
    set({ isDraggingCursor })
  },
  setCursorTimestampAtInMs: (cursorTimestampAtInMs: number = 0) => {
    if (cursorTimestampAtInMs !== get().cursorTimestampAtInMs) {
      set({ cursorTimestampAtInMs })
    }
  },
  setJumpAt: (jumpAt: JumpAt) => {
    set({ jumpAt })
  },
  setIsPlaying: (isPlaying: IsPlaying) => {
    set({ isPlaying })
  },
  setTogglePlayback: (togglePlayback: TogglePlayback) => {
    set({ togglePlayback })
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
  setSegmentResolver: (segmentResolver: SegmentResolver) => {
    set({ segmentResolver })
  },
  resolveSegment: async (segment: ClapSegment): Promise<ClapSegment> => {
    const { segmentResolver } = get()
    if (!segmentResolver) { return segment }
    return segmentResolver(segment)
  },
  addSegments: async ({
    segments = [],
    startTimeInMs,
    track
  }: {
    segments?: ClapSegment[]
    startTimeInMs?: number
    track?: number
  }): Promise<void> => {
    if (segments?.length) {
      const { addSegment } = get()
      Promise.allSettled(segments.map(segment => addSegment({
        segment,
        startTimeInMs,
        track,
      })))
    }
  },
  addSegment: async ({
    segment,
    startTimeInMs,
    track: requestedTrack
  }: {
    segment: ClapSegment
    startTimeInMs?: number
    track?: number
  }): Promise<void> => {
    // adding a segment is a bit complicated, lot of stuff might have to be updated
    const {
      clap,
      findFreeTrack,
      cellWidth,
      tracks,
      segments: previousSegments,
      segmentsChanged: previousSegmentsChanged,
      totalDurationInMs: previousTotalDurationInMs,
      defaultSegmentDurationInSteps,
      defaultPreviewHeight,
      defaultCellHeight,
    } = get()

    // note: the requestedTrack might not be empty

    // for now let's do something simple: to always search for an available track
    const availableTrack = findFreeTrack({ startTimeInMs })

    segment.track = availableTrack

    // add the track if it is missing
    if (!tracks[segment.track]) {
      const isPreview =
        segment.category === ClapSegmentCategory.STORYBOARD ||
        segment.category === ClapSegmentCategory.VIDEO

      tracks[segment.track] = {
        id: segment.track,
        // name: `Track ${s.track}`,
        name: `${segment.category}`,
        isPreview,
        height:
          isPreview
          ? defaultPreviewHeight
          : defaultCellHeight,
        hue: 0,
        occupied: true,
        visible: true,
      }
    }

    // we assume that the provided segment is valid, with a unique UUID
  
    // then we need to update everything

    const segments = previousSegments.concat(segment)

    const segmentsChanged = previousSegmentsChanged + 1

    const totalDurationInMs =
      segment.endTimeInMs > previousTotalDurationInMs
      ? segment.endTimeInMs
      : previousTotalDurationInMs

    clap.meta.durationInMs = totalDurationInMs
    clap.segments = segments

    set({
      clap,
      segments,
      segmentsChanged,
      totalDurationInMs,
      ...computeContentSizeMetrics({
        clap,
        tracks,
        cellWidth,
        defaultSegmentDurationInSteps,
        totalDurationInMs,
      })
    })
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
  },
}))
