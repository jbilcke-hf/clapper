import { create } from "zustand"
import * as THREE from "three"
import { ClapProject, ClapSegment, ClapSegmentCategory, isValidNumber, newClap, serializeClap, ClapTracks, ClapEntity } from "@aitube/clap"

import { TimelineSegment, SegmentEditionStatus, SegmentVisibility, TimelineStore, SegmentArea } from "@/types/timeline"
import { getDefaultProjectState, getDefaultState } from "@/utils/getDefaultState"
import { DEFAULT_NB_TRACKS } from "@/constants"
import { hslToHex, findFreeTrack, removeFinalVideosAndConvertToTimelineSegments, clapSegmentToTimelineSegment, timelineSegmentToClapSegment } from "@/utils"
import { ClapSegmentCategoryColors, ClapSegmentColorScheme, ClapTimelineTheme, SegmentResolver } from "@/types"
import { TimelineControlsImpl } from "@/components/controls/types"
import { TimelineCameraImpl } from "@/components/camera/types"
import { IsPlaying, JumpAt, TimelineCursorImpl, TogglePlayback } from "@/components/timeline/types"
import { computeContentSizeMetrics } from "@/compute/computeContentSizeMetrics"

export const useTimeline = create<TimelineStore>((set, get) => ({
  ...getDefaultState(),

  setCanvas: (canvas?: HTMLCanvasElement) => {
    set({ canvas })
  },

  clear: () => {
    // this re-initialize everything that is related to the current .clap project
    set({
      ...getDefaultProjectState()
    })
  },

  setClap: async (clap?: ClapProject) => {
    const { clear } = get()

    clear()

    if (!clap) {
      console.log(`useTimeline: no clap to show`)
      return
    }
    
    set({ isLoading: true })

    // actually you know what.. let's drop the concept of final video for the moment
    // in Clapper and the timeline
    // const finalVideo = await getFinalVideo(clap)
    const finalVideo = undefined
    
    // we remove the big/long video
    const segments = await removeFinalVideosAndConvertToTimelineSegments(clap)

    const {
      defaultCellHeight,
      durationInMsPerStep,
      cellWidth,
    } = get()

    const meta = clap.meta

    // TODO: many of those checks about average duration, nb of tracks, collisions...
    // should be done by the Clap parser and/or serializer
    // send a demand to Julian (@flngr) to get it fixed!

    let idCollisionDetector = new Set<string>()

    let tracks: ClapTracks = []

    let defaultSegmentDurationInSteps = get().defaultSegmentDurationInSteps
 
  
    for (const s of segments) {
      if (s.category === ClapSegmentCategory.CAMERA) {
        const durationInSteps = (
          (s.endTimeInMs - s.startTimeInMs) / durationInMsPerStep
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

    const lineNumberToMentionedSegments: Record<number, TimelineSegment[]> = {}

    for (const segment of segments) {
      
      // TODO: move this idCollision detector into the state,
      // so that we can use it later?
      if (idCollisionDetector.has(segment.id)) {
        console.log(`collision detected! there is already a segment with id ${segment.id}`)
        continue
      }

      // --------
      const isSegmentDirectlyMentionedInTheScript = segment.category === ClapSegmentCategory.DIALOGUE || segment.category === ClapSegmentCategory.ACTION
      
      if (isSegmentDirectlyMentionedInTheScript) {
        for (let i = segment.startTimeInLines; i <= segment.endTimeInLines; i++) {
          // we only add the segment if it is not already in the map
          let existingArray: TimelineSegment[] = lineNumberToMentionedSegments[i] || []
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

    }

   // ---------- FILL-IN THE TRACKS ---------------
    for (let id = 0; id < DEFAULT_NB_TRACKS; id++) {
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

    let totalDurationInMs = clap.meta.durationInMs
    let totalNumberOfLines = clap.meta.screenplay.split('\n').length

    // console.log("totalNumberOfLines = " + totalNumberOfLines)

    // ---------- REPAIR THE LINE-2-SEGMENT DICTIONARY ---------------
    let previousValue: TimelineSegment[] = []
    // we aren't finished yet: the lineNumberToMentionedSegments will be missing some entries
    for (let i = 1; i <= totalNumberOfLines; i++) {
      if (!Array.isArray(lineNumberToMentionedSegments[i])) {
        lineNumberToMentionedSegments[i] = previousValue
      } else {
        previousValue = lineNumberToMentionedSegments[i]
      }
    }

    set({
      meta,
      scenes: clap.scenes,
      segments,
      entities: clap.entities,
      entityIndex: clap.entityIndex,
      entitiesChanged: 0,
      loadedSegments: [],
      visibleSegments: [],
      atLeastOneSegmentChanged: 1,
      allSegmentsChanged: 1,
      totalDurationInMs,
      lineNumberToMentionedSegments,

      isLoading: false,
      finalVideo,

      ...computeContentSizeMetrics({
        meta,
        tracks,
        cellWidth,
        defaultSegmentDurationInSteps,
        durationInMsPerStep,
        totalDurationInMs,
      })
    })

    // one more thing: we need to call this,
    // as this will trigger various stuff in the parent
    get().jumpAt(0)
  },
  getClap: async (): Promise<ClapProject> => {
    const { meta, entities, scenes, segments } = get()

    const clap = newClap({
      meta: { ...meta },
      entities: [...entities],
      scenes: [...scenes],
      segments: segments.map(ts => timelineSegmentToClapSegment(ts))
    })

    return clap
  },
  setHorizontalZoomLevel: (newHorizontalZoomLevel: number) => {
    const {
      minHorizontalZoomLevel,
      maxHorizontalZoomLevel,
      meta,
      tracks,
      defaultSegmentDurationInSteps,
      durationInMsPerStep,
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
        meta,
        tracks,
        cellWidth,
        defaultSegmentDurationInSteps,
        durationInMsPerStep,
        totalDurationInMs,
      })
    })
  },
  
  setSegments: (segments: TimelineSegment[] = []) => {
    set({ segments, loadedSegments: [] })
  },
  setLoadedSegments: (loadedSegments: TimelineSegment[] = []) => { set({ loadedSegments }) },
  setVisibleSegments: (visibleSegments: TimelineSegment[] = []) => { set({ visibleSegments }) },

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

  getSegmentColorScheme: (segment: TimelineSegment): ClapSegmentColorScheme => {

    const { theme } = get()

    let baseHue = 0

    let baseSaturation = theme.cell.categoryColors.GENERIC.saturation
    let baseLightness = theme.cell.categoryColors.GENERIC.lightness
    
    let backgroundColorSaturation = (segment.isSelected ? 2.2 : 1.4) * baseSaturation
    let backgroundColorHoverSaturation = (segment.isSelected ? 2.2 : 1.8) * baseSaturation

    let colorScheme: ClapSegmentColorScheme = {
      baseHue,
      baseSaturation,
      baseLightness,
      
      backgroundColor: hslToHex(baseHue, backgroundColorSaturation, baseLightness),
      backgroundColorHover: hslToHex(baseHue, backgroundColorHoverSaturation, baseLightness + 1),
      backgroundColorDisabled: hslToHex(baseHue, baseSaturation - 15, baseLightness - 2),
      foregroundColor: hslToHex(baseHue, baseSaturation + 40, baseLightness),
      borderColor: hslToHex(baseHue, baseSaturation + 40, baseLightness + 10),
      textColor: hslToHex(baseHue, baseSaturation + 55, baseLightness - 60),
      textColorHover: hslToHex(baseHue, baseSaturation + 55, baseLightness - 50),

      waveformLineSpacing: theme.cell.waveform.lineSpacing,
      waveformGradientStart: theme.cell.waveform.gradientStart,
      waveformGradientEnd: theme.cell.waveform.gradientEnd,
    }

    if (!segment) { return colorScheme }

    const clapSegmentCategoryColors: ClapSegmentCategoryColors = theme.cell.categoryColors

    const candidateHSL = clapSegmentCategoryColors[segment.category]
    if (!candidateHSL) { return colorScheme }

    baseHue = candidateHSL.hue
    baseSaturation = candidateHSL.saturation
    baseLightness = candidateHSL.lightness

    colorScheme = {
      baseHue,
      baseSaturation,
      baseLightness,
    
      backgroundColor: hslToHex(baseHue, backgroundColorSaturation, baseLightness),
      backgroundColorHover: hslToHex(baseHue, backgroundColorHoverSaturation, baseLightness + 1),
      backgroundColorDisabled: hslToHex(baseHue, baseSaturation - 15, baseLightness - 2),
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
  setHoveredSegment: ({
    hoveredSegment,
    area,
  }: {
    hoveredSegment?: TimelineSegment
    area?: SegmentArea 
  } = {}) => {
    const {
      hoveredSegment: previousHoveredSegment,
      atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged,
      allSegmentsChanged: previousAllSegmentsChanged,
    } = get()

    // note: we do all of this in order to avoid useless state updates
    if (hoveredSegment) {
      if (previousHoveredSegment) {
        if (previousHoveredSegment.id === hoveredSegment.id) {
          // nothing to do
          return
        } else {
          previousHoveredSegment.isHovered = false
          hoveredSegment.isHoveredOnLeftHandle = false
          hoveredSegment.isHoveredOnRightHandle = false
          hoveredSegment.isHoveredOnBody = false
        }
      } else {
        hoveredSegment.isHovered = true
        hoveredSegment.isHoveredOnLeftHandle = area === SegmentArea.LEFT
        hoveredSegment.isHoveredOnRightHandle = area === SegmentArea.RIGHT
        hoveredSegment.isHoveredOnBody = area === SegmentArea.MIDDLE
        set({
          hoveredSegment,
          allSegmentsChanged: 1 + previousAllSegmentsChanged,
          atLeastOneSegmentChanged: 1 + previousAtLeastOneSegmentChanged
        })
      }
    } else {
      if (previousHoveredSegment) {
        previousHoveredSegment.isHovered = false
        previousHoveredSegment.isHoveredOnLeftHandle = false
        previousHoveredSegment.isHoveredOnRightHandle = false
        previousHoveredSegment.isHoveredOnBody = false
        set({
          hoveredSegment: undefined,
          allSegmentsChanged: 1 + previousAllSegmentsChanged,
          atLeastOneSegmentChanged: 1 + previousAtLeastOneSegmentChanged
        })
      } else {
        // nothing to do
      }
    }
  },
  setEditedSegment: (editedSegment?: TimelineSegment) => {
    const {
      editedSegment: previousEditedSegment,
      allSegmentsChanged: previousAllSegmentsChanged,
      atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged
    } = get()

    // note: we do all of this in order to avoid useless state updates
    if (editedSegment) {
      if (previousEditedSegment) {
        if (previousEditedSegment.id === editedSegment.id) {
          // nothing to do
          return
        } else {
          previousEditedSegment.editionStatus = SegmentEditionStatus.EDITABLE
        }
      } else {
        editedSegment.editionStatus = SegmentEditionStatus.EDITING
        set({
          editedSegment,
          atLeastOneSegmentChanged: 1 + previousAtLeastOneSegmentChanged,
          allSegmentsChanged: 1 + previousAllSegmentsChanged
        })
      }
    } else {
      if (previousEditedSegment) {
        previousEditedSegment.editionStatus = SegmentEditionStatus.EDITABLE
        set({
          editedSegment: undefined,
          atLeastOneSegmentChanged: 1 + previousAtLeastOneSegmentChanged,
          allSegmentsChanged: 1 + previousAllSegmentsChanged
        })
      } else {
        // nothing to do
      }
    }
  },
  setSelectedSegment: ({
    segment,
    isSelected,
    onlyOneSelectedAtOnce,
  }: {
    segment?: TimelineSegment
    isSelected?: boolean
    onlyOneSelectedAtOnce?: boolean
  } = {
  }) => {
    const {
      segments,
      selectedSegments: previousSelectedSegments,
      atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged,
      allSegmentsChanged: previousAllSegmentsChanged
    } = get()
    /*
    console.log(`setSelectedSegment() called with:`, {
      segment,
    isSelected,
    onlyOneSelectedAtOnce,
    })
    */

    let newValue = typeof isSelected !== "boolean"
      ? (typeof segment?.isSelected === "boolean" ? (!segment.isSelected) : false)
      : isSelected

    // console.log('`setSelectedSegment(): new value:', newValue)

    // note: we do all of this in order to avoid useless state updates
    if (segment) {

      if (segment.isSelected === newValue) {

        // console.log('`setSelectedSegment(): nothing to do')
    
        // nothing to do
        return
      }

      let newSelectedSegments: TimelineSegment[] = previousSelectedSegments

      // if needed we clear any other selected item
      if (onlyOneSelectedAtOnce) {

        // console.log('`setSelectedSegment(): unselecting all previous segments')
    
        segments.forEach(s => {
          s.isSelected = false
        })
        newSelectedSegments = []
      }

      // console.log('`setSelectedSegment(): assigning new value and propagating changes:', newValue)
    
      segment.isSelected = newValue

      if (newValue) {
        newSelectedSegments = newSelectedSegments.concat(segment)
      } else {
        newSelectedSegments = newSelectedSegments.filter(s => s.id !== segment.id)
      }
      set({
        selectedSegments: newSelectedSegments,
        atLeastOneSegmentChanged: 1 + previousAtLeastOneSegmentChanged,
        allSegmentsChanged: 1 + previousAllSegmentsChanged,
      })

    } else {

      // console.log('`setSelectedSegment(): mass change requested')
    
      segments.forEach(s => {
        s.isSelected = newValue
      })
      set({
        selectedSegments: isSelected ? segments : [],
        atLeastOneSegmentChanged: 1 + previousAtLeastOneSegmentChanged,
        allSegmentsChanged: 1 + previousAllSegmentsChanged,
      })
    }
  },
  trackSilentChangeInSegment: (segmentId: string) => {
    const { silentChangesInSegment, atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged } = get()
    set({
      silentChangesInSegment: Object.assign(silentChangesInSegment, {
        [segmentId]: 1 + (silentChangesInSegment[segmentId] || 0)
      }),
      atLeastOneSegmentChanged: 1 + previousAtLeastOneSegmentChanged,
    })
  },
  trackSilentChangeInSegments: (segmentIds: string[]) => {
    const { silentChangesInSegment, atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged } = get()
    
    for (const id of segmentIds) {
      silentChangesInSegment[id] = 1 + (silentChangesInSegment[id] || 0)
    }
    set({
      silentChangesInSegment,
      atLeastOneSegmentChanged: 1 + previousAtLeastOneSegmentChanged,
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
      meta,
      tracks,
      cellWidth,
      defaultSegmentDurationInSteps,
      durationInMsPerStep,
      totalDurationInMs,
    } = get()

    set({
      ...computeContentSizeMetrics({
        meta,
        tracks: tracks.map((t: any) => (
          t.id === trackId
          ? { ...t, visible: !t.visible }
          : t
        )),
        cellWidth,
        defaultSegmentDurationInSteps,
        durationInMsPerStep,
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
    const { getClap } = get()

    const clap = await getClap()

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
  resolveSegment: async (segment: TimelineSegment): Promise<TimelineSegment> => {
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
    segments?: TimelineSegment[]
    startTimeInMs?: number
    track?: number
  }): Promise<void> => {
    if (segments?.length) {
      const { addSegment } = get()
      for (const segment of segments) {
        await addSegment({
          segment,
          startTimeInMs,
          track
        })
      }
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
      meta,
      cellWidth,
      defaultSegmentDurationInSteps,
      durationInMsPerStep,
      totalDurationInMs,
      tracks,
      defaultPreviewHeight,
      defaultCellHeight,
      atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged,
      allSegmentsChanged: previousAllSegmentsChanged,
    } = get()

    segment.track = track
   
    let nbTracks = tracks.length

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
        allSegmentsChanged: previousAllSegmentsChanged + 1,
        atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged + 1,
        ...computeContentSizeMetrics({
          meta,
          tracks,
          cellWidth,
          defaultSegmentDurationInSteps,
          durationInMsPerStep,
          totalDurationInMs,
        }),
      })
    }
  },
  addSegment: async ({
    segment,
    startTimeInMs: requestedStartTimeInMs,
    track: requestedTrack
  }: {
    segment: TimelineSegment
    startTimeInMs?: number
    track?: number
  }): Promise<void> => {
    // adding a segment is a bit complicated, lot of stuff might have to be updated
    const {
      meta,
      findFreeTrack,
      cellWidth,
      tracks,
      segments: previousSegments,
      allSegmentsChanged: previousAllSegmentsChanged,
      atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged,
      totalDurationInMs: previousTotalDurationInMs,
      defaultSegmentDurationInSteps,
      durationInMsPerStep,
      defaultPreviewHeight,
      defaultCellHeight,
      assignTrack,
    } = get()


    // note: the requestedTrack might not be empty
    const segmentDuration = segment.endTimeInMs - segment.startTimeInMs

    const startTimeInMs = isValidNumber(requestedStartTimeInMs) ? requestedStartTimeInMs! : segment.startTimeInMs

    const endTimeInMs = startTimeInMs + segmentDuration

    // for now let's do something simple: to always search for an available track
    const availableTrack = isValidNumber(requestedTrack) ? requestedTrack! : findFreeTrack({
      startTimeInMs,
      endTimeInMs
    })

    /*
    console.log("availableTrack:", {
      requestedStartTimeInMs,
      segmentDuration,
      availableTrack,
      requestedTrack,
      startTimeInMs,
      endTimeInMs
    })
      */

    // we just make sure to sanitize it before adding it
    segment = await clapSegmentToTimelineSegment(segment)

    // also, we assume that we are adding a segment in a place where it's visible
    // (if we are wrong don't worry, our visibility detector will fix it anyway)
    segment.visibility = SegmentVisibility.VISIBLE
    
    assignTrack({
      segment,
      track: availableTrack,

      // we don't want to trigger a state change just yet
      triggerChange: false,
    })


    // we assume that the provided segment is valid, with a unique UUID
  
    // then we need to update everything

    // ok so, I'm not a big fan of doing this,
    // officially the order doesn't matter in the previousSegments array
    // this means we don't have FOR LOOPs with a BREAK etc 
    // still, I think we can improve our performance one day by storing them
    // on a temporally sorted tree
    const segments = previousSegments.concat(segment)

    const totalDurationInMs =
      segment.endTimeInMs > previousTotalDurationInMs
      ? segment.endTimeInMs
      : previousTotalDurationInMs

    const newMeta = {
      ...meta,
      durationInMs: totalDurationInMs
    }

    set({
      meta: newMeta,
      segments,
      allSegmentsChanged: previousAllSegmentsChanged + 1,
      atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged + 1,
      totalDurationInMs,
      ...computeContentSizeMetrics({
        meta: newMeta,
        tracks,
        cellWidth,
        defaultSegmentDurationInSteps,
        durationInMsPerStep,
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

  // resize and move the end of a segment, as well as the segment after it
  fitSegmentToAssetDuration: async (segment: TimelineSegment, requestedDurationInMs?: number): Promise<void> => {
    
    const {
      meta,
      tracks,
      cellWidth,
      defaultSegmentDurationInSteps,
      segments,
      durationInMsPerStep,
      atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged,
      allSegmentsChanged: previousAllSegmentsChanged,
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
    const minimumLengthInMs = minimumLengthInSteps * durationInMsPerStep

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
            console.log("TODO JULIAN: resize segment")
            // s.startTimeInMs = endTimeInMs
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
            //console.log(`ASSIGN NEW TRACK (${newTrack}) TO SEGMENT`, s)
     
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
    //console.log(`TODO Julian: stretched segments (overlapping segments) should be re-generated`)

    set({
      segments,
      allSegmentsChanged: previousAllSegmentsChanged + 1,
      atLeastOneSegmentChanged: previousAtLeastOneSegmentChanged + 1,
      ...computeContentSizeMetrics({
        meta,
        tracks,
        cellWidth,
        defaultSegmentDurationInSteps,
        durationInMsPerStep,
        totalDurationInMs,
      })
    })
  },
  deleteSegments: (ids: string[]): void => {
    const {
      segments: previousSegments,
      allSegmentsChanged,
      atLeastOneSegmentChanged,
      silentChangesInSegment,
    } = get()

    const deletables = new Set(ids)

    const newSegments = previousSegments.filter(({ id }) => {
      silentChangesInSegment[id] = 1 + (silentChangesInSegment[id] || 0)
      return !deletables.has(id)
    })

    set({
      segments: newSegments,
      allSegmentsChanged: 1 + allSegmentsChanged,
      atLeastOneSegmentChanged: 1 + atLeastOneSegmentChanged,
      silentChangesInSegment,
    })
  },
  addEntities: async (newEntities: ClapEntity[]) => {
    const {
      entities: previousEntities,
      entityIndex: previousentityIndex,
      entitiesChanged: previousEntitiesChanged,
    } = get()


    let somethingChanged = false

    for (const newEntity of newEntities) {
      if (previousentityIndex[newEntity.id]) {
        // entity already exists
        continue
      }
      previousEntities.push(newEntity)
      previousentityIndex[newEntity.id] = newEntity
      somethingChanged = true
    }

    if (somethingChanged) {
      set({
        entities: previousEntities,
        entityIndex: previousentityIndex,
        entitiesChanged: previousEntitiesChanged + 1,
      })
    }
  },
  updateEntities: async (newEntities: ClapEntity[]) => {
    const {
      entities: previousEntities,
      entityIndex: previousentityIndex,
      entitiesChanged: previousEntitiesChanged,
    } = get()

    let somethingChanged = false
    for (const newEntity of newEntities) {
      const entity = previousentityIndex[newEntity.id]
      if (!entity) {
        // entity doesn't exist
        continue
      }
      Object.assign(entity, newEntity)

      // to optimize things, we could check if the assign really did change something
      somethingChanged = true
    }

    if (somethingChanged) {
      set({
        entities: previousEntities,
        entityIndex: previousentityIndex,
        entitiesChanged: previousEntitiesChanged + 1,
      })
    }
  },
  deleteEntities: async (entitiesToDelete: (ClapEntity|string)[]) => {
    const {
      entities: previousEntities,
      entityIndex: previousentityIndex,
      entitiesChanged: previousEntitiesChanged,
    } = get()

    let idsToDelete: string[] = []
  
    for (const newEntityOrId of entitiesToDelete) {
      const id = typeof newEntityOrId === "string" ? newEntityOrId : newEntityOrId.id
      delete previousentityIndex[id]
      idsToDelete.push(id)
    }

    if (idsToDelete.length) {
      set({
        entities: previousEntities.filter(e => !idsToDelete.includes(e.id)),
        entityIndex: previousentityIndex,
        entitiesChanged: previousEntitiesChanged + 1,
      })
    }
  }
}
))

if (typeof window !== 'undefined') {
  (window as any).useTimeline = useTimeline
}
