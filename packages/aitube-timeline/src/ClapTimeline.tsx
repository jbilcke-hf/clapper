import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stats } from "@react-three/drei"

import {
  TimelineControls,
  HorizontalScroller,
  VerticalScroller,
  Timeline
} from "@/components"
import { ClapProject } from "@aitube/clap"
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
import { useTimelineState } from "./hooks"
import { clamp } from "./utils/clamp"
import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "./constants/themes"

export function ClapTimeline({
  clap,
  className = "",
  minZoom = DEFAULT_MIN_ZOOM,
  maxZoom = DEFAULT_MAX_ZOOM,
  zoomSpeed = DEFAULT_ZOOM_SPEED,
  zoomDampingFactor = DEFAULT_ZOOM_DAMPING_FACTOR,
  showFPS = DEFAULT_SHOW_FPS,
  frameloop = DEFAULT_FRAMELOOP,
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
    frameloop?: "demand" | "always" | "never"
  } = {
    clap: undefined,

    minZoom: DEFAULT_MIN_ZOOM,
    maxZoom: DEFAULT_MAX_ZOOM,
    zoomSpeed: DEFAULT_ZOOM_SPEED,
    zoomDampingFactor: DEFAULT_ZOOM_DAMPING_FACTOR,
    showFPS: DEFAULT_SHOW_FPS,
    frameloop: DEFAULT_FRAMELOOP
  }) {
  return (
    <div
    className={cn(`w-full h-full overflow-hidden`, className)}
     >
      <div className="flex flex-grow flex-row h-full">
        <div className="flex flex-grow flex-col w-full">
          <Canvas
            id="clap-timeline"

            // must be active when playing back a video
            frameloop="always"
            
            // those must stay ON otherwise colors will be washed out
            flat
            linear

            // doesn't work in our case since we need to display videos
            // frameloop="demand"
            

            style={{ width: "100%", height: "100%" }}

            onWheel={(wheelEvent) => {
              // apparently we cannot stop the propagation from the scroll wheel event
              // we attach to our to bar from the scroll wheel event set on the canvas
              // (that makes sense, one is in DOM space, the other in WebGL space)
              //
              // there are probably better ways to do this, but for now here is a very
              // crude fix to ignore global X-Y scroll events when we are over the timeline
              if (wheelEvent.clientY <= topBarTimeScaleHeight) { return }
 
              useTimelineState.getState().handleMouseWheel({
                deltaX: wheelEvent.deltaX,
                deltaY: wheelEvent.deltaY
              })
            }}
            >
              <TimelineCamera />
              <TimelineControls

                minZoom={minZoom}
                maxZoom={maxZoom}
                zoomSpeed={zoomSpeed}
                zoomDampingFactor={zoomDampingFactor}
              />
              <Timeline />
              {showFPS && <Stats className={cn(`!left-auto right-0`)} />}
            </Canvas>
          <HorizontalScroller />
        </div>
        {
        // <VerticalScroller />
        }
      </div>
    </div>
  );
};
