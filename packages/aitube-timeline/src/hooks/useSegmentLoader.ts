import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useThree } from "@react-three/fiber"
import { ClapSegment } from "@aitube/clap"

import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants"
import { similar, sliceSegments } from "@/utils"

import { useTimelineState } from "./useTimelineState"

export const useSegmentLoader = ({
  refreshRateInMs,
}: {
  refreshRateInMs: number
}):
  {
    visibleSegments: ClapSegment[]
    loadedSegments: ClapSegment[]
  }=> {
  // to make it react to screen width change
  // however, this doesn't seem to work well
  const { size: canvasSize, viewport } = useThree()

  // let's use the whole screen size for reference
  // this will help us in case of fast canvas resize (eg. resize using the mouse)
  const size = { width: typeof window !== "undefined" ? window.innerWidth : canvasSize.width }

  const segments = useTimelineState((s) => s.segments)
  const segmentsChanged = useTimelineState((s) => s.segmentsChanged)

  // console.log(`segmentsChanged:`, segmentsChanged)
  
  const loadedSegments = useTimelineState((s) => s.loadedSegments)
  const setLoadedSegments = useTimelineState((s) => s.setLoadedSegments)

  const visibleSegments = useTimelineState((s) => s.visibleSegments)
  const setVisibleSegments = useTimelineState((s) => s.setVisibleSegments)

  const controls = useThree((state) => state.controls)

  // we do a little trick here, to put the camera zoom inside our Zustand store
  const camera = useThree(({ camera }) => camera)

  const cellWidth = useTimelineState(s => s.cellWidth)
  const getCellHeight = useTimelineState(s => s.getCellHeight)
  // const getVerticalCellPosition = useTimelineState(s => s.getVerticalCellPosition)
  // note: only the average height change will be detected
  const cellHeight = getCellHeight()

  // TODO: maybe refactor this, put it inside the Zustand state

  useEffect(() => {
    useTimelineState.setState({ currentZoomLevel: camera.zoom })
  }, [camera])
  
  const stateRef = useRef<{
    position: THREE.Vector3
    scale: THREE.Vector3
    initialized: boolean
    beforeTimeWithBufferInMs: number
    afterTimeWithBufferInMs: number
    beforeTimeWithoutBufferInMs: number
    afterTimeWithoutBufferInMs: number
    timeout: NodeJS.Timeout
  }>({
    position: new THREE.Vector3(),
    scale: new THREE.Vector3(),
    initialized: false,
    beforeTimeWithBufferInMs: 0,
    afterTimeWithBufferInMs: 0,
    beforeTimeWithoutBufferInMs: 0,
    afterTimeWithoutBufferInMs: 0,
    timeout: 0 as unknown as NodeJS.Timeout,
  })

  const sync = async (forceRerendering?: boolean) => {
    if (!stateRef.current) { return }

    // TODO: replace our usage of stateRef.current
    // by useTimelineState.getState()
    const state = stateRef.current

    const cellWidth = useTimelineState.getState().cellWidth

    // we can adjust this threshold to only re compute the geometry
    // when a significant shift has been done by the user
    // high value (eg 5) == less sensitive
    // low value (e 2) == super sensitive
    const epsilonPaneThreshold = 3

    // now the zoom is tricky because it may be equivalent to a large paning,
    // if we are in a zoom out
    // which is why we are more sensitive here
    const epsilonZoomThreshold = 1

    const cameraDidntPaneALot = similar(state.position, camera.position, epsilonPaneThreshold)
    const cameraDidntZoomALot = similar(state.scale, camera.scale, epsilonZoomThreshold)

    if (cameraDidntPaneALot && cameraDidntZoomALot && !forceRerendering) { return }

    state.position.copy(camera.position)
    state.scale.copy(camera.scale)

    // determine, based on the current zoom level, and screen width,
    // how many horizontal cell columns could be visible at a time
    // 
    // note that is only useful for *horizontal* scrolling
    // this doesn't prevent loading delay caused by zooming out
    const maxPossibleNumberOfVisibleHorizontalCells = Math.ceil(size.width / cellWidth / camera.zoom)

    const cellWidthInPixelBasedOnZoom = size.width / maxPossibleNumberOfVisibleHorizontalCells

    // determine, based on the current camera position,
    // what is the cell which is in the middle

    const vector = new THREE.Vector3();
    vector.project(camera);

    // distance between the begining of the timeline grid and the left side of the screen
    const relativeX = - Math.round((0.5 + vector.x / 2) * (size.width / window.devicePixelRatio))
    const pixelX = relativeX * 2

    // determine the minimum visible index

    const cellIndex = Math.max(0, pixelX / cellWidthInPixelBasedOnZoom)

    // we actually don't use the camera.zoom anymore, so..

    const securityMargin =
      // this is useful for horizontal  scroll only
      maxPossibleNumberOfVisibleHorizontalCells
      +
      // if the camera is already zoomed-out a lot, it means we only need
      // to take horizontal scroll into account
      //
      // but if the camera is zoomed-in, then a quick scroll wheel could
      // send us asking for x2, x5 etc.. more cells instantly, so we need
      // to take that into account too.
      (camera.zoom * 8) // 8 because 4 on left and 4 on right

    const { segments } = useTimelineState.getState()
      
    // we only keep segments within a given range
    // those are not necessarily visible (there is a security margin)
    const afterStepsWithBuffer = Math.floor(Math.max(0, cellIndex - securityMargin))
    const beforeStepsWithBuffer = Math.floor(cellIndex + maxPossibleNumberOfVisibleHorizontalCells + securityMargin)

    const afterTimeWithBufferInMs = afterStepsWithBuffer * DEFAULT_DURATION_IN_MS_PER_STEP
    const beforeTimeWithBufferInMs = beforeStepsWithBuffer * DEFAULT_DURATION_IN_MS_PER_STEP

    if (state.afterTimeWithBufferInMs !== afterTimeWithBufferInMs || state.beforeTimeWithBufferInMs !== beforeTimeWithBufferInMs || forceRerendering) {
      state.afterTimeWithBufferInMs = afterTimeWithBufferInMs
      state.beforeTimeWithBufferInMs = beforeTimeWithBufferInMs

      const loadedSegments = await sliceSegments({
        segments,
        afterTimeInMs: afterTimeWithBufferInMs,
        beforeTimeInMs: beforeTimeWithBufferInMs
      })

      setLoadedSegments(loadedSegments)
    }

    const afterStepsWithoutBuffer = Math.floor(Math.max(0, cellIndex))
    const beforeStepsWithoutBuffer = Math.floor(cellIndex + maxPossibleNumberOfVisibleHorizontalCells)

    const afterTimeWithoutBufferInMs = afterStepsWithoutBuffer * DEFAULT_DURATION_IN_MS_PER_STEP
    const beforeTimeWithoutBufferInMs = beforeStepsWithoutBuffer * DEFAULT_DURATION_IN_MS_PER_STEP
  
    if (state.afterTimeWithoutBufferInMs !== afterTimeWithoutBufferInMs || state.beforeTimeWithoutBufferInMs !== beforeTimeWithoutBufferInMs || forceRerendering) {
      state.afterTimeWithoutBufferInMs = afterTimeWithoutBufferInMs
      state.beforeTimeWithoutBufferInMs = beforeTimeWithoutBufferInMs
  
      const visibleSegments = await sliceSegments({
        segments: loadedSegments, // <- yeah, to save compute we sub-filter this previously filtered set
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
      // we want a relatively "high" refresh rate in order to get smooth camera movement
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
    // console.log("forcing a sync(true)")
    const fn = async () => { try { await sync(true) } catch (err) {} }
    fn()
  }, [cellHeight, cellWidth, segmentsChanged])
  
  return { visibleSegments, loadedSegments }
}