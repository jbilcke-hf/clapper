import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, Stats } from "@react-three/drei"

import {
  TimelineControls,
  HorizontalScroller,
  VerticalScroller,
  TimelineGrid
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
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-full h-full">
          <Canvas

            // must be active when playing back a video
            frameloop="always"
            
            // those must stay ON otherwise colors will be washed out
            flat
            linear

            // doesn't work in our case since we need to display videos
            // frameloop="demand"
            

            style={{ width: "100%", height: "100%" }}
            >
              <OrthographicCamera makeDefault position={[0, 0, 1]} />
              <TimelineControls

                minZoom={minZoom}
                maxZoom={maxZoom}
                zoomSpeed={zoomSpeed}
                zoomDampingFactor={zoomDampingFactor}
              />
              <TimelineGrid />
              <Stats className={cn(`!left-auto right-0`, showFPS ? 'opacity-100' : 'opacity-0')} />
            </Canvas>
          <HorizontalScroller />
        </div>
        <VerticalScroller />
      </div>
    </div>
  );
};
