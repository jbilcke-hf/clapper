import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useThree } from "@react-three/fiber"

import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants"
import { similar, sliceSegments } from "@/utils"

import { useTimeline } from "./useTimeline"
import { TimelineSegment, TimelineStore } from "@/types"
import { leftBarTrackScaleWidth } from "@/constants/themes"

export const useSegmentLoader = ({
  refreshRateInMs,
}: {
  refreshRateInMs: number
}):
  {
    visibleSegments: TimelineSegment[]
    loadedSegments: TimelineSegment[]
  }=> {
  // to make it react to screen width change
  // however, this doesn't seem to work well
  // const { size: canvasSize, viewport } = useThree()

  const segments = useTimeline((s) => s.segments)
  const allSegmentsChanged = useTimeline((s) => s.allSegmentsChanged)

  const loadedSegments = useTimeline((s) => s.loadedSegments)
  const setLoadedSegments = useTimeline((s) => s.setLoadedSegments)

  const visibleSegments = useTimeline((s) => s.visibleSegments)
  const setVisibleSegments = useTimeline((s) => s.setVisibleSegments)

  const controls = useThree((state) => state.controls)

  // we do a little trick here, to put the camera zoom inside our Zustand store
  const camera = useThree(({ camera }) => camera)

  const cellWidth = useTimeline(s => s.cellWidth)
  const getCellHeight = useTimeline(s => s.getCellHeight)
  // const getVerticalCellPosition = useTimeline(s => s.getVerticalCellPosition)
  // note: only the average height change will be detected
  const cellHeight = getCellHeight()

  // TODO: I think we don't need to check over the camera.zoom anymore,
  // since we have set it fixed now
  useEffect(() => {
    useTimeline.setState({ currentZoomLevel: camera.zoom })
  }, [camera])
  
  const stateRef = useRef<{
    scrollX: number
    initialized: boolean
    beforeTimeWithBufferInMs: number
    afterTimeWithBufferInMs: number
    beforeTimeWithoutBufferInMs: number
    afterTimeWithoutBufferInMs: number
    timeout: NodeJS.Timeout
  }>({
    scrollX: 0,
    initialized: false,
    beforeTimeWithBufferInMs: 0,
    afterTimeWithBufferInMs: 0,
    beforeTimeWithoutBufferInMs: 0,
    afterTimeWithoutBufferInMs: 0,
    timeout: 0 as unknown as NodeJS.Timeout,
  })

  const sync = async (forceRerendering?: boolean) => {
    // TODO: replace our usage of stateRef.current
    // by useTimeline.getState()
    const state = stateRef.current

    const timeline: TimelineStore = useTimeline.getState() 
    const { cellWidth, width, height } = timeline

    if (!state || !camera) { return }

    // we can adjust this threshold to only re compute the geometry
    // when a significant shift has been done by the user
    // high value (eg 5) == less sensitive
    // low value (e 2) == super sensitive
    const epsilonPaneThreshold = 3

    // now the zoom is tricky because it may be equivalent to a large paning,
    // if we are in a zoom out
    // which is why we are more sensitive here
    const epsilonZoomThreshold = 1

    // we don't need to check X, Y, Z and zoom anymore here, we can just look at scrollX
    const cameraDidntPaneALot = Math.abs(state.scrollX - camera.position.x) < epsilonPaneThreshold
 
    if (cameraDidntPaneALot && !forceRerendering) { return }

    // we do this AFTER the return condition
    state.scrollX = camera.position.x

    // determine, based on the current zoom level, and screen width,
    // how many horizontal cell columns could be visible at a time
    // 
    // note that is only useful for *horizontal* scrolling
    // this doesn't prevent loading delay caused by zooming out
    const maxPossibleNumberOfVisibleHorizontalCells =
      Math.ceil(window.innerWidth / cellWidth)

    // it appears that we have an issue with the calculation here
    // could be that we don't take everything into account,
    // like the left margin?
    
    // note: currently the camera is not initialized well by default,
    // due to the left bar track
    // 
    // so, be careful: if you fix the camera initialization bug,
    // then you *might* have to check in here too
    const posX = camera.position.x + leftBarTrackScaleWidth

    const cellIndex =
      Math.max(0, posX / cellWidth)

    // we actually don't use the camera.zoom anymore, so..

    const securityMarginInCellStepCount =
      // note: I've try to multiply this thing, but this didn't really solve
      // the blank grid flash issue
      maxPossibleNumberOfVisibleHorizontalCells
      +
      // if the camera is already zoomed-out a lot, it means we only need
      // to take horizontal scroll into account
      //
      // but if the camera is zoomed-in, then a quick scroll wheel could
      // send us asking for x2, x5 etc.. more cells instantly, so we need
      // to take that into account too.
      8 // 8 because 4 on left and 4 on right

    const { segments } = useTimeline.getState()
      
    // we only keep segments within a given range
    // those are not necessarily visible (there is a security margin)
    const afterStepsWithBuffer = Math.max(0, cellIndex - securityMarginInCellStepCount)
    const beforeStepsWithBuffer = Math.max(afterStepsWithBuffer, cellIndex + maxPossibleNumberOfVisibleHorizontalCells + securityMarginInCellStepCount)

    const afterTimeWithBufferInMs = afterStepsWithBuffer * DEFAULT_DURATION_IN_MS_PER_STEP
    const beforeTimeWithBufferInMs = beforeStepsWithBuffer * DEFAULT_DURATION_IN_MS_PER_STEP

    if (
      state.afterTimeWithBufferInMs !== afterTimeWithBufferInMs
      || state.beforeTimeWithBufferInMs !== beforeTimeWithBufferInMs
      || forceRerendering) {
      state.afterTimeWithBufferInMs = afterTimeWithBufferInMs
      state.beforeTimeWithBufferInMs = beforeTimeWithBufferInMs

      const loadedSegments = await sliceSegments({
        segments,
        afterTimeInMs: afterTimeWithBufferInMs,
        beforeTimeInMs: beforeTimeWithBufferInMs
      })

      setLoadedSegments(loadedSegments)
    }

    const afterStepsWithoutBuffer = Math.max(0, cellIndex)
    const beforeStepsWithoutBuffer = Math.max(afterStepsWithoutBuffer, cellIndex + maxPossibleNumberOfVisibleHorizontalCells)

    const afterTimeWithoutBufferInMs = afterStepsWithoutBuffer * DEFAULT_DURATION_IN_MS_PER_STEP
    const beforeTimeWithoutBufferInMs = beforeStepsWithoutBuffer * DEFAULT_DURATION_IN_MS_PER_STEP
  
    if (
      state.afterTimeWithoutBufferInMs !== afterTimeWithoutBufferInMs
      || state.beforeTimeWithoutBufferInMs !== beforeTimeWithoutBufferInMs
      || forceRerendering) {
      state.afterTimeWithoutBufferInMs = afterTimeWithoutBufferInMs
      state.beforeTimeWithoutBufferInMs = beforeTimeWithoutBufferInMs
  
      const visibleSegments = await sliceSegments({
        segments: segments, // <- apparently we cannot use the loadedSegments which is supposedly larger? weird
        afterTimeInMs: afterTimeWithoutBufferInMs,
        beforeTimeInMs: beforeTimeWithoutBufferInMs
      })
      setVisibleSegments(visibleSegments)
    }
  }
 
  useEffect(() => {
    const state = stateRef.current
    if (!state || state.initialized || !controls) { return }

    state.initialized = true
   
    // console.log("scheduling a sync(false)")
    // we could also use useInterval, but we need something async-friendly
    const fn = async () => {
      // we want a relatively low refresh rate (high delay) in order to get smooth camera movement
      // eg a rate of 500ms
      //
      // ideally I would say we should also debounce the call, to defer
      // the sync to until we have finished the zoom animation and don't have user action,
      // (with a time limit anyway)
      //
      // we can also try to optimize this further by adapting it to the compute load,
      // either by calculating the FPS or by monitoring the time it takes
      // to run the sync() function
      try { await sync(false) } catch (err) {}

      state.timeout = setTimeout(fn, refreshRateInMs) as any
    }
    fn()
    // no need to clear the timeout
  }, [controls]) // to wait before we are sure to have the controls

  // force a re-render when cell width or height change
  useEffect(() => {
    console.log("Re-rendering the whole segment timeline (this is an expensive operation, should be rare)")
    const fn = async () => { try { await sync(true) } catch (err) {} }
    fn()
  }, [cellHeight, cellWidth, allSegmentsChanged])
  
  return { visibleSegments, loadedSegments }
}