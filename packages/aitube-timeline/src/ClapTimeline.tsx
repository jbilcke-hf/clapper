import AutoSizer, { Size } from "react-virtualized-auto-sizer"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stats } from "@react-three/drei"

import {
  TimelineControls,
  HorizontalScroller,
  VerticalScroller,
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
import { useRef } from "react"

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
  const ref = useRef<HTMLCanvasElement>(null)

  const handleIsCreated = () => {
    useTimeline.setState({ isReady: true })
  }

  return (
    <div className={cn(`w-full h-full`, className)}>
      <AutoSizer style={{
        height: "100%", // <-- mandatory otherwise the timeline won't show up
        width: "100%" // <-- mandatory otherwise the horizontal scroller won't show up
        }}>
        {({ height, width }: Size) => (
      <div className="flex flex-grow flex-row w-full h-full">
        <div className="flex flex-grow flex-col w-full h-full">
          <HorizontalScroller />
          <Canvas
            ref={ref}
            id="clap-timeline"

            // must be active when playing back a video
            frameloop="always"
            
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
  
            onWheel={(wheelEvent) => {
              const rect = ref.current?.getBoundingClientRect()
              if (!rect) { return }

              const clientY = wheelEvent.clientY
              const containerY = rect.y
              const posY = clientY - containerY
 
              // apparently we cannot stop the propagation from the scroll wheel event
              // we attach to our to bar from the scroll wheel event set on the canvas
              // (that makes sense, one is in DOM space, the other in WebGL space)
              //
              // there are probably better ways to do this, but for now here is a very
              // crude fix to ignore global X-Y scroll events when we are over the timeline
              if (posY <= topBarTimeScaleHeight) { return }
 
              useTimeline.getState().handleMouseWheel({
                deltaX: wheelEvent.deltaX,
                deltaY: wheelEvent.deltaY
              })
            }}
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
