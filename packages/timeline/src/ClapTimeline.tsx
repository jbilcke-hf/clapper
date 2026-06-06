import AutoSizer, { Size } from "react-virtualized-auto-sizer"
import { Canvas } from "@react-three/fiber"
import { Stats } from "@react-three/drei"

import {
  TimelineControls,
  HorizontalScroller,
  TimelineQuickActions,
  Timeline
} from "@/components"
import { ClapProject, isValidNumber } from "@aitube/clap"
import {
  DEFAULT_FRAMELOOP,
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  DEFAULT_SHOW_FPS,
  DEFAULT_ZOOM_DAMPING_FACTOR,
  DEFAULT_ZOOM_SPEED
} from "./constants/defaults"
import { cn } from "./utils"
import { TimelineCamera } from "./components/camera"
import { useTimeline } from "./hooks"
import { topBarTimeScaleHeight } from "./constants/themes"
import { SegmentEditionStatus, TimelineStore } from "./types"

export function ClapTimeline({
  clap,
  className = "",
  minZoom = DEFAULT_MIN_ZOOM,
  maxZoom = DEFAULT_MAX_ZOOM,
  zoomSpeed = DEFAULT_ZOOM_SPEED,
  zoomDampingFactor = DEFAULT_ZOOM_DAMPING_FACTOR,
  showFPS = DEFAULT_SHOW_FPS,
  // frameloop = DEFAULT_FRAMELOOP,
  // width,
  // height,
  }: {
    clap?: ClapProject
    className?: string
    minZoom?: number
    maxZoom?: number
    zoomSpeed?: number
    zoomDampingFactor?: number
    showFPS?: boolean

    // demand is less CPU intensive, but you will have to manually
    // trigger state changes
    // frameloop?: "demand" | "always" | "never"
    // width?: number
    // height?: number
  } = {
    clap: undefined,

    minZoom: DEFAULT_MIN_ZOOM,
    maxZoom: DEFAULT_MAX_ZOOM,
    zoomSpeed: DEFAULT_ZOOM_SPEED,
    zoomDampingFactor: DEFAULT_ZOOM_DAMPING_FACTOR,
    showFPS: DEFAULT_SHOW_FPS,
    // frameloop: DEFAULT_FRAMELOOP
  }) {
  const theme = useTimeline(s => s.theme)
  const invalidate = useTimeline(s => s.invalidate)
  const canvas = useTimeline(s => s.canvas)
  const setCanvas = useTimeline(s => s.setCanvas)
  const handleMouseWheel = useTimeline(s => s.handleMouseWheel)

  const handleIsCreated = () => {
    useTimeline.setState({ isReady: true })
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    const timeline: TimelineStore = useTimeline.getState()
    const {
      editedSegment,
      cellWidth,
      durationInMsPerStep,
      getVerticalCellPosition,
      tracks,
      scrollX,
      moveSegment,
    } = timeline

    if (editedSegment?.editionStatus === SegmentEditionStatus.DRAGGING && canvas) {
      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in event ? event.touches[0]?.clientX : event.clientX
      const clientY = "touches" in event ? event.touches[0]?.clientY : event.clientY

      if (typeof clientX === "number" && typeof clientY === "number") {
        const localX = clientX - rect.left
        const localY = clientY - rect.top
        const pointerTimeInMs = Math.round(((localX + scrollX) / cellWidth) * durationInMsPerStep)
        const segmentDurationInMs = editedSegment.endTimeInMs - editedSegment.startTimeInMs
        const startTimeInMs = Math.max(
          0,
          pointerTimeInMs - Math.round(segmentDurationInMs / 2)
        )

        let track = editedSegment.track
        const trackY = Math.max(0, localY - topBarTimeScaleHeight)
        let top = 0
        for (const candidate of tracks) {
          const height = timeline.getCellHeight(candidate.id)
          const trackTop = top
          const trackBottom = top + height
          if (trackY >= trackTop && trackY <= trackBottom) {
            track = candidate.id
            break
          }
          top = getVerticalCellPosition(0, candidate.id + 1)
        }

        moveSegment({
          segment: editedSegment,
          startTimeInMs,
          track,
        })
      }
    }
    
    // since we are un frameloop="demand" mode, we need to manual invalidate the scene
    invalidate()

    event.stopPropagation()
    return false
  }

  const handlePointerRelease = () => {
    const { editedSegment, setEditedSegment } = useTimeline.getState()
    if (editedSegment?.editionStatus === SegmentEditionStatus.DRAGGING) {
      setEditedSegment({ segment: undefined })
    }
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const rect = canvas?.getBoundingClientRect()
    if (!rect) { return }

    const clientY = event.clientY
    const containerY = rect.y
    const posY = clientY - containerY

    // apparently we cannot stop the propagation from the scroll wheel event
    // we attach to our to bar from the scroll wheel event set on the canvas
    // (that makes sense, one is in DOM space, the other in WebGL space)
    //
    // there are probably better ways to do this, but for now here is a very
    // crude fix to ignore global X-Y scroll events when we are over the timeline
    if (posY <= topBarTimeScaleHeight) { return }

    // since we are un frameloop="demand" mode, we need to manual invalidate the scene
    invalidate()

    handleMouseWheel({
      deltaX: event.deltaX,
      deltaY: event.deltaY
    })
  }

  return (
    <div
      className={cn(`relative w-full h-full`, className)}
      style={{
        backgroundColor: theme.grid.backgroundColor
      }}>
      <AutoSizer style={{
        height: "100%", // <-- mandatory otherwise the timeline won't show up
        width: "100%" // <-- mandatory otherwise the horizontal scroller won't show up
        }}>
        {({ height, width }: Size) => (
      <div className="flex flex-grow flex-row w-full h-full">
        <div className="flex flex-grow flex-col w-full h-full">
          <TimelineQuickActions />
          <HorizontalScroller />
          <Canvas
            ref={(canvas) => {
              setCanvas(canvas || undefined)
            }}
            id="clap-timeline"

            // must be active when playing back a video
            // UPDATE on 20240912: right now we have disabled video preview from the timeline
            // we don't need it anymore since we are displaying split frames for a video segment
            // so we can disable the always on frame loop -> this should help cooling down the GPU
            // frameloop="always"
            frameloop="demand"
            // note: if you disable frameloop="demand" then you need to
            // search in the code for places that reference if (eg. manual instanciations)
            
            // those must stay ON otherwise colors will be washed out
            flat
            linear

            // doesn't work in our case since we need to display videos
            // frameloop="demand"
            

            style={{
              width: isValidNumber(width) ? `${width}px` : "100%",
              height: isValidNumber(height) ? `${height}px` : "100%"
            }}

            onCreated={handleIsCreated}

            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseUp={handlePointerRelease}
            onTouchEnd={handlePointerRelease}
            >
              <TimelineCamera />
              <TimelineControls

                // TODO: remove all those controls
                minZoom={minZoom}
                maxZoom={maxZoom}
                zoomSpeed={zoomSpeed}
                zoomDampingFactor={zoomDampingFactor}
              />
              <Timeline width={width} height={height} />
              {showFPS && <Stats className={cn(`!left-auto right-0`)} />}
            </Canvas>

          </div>
          {
          // <VerticalScroller />
          }
        </div>
        )}
      </AutoSizer>
    </div>
  );
};
