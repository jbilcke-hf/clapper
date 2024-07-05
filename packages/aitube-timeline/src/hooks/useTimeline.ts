import { create } from "zustand"
import * as THREE from "three"
import { ClapOutputType, ClapProject, ClapSceneEvent, ClapSegment, ClapSegmentCategory, ClapSegmentFilteringMode, filterSegments, isValidNumber, newClap, serializeClap, ClapTrack, ClapTracks } from "@aitube/clap"

import { RuntimeSegment, TimelineStore } from "@/types/timeline"
import { getDefaultProjectState, getDefaultState } from "@/utils/getDefaultState"
import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants"
import { removeFinalVideos } from "@/utils/removeFinalVideos"
import { hslToHex } from "@/utils/hslToHex"
import { ClapSegmentCategoryHues, ClapSegmentColorScheme, ClapTimelineTheme, SegmentResolver } from "@/types"
import { TimelineControlsImpl } from "@/components/controls/types"
import { TimelineCameraImpl } from "@/components/camera/types"
import { getFinalVideo } from "@/utils/getFinalVideo"
import { IsPlaying, JumpAt, TimelineCursorImpl, TogglePlayback } from "@/components/timeline/types"
import { computeContentSizeMetrics } from "@/compute/computeContentSizeMetrics"
import { findFreeTrack } from "@/utils/findFreeTrack"
import { getAudioBuffer } from "@/utils"
import { assign } from "three/examples/jsm/nodes/Nodes.js"

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

    // we remove the big/long video
    const segments = removeFinalVideos(clap) as RuntimeSegment[]

    const {
      defaultCellHeight,
      cellWidth,
    } = get()

    // TODO: many of those checks about average duration, nb of tracks, collisions...
    // should be done by the Clap parser and/or serializer
    // send a demand to Julian (@flngr) to get it fixed!

    let idCollisionDetector = new Set<string>()

    let tracks: ClapTracks = []

    let defaultSegmentDurationInSteps = get().defaultSegmentDurationInSteps
 
  
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

    const lineNumberToMentionedSegments: Record<number, ClapSegment[]> = {}

    for (const segment of segments) {
      
      // TODO: move this idCollision detector into the state,
      // so that we can use it later?
      if (idCollisionDetector.has(segment.id)) {
        console.log(`collision detected! there is already a segment with id ${segment.id}`)
        continue
      }

      const isSegmentDirectlyMentionedInTheScript = segment.category === ClapSegmentCategory.DIALOGUE || segment.category === ClapSegmentCategory.ACTION
      
      if (isSegmentDirectlyMentionedInTheScript) {
        for (let i = segment.startTimeInLines; i <= segment.endTimeInLines; i++) {
          // we only add the segment if it is not already in the map
          let existingArray: ClapSegment[] = lineNumberToMentionedSegments[i] || []
          if (!existingArray.find(s => s.id === segment.id)) {
            existingArray.push(segment)
          }
          lineNumberToMentionedSegments[i] = existingArray
        }
      }

      idCollisionDetector.add(segment.id)

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
      } else {
        
        const track = tracks[segment.track]
        const categories: string[] = track.name.split(",").map((x: string) => x.trim())
        if (!categories.includes(segment.category)) {
          tracks[segment.track].name = "(misc)"

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

      if (segment.outputType === ClapOutputType.AUDIO) {
        const rs = segment as RuntimeSegment
        if (rs.outputType === ClapOutputType.AUDIO) {
          try {
            rs.audioBuffer = await getAudioBuffer(rs.assetUrl)
          } catch (err) {
            console.error(`failed to load the audio file: ${err}`)
          }
        }
      }
    }


   // ---------- REPAIR THE TRACKS ---------------
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
    
    let totalDurationInMs = clap.meta.durationInMs
    let totalNumberOfLines = clap.meta.screenplay.split('\n').length

    console.log("totalNumberOfLines = " + totalNumberOfLines)

    const isEmpty = segments.length === 0

    // ---------- REPAIR THE LINE-2-SEGMENT DICTIONARY ---------------
    let previousValue: ClapSegment[] = []
    // we aren't finished yet: the lineNumberToMentionedSegments will be missing some entries
    for (let i = 1; i <= totalNumberOfLines; i++) {
      if (!Array.isArray(lineNumberToMentionedSegments[i])) {
        lineNumberToMentionedSegments[i] = previousValue
      } else {
        previousValue = lineNumberToMentionedSegments[i]
      }
    }

    set({
      clap,
      segments,
      loadedSegments: [],
      visibleSegments: [],
      segmentsChanged: 1,
      totalDurationInMs,
      lineNumberToMentionedSegments,

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

      waveformLineSpacing: theme.cell.waveform.lineSpacing,
      waveformGradientStart: theme.cell.waveform.gradientStart,
      waveformGradientEnd: theme.cell.waveform.gradientEnd,
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

      waveformLineSpacing: theme.cell.waveform.lineSpacing,
      waveformGradientStart: theme.cell.waveform.gradientStart,
      waveformGradientEnd: theme.cell.waveform.gradientEnd,
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
  setTimelineTheme: (theme: ClapTimelineTheme) => {
    set({ theme })
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
    const { segmentResolver, fitSegmentToAssetDuration } = get()
    if (!segmentResolver) { return segment }
    
    segment = await segmentResolver(segment)

    // after a segment has ben resolved, it is possible that the size
    // of its asset changed (eg. a dialogue line longer than the segment's length)
    //
    // there are multiple ways to solve this, one approach could be to 
    // just add some more B-roll (more shots)
    //
    // or we can also extend it, which is the current simple solution
    //
    // for the other categories, such as MUSIC or SOUND,
    // we assume it is okay if they are too short or too long,
    // and that we can crop them etc
    //
    // note that video clips are also concerned: we want them to perfectly fit
    if (segment.category === ClapSegmentCategory.DIALOGUE) {
      await fitSegmentToAssetDuration(segment)
    } else if (segment.category === ClapSegmentCategory.VIDEO) {
      await fitSegmentToAssetDuration(segment)
    }

    return segment
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
  assignTrack: async ({
    segment,
    track,
    triggerChange,
  }: {
    segment: ClapSegment
    track: number
    triggerChange?: boolean
  }): Promise<void> => {
    const {
      clap,
      cellWidth,
      defaultSegmentDurationInSteps,
      totalDurationInMs,
      tracks,
      defaultPreviewHeight,
      defaultCellHeight,
      segmentsChanged: previousSegmentsChanged,
    } = get()

    segment.track = track
   
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

    if (triggerChange) {
      set({
        segmentsChanged: previousSegmentsChanged + 1,
        ...computeContentSizeMetrics({
          clap,
          tracks,
          cellWidth,
          defaultSegmentDurationInSteps,
          totalDurationInMs,
        }),
      })
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
      assignTrack,
    } = get()

    // note: the requestedTrack might not be empty

    // for now let's do something simple: to always search for an available track
    const availableTrack = findFreeTrack({ startTimeInMs })

    assignTrack({
      segment,
      track: availableTrack,

      // we don't want to trigger a state change just yet
      triggerChange: false,
    })


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

  // resize and move the end of a segmrnt, as well as the segment after it
  fitSegmentToAssetDuration: async (segment: ClapSegment, requestedDurationInMs?: number): Promise<void> => {
    
    const {
      clap,
      tracks,
      cellWidth,
      defaultSegmentDurationInSteps,
      segments,
      segmentsChanged,
      totalDurationInMs: previousTotalDurationInMs,
      findFreeTrack,
      assignTrack
    } = get()

    const durationInMs: number =
      typeof requestedDurationInMs === "number" && isFinite(requestedDurationInMs) && !isNaN(requestedDurationInMs)
      ? requestedDurationInMs
      : segment.assetDurationInMs


    // trivial case: nothing to do!
    const segmentDurationInMs = segment.endTimeInMs - segment.startTimeInMs
    if (
      durationInMs === 0
      ||
      segmentDurationInMs === durationInMs
    ) {
      return
    }

    // let's set some limits eg. at least 1 sec, I think this is reasonable
    const minimumLengthInSteps = 2
    const minimumLengthInMs = minimumLengthInSteps * DEFAULT_DURATION_IN_MS_PER_STEP

    // positive if new duration is longer,
    // negative if shorter
    const timeDifferenceInMs = durationInMs - segmentDurationInMs

    // setup some limits
    const newSegmentDurationInMs = Math.max(
      minimumLengthInMs,
      segmentDurationInMs + timeDifferenceInMs
    )

    // ok, well, there is nothing to change actually
    if (segmentDurationInMs === newSegmentDurationInMs) { return }


    // positive if new duration is longer,
    // negative if shorter
    const newTimeDifferenceInMs = newSegmentDurationInMs - segmentDurationInMs

    const startTimeInMs = segment.startTimeInMs
    const endTimeInMs = segment.endTimeInMs
    // const newEndTimeInMs = endTimeInMs + newTimeDifferenceInMs

    let totalDurationInMs = previousTotalDurationInMs

    const referenceSegmentIsMusicOrSound =
      segment.category === ClapSegmentCategory.MUSIC
      || segment.category === ClapSegmentCategory.SOUND

    let segmentsToDelete: string[] = []

    for (const s of segments) {
      // our strategy will be different depending on the type of segment
      // basically, if it's a sound or a music, we don't need to cut the segment,
      // and we don't have to extend the current shot.
      // instead, we can let it go outerbound, although this creates 2 problems:
      // 1. overlapping with another music/sound (on the same track or not)
      //    -> fix is easy, we can resize or delete completely the other one
      // 2. collision with an item on the same track (eg. of a different type)
      //    -> fix is annoying, for now the a quick solution is to put the segment
      //      onto its own free track
      const currentSegmentIsMusicOrSound =
        s.category === ClapSegmentCategory.MUSIC
        || s.category === ClapSegmentCategory.SOUND

      const isSameCategoryAsReferenceSegment = s.category === segment.category

      const isSamePromptAsReferenceSegment = s.prompt === segment.prompt


      if (referenceSegmentIsMusicOrSound) {
        
        if (isSameCategoryAsReferenceSegment && isSamePromptAsReferenceSegment) {
          if (s.endTimeInMs <= endTimeInMs) { 
            // we delete
            console.log("TODO JULIAN: DELETE SEGMENT", s)
            // segmentsToDelete.push(s.id)
            // note: 
          } else if (s.startTimeInMs < endTimeInMs) { 
            // we resize
            s.startTimeInMs = endTimeInMs
          }
        }
        // independently, we run our collision detector
        // it is important at this stage to take into account any change,
        // eg. if we've already deleted segment `s` there is no need to
        // assign a new free track
        const isSameTrackAsReferenceSegment = s.track === segment.track

        if (isSameTrackAsReferenceSegment) {
          // if we have a collision, there is currently no way around it we need to create a new track
          if (!(s.endTimeInMs <= startTimeInMs || s.startTimeInMs >= endTimeInMs)) {
            const newTrack = findFreeTrack({ startTimeInMs, endTimeInMs })
            // console.log(`NEW TRACK (${newTrack}) FOR SEGMENT`, s)
     
            assignTrack({
              segment,
              track: newTrack,

              // we don't want to trigger a state change
              triggerChange: false,
            })
            
          }
      
        }
      } else {
        // this is a dialogue or a video, we can apply our regular strategy
        if (endTimeInMs <= s.startTimeInMs) {
          s.startTimeInMs += newTimeDifferenceInMs
        }
        if (endTimeInMs <= s.endTimeInMs) {
          s.endTimeInMs += newTimeDifferenceInMs
        }

        // also need to update the total duration
        if (s.endTimeInMs > totalDurationInMs) {
          totalDurationInMs = s.endTimeInMs
        }
      }
    }
    console.log(`TODO Julian: stretched segments (overlapping segments) should be re-generated`)

    set({
      segments,
      segmentsChanged: segmentsChanged + 1,
      ...computeContentSizeMetrics({
        clap,
        tracks,
        cellWidth,
        defaultSegmentDurationInSteps,
        totalDurationInMs,
      })
    })
  }
}
))
