import { useCallback } from "react"
import AutoSizer, { Size } from "react-virtualized-auto-sizer"
import { Canvas } from "@react-three/fiber"
import { Stats } from "@react-three/drei"
import { ClapSegmentCategory } from "@aitube/clap"

import {
  TimelineControls,
  HorizontalScroller,
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
import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "./constants/themes"
import { SegmentEditionStatus, TimelineStore } from "./types"

const editableTrackCategories = [
  ClapSegmentCategory.GENERIC,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.ACTION,
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.MUSIC,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.INTERFACE,
  ClapSegmentCategory.TRANSITION,
  ClapSegmentCategory.EVENT,
]

function TrackControlsOverlay() {
  const tracks = useTimeline(s => s.tracks)
  const createTrack = useTimeline(s => s.createTrack)
  const setTrackCategory = useTimeline(s => s.setTrackCategory)
  const createClipOnTrack = useTimeline(s => s.createClipOnTrack)

  return (
    <div
      aria-label="Track controls"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        left: "8px",
        maxWidth: `${leftBarTrackScaleWidth - 16}px`,
        position: "absolute",
        top: `${topBarTimeScaleHeight + 8}px`,
        zIndex: 20,
      }}
    >
      {tracks.map(track => (
        <div
          key={track.id}
          style={{
            alignItems: "center",
            background: "rgba(17, 24, 39, 0.86)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: "4px",
            display: "grid",
            gap: "4px",
            gridTemplateColumns: "20px minmax(0, 1fr)",
            padding: "4px",
          }}
        >
          <span
            style={{
              color: "#f9fafb",
              fontSize: "11px",
              fontWeight: 700,
              lineHeight: "24px",
              textAlign: "center",
            }}
          >
            {track.id}
          </span>
          <select
            aria-label={`Track ${track.id} type`}
            value={track.category || ClapSegmentCategory.GENERIC}
            disabled={track.occupied}
            onChange={(event) => {
              setTrackCategory({
                track: track.id,
                category: event.target.value as ClapSegmentCategory,
              })
            }}
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "4px",
              color: "#f9fafb",
              fontSize: "11px",
              height: "24px",
              minWidth: 0,
            }}
          >
            {editableTrackCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              createClipOnTrack({
                track: track.id,
                category: track.category || ClapSegmentCategory.GENERIC,
              })
            }}
            style={{
              background: "#f9fafb",
              border: "1px solid rgba(17,24,39,0.2)",
              borderRadius: "4px",
              color: "#111827",
              cursor: "pointer",
              fontSize: "11px",
              gridColumn: "1 / -1",
              height: "24px",
            }}
          >
            + Clip
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          createTrack({
            track: tracks.length,
            category: ClapSegmentCategory.GENERIC,
          })
        }}
        style={{
          background: "#f9fafb",
          border: "1px solid rgba(17,24,39,0.2)",
          borderRadius: "4px",
          color: "#111827",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 700,
          height: "28px",
        }}
      >
        + Track
      </button>
    </div>
  )
}

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

  const handleCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return
    }

    setCanvas(canvas)
  }, [setCanvas])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    const timeline: TimelineStore = useTimeline.getState()
    const {
      canvas,
      cellWidth,
      durationInMsPerStep,
      editedSegment,
      getCellHeight,
      moveSegmentTo,
      scrollX,
      scrollY,
      tracks,
    } = timeline

    // do something based on the current status of the edited segment
    // for instance if the edited segment is being grabbed,
    // we are going to want to display the segments that are around it
    // console.log(`TODO @julian: implement edit here`)
    if (editedSegment?.editionStatus === SegmentEditionStatus.DRAGGING && canvas) {
      const pointer = "touches" in event ? event.touches[0] : event
      const rect = canvas.getBoundingClientRect()
      const pointerX = pointer.clientX - rect.left
      const pointerY = pointer.clientY - rect.top
      const nextStartTimeInMs = Math.max(
        0,
        ((pointerX - leftBarTrackScaleWidth + scrollX) / cellWidth) * durationInMsPerStep
      )

      let nextTrack = editedSegment.track
      let verticalCursor = Math.max(0, pointerY - topBarTimeScaleHeight + scrollY)
      for (const track of tracks) {
        const cellHeight = getCellHeight(track.id)
        if (verticalCursor <= cellHeight) {
          nextTrack = track.id
          break
        }
        verticalCursor -= cellHeight
      }

      moveSegmentTo({
        segment: editedSegment,
        startTimeInMs: nextStartTimeInMs,
        track: nextTrack,
      })
    }
    
    // since we are un frameloop="demand" mode, we need to manual invalidate the scene
    invalidate()

    event.stopPropagation()
    return false
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
      className={cn(`w-full h-full`, className)}
      style={{
        backgroundColor: theme.grid.backgroundColor,
        position: "relative",
      }}>
      <TrackControlsOverlay />
      <AutoSizer style={{
        height: "100%", // <-- mandatory otherwise the timeline won't show up
        width: "100%" // <-- mandatory otherwise the horizontal scroller won't show up
        }}>
        {({ height, width }: Size) => (
      <div className="flex flex-grow flex-row w-full h-full">
        <div className="flex flex-grow flex-col w-full h-full">
          <HorizontalScroller />
          <Canvas
            ref={handleCanvasRef}
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
