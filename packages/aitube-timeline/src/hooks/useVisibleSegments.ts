import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useThree } from "@react-three/fiber"
import { ClapSegment } from "@aitube/clap"

import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants"
import { similar, sliceSegments } from "@/utils"

import { useTimelineState } from "./useTimelineState"

export const useVisibleSegments = ({
  cellHeight,
  cellWidth,
  nbMaxTracks,
  refreshRateInMs,
}: {
  cellHeight: number
  cellWidth: number
  nbMaxTracks: number
  refreshRateInMs: number
}) => {
  // to make it react to screen width change
  // however, this doesn't seem to work well
  const { size: canvasSize, viewport } = useThree()

  // let's use the whole screen size for reference
  // this will help us in case of fast canvas resize (eg. resize using the mouse)
  const size = { width: typeof window !== "undefined" ? window.innerWidth : canvasSize.width }

  const segments = useTimelineState((s) => s.segments)
  const segmentsChanged = useTimelineState((s) => s.segmentsChanged)

  const visibleSegments = useTimelineState((s) => s.visibleSegments)
  const setVisibleSegments = useTimelineState((s) => s.setVisibleSegments)

  const controls = useThree((state) => state.controls)
  const camera = useThree((state) => state.camera)
  
  // TODO: maybe refactor this, put it inside the Zustand state

  const stateRef = useRef<{
    position: THREE.Vector3
    scale: THREE.Vector3
    initialized: boolean
    beforeTimeInMs: number
    afterTimeInMs: number
    timeout: NodeJS.Timeout
    segments: ClapSegment[]
    visibleSegments: ClapSegment[]
    cellHeight: number
    cellWidth: number
    nbMaxTracks: number
  }>({
    position: new THREE.Vector3(),
    scale: new THREE.Vector3(),
    initialized: false,
    beforeTimeInMs: 0,
    afterTimeInMs: 0,
    timeout: 0 as unknown as NodeJS.Timeout,
    segments: [],
    visibleSegments: [],
    cellHeight,
    cellWidth,
    nbMaxTracks,
  })


  // make sure the state reflects the latest params
  stateRef.current.segments = [...segments]
  stateRef.current.cellHeight = cellHeight
  stateRef.current.cellWidth = cellWidth
  stateRef.current.nbMaxTracks = nbMaxTracks

  // DO we still need this?
  useEffect(() => {
    stateRef.current.segments = [...segments]
    console.log("TODO: force a re-rendering")
  }, [segmentsChanged])
  /*

  for some reason, this:

    controls.addEventListener("change", onChange)

  doesn't work..

  useEffect(() => {
    const previous = cameraRef.current
    if (!previous || previous.initialized || !controls) { return }

    previous.initialized = true

    console.log("getting ready..", {
      previous,
      camera, 
      controls
    })
    // Fires when the camera has been transformed by the controls.
    const onChange = () => {
      console.log("onChange!")
      // we can adjust this threshold to only re compute the geometry
      // when a significant shift has been done by the user
      const epsilonPaneThreshold = 5

      // now the zoom is tricky because it may be equivalent to a large paning,
      // if we are in a zoom out
      const epsilonZoomThreshold = 1

      const cameraDidntPaneALot = similar(previous.position, camera.position, epsilonPaneThreshold)
      const cameraDidntZoomALot = similar(previous.scale, camera.scale, epsilonZoomThreshold)

      if (cameraDidntPaneALot && cameraDidntZoomALot) { return }

      previous.position.copy(camera.position)
      previous.scale.copy(camera.scale)

      console.log("the camera has changed a lot!")
    }

    // Fires when an interaction was initiated.
    const onStart = () => {
      console.log("onStart!")
    }

    // Fires when an interaction has finished.
    const onEnd = () => {
      console.log("onEnd!")
    }

    controls.addEventListener("change", onChange)
    controls.addEventListener("start", onStart)
    controls.addEventListener("end", onEnd)

    return () => {
      controls.removeEventListener("change", onChange)
      controls.removeEventListener("start", onStart)
      controls.removeEventListener("chaendnge", onEnd)  
    }
  }, [controls])
  */


  // TODO we should use:
  //   controls.addEventListener("change", onChange)
  // instead, but it doesn't work for some reason..
  const sync = async (forceRerendering?: boolean) => {
    if (!stateRef.current) { return }
    const state = stateRef.current

    // we can adjust this threshold to only re compute the geometry
    // when a significant shift has been done by the user
    const epsilonPaneThreshold = 5

    // now the zoom is tricky because it may be equivalent to a large paning,
    // if we are in a zoom out
    const epsilonZoomThreshold = 1

    const cameraDidntPaneALot = similar(state.position, camera.position, epsilonPaneThreshold)
    const cameraDidntZoomALot = similar(state.scale, camera.scale, epsilonZoomThreshold)

    if (cameraDidntPaneALot && cameraDidntZoomALot && !forceRerendering) { return }

    state.position.copy(camera.position)
    state.scale.copy(camera.scale)

    // TODO: compute the visible cell X and Y
    // then we are going to be a bit generous and also display items on the left and right of it

    // determine, based on the current zoom level, and screen width,
    // how many horizontal cell columns could be visible at a time
    const maxPossibleNumberOfVisibleHorizontalCells =
      Math.ceil(size.width / state.cellWidth / camera.zoom)

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

    const securityMargin = maxPossibleNumberOfVisibleHorizontalCells

    // we only keep segments within a given range
    // those are not necessarily visible (there is a security margin)
    const afterSteps =  Math.floor(Math.max(0, cellIndex - securityMargin))
    const beforeSteps = Math.floor(cellIndex + maxPossibleNumberOfVisibleHorizontalCells + securityMargin)

    const afterTimeInMs = afterSteps * DEFAULT_DURATION_IN_MS_PER_STEP
    const beforeTimeInMs = beforeSteps * DEFAULT_DURATION_IN_MS_PER_STEP

    if (state.afterTimeInMs !== afterTimeInMs || state.beforeTimeInMs !== beforeTimeInMs || forceRerendering) {
      state.afterTimeInMs = afterTimeInMs
      state.beforeTimeInMs = beforeTimeInMs

      const visibleSegments = await sliceSegments({ ...state })

      state.visibleSegments = [...visibleSegments]
      
      setVisibleSegments(visibleSegments)
    }
  }
 
  useEffect(() => {
    const state = stateRef.current
    if (!state || state.initialized || !controls) { return }

    state.initialized = true
   
    // we could also use useInterval, but we need something async-friendly
    const fn = async () => {
      // TODO: monitor how long it takes to sync
      try { await sync(false) } catch (err) {}
      // console.log("setting a new timeout")

      // refresh rate for the grid (high value == delay before we see the "hidden" cells)
      // this should be a fact of the number of segments,
      // as this puts a strain on the rendering FPS
      // one thing that could be done is to compute how long the last sync operation lasted,
      // and adjust the refreshRateInMs based on this
      
      state.timeout = setTimeout(fn, refreshRateInMs) as any
    }
    fn()
    // no need to clear the timeout
  }, [controls]) // to wait before we are sure to have the controls

  // force a re-render when cell width or height change
  useEffect(() => {
    const fn = async () => { try { await sync(true) } catch (err) {} }
    fn()
  }, [cellHeight, cellWidth])
  
  return visibleSegments;
};