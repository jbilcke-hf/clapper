import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, Stats } from "@react-three/drei"

import {
  TimelineControls,
  HorizontalScroller,
  VerticalScroller,
  TimelineGrid
} from "@/components"
import { ClapProject } from "@aitube/clap"
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_MAX_ZOOM, DEFAULT_MIN_ZOOM, DEFAULT_SHOW_FPS, DEFAULT_ZOOM_DAMPING_FACTOR, DEFAULT_ZOOM_SPEED } from "./constants/defaults"

export function ClapTimeline({
  clap,

  minZoom = DEFAULT_MIN_ZOOM,
  maxZoom = DEFAULT_MAX_ZOOM,
  zoomSpeed = DEFAULT_ZOOM_SPEED,
  zoomDampingFactor = DEFAULT_ZOOM_DAMPING_FACTOR,
  showFPS = DEFAULT_SHOW_FPS,
  backgroundColor = DEFAULT_BACKGROUND_COLOR
  }: {
    clap?: ClapProject
    minZoom?: number
    maxZoom?: number
    zoomSpeed?: number
    zoomDampingFactor?: number
    showFPS?: boolean
    backgroundColor?: string
  } = {
    clap: undefined,

    minZoom: DEFAULT_MIN_ZOOM,
    maxZoom: DEFAULT_MAX_ZOOM,
    zoomSpeed: DEFAULT_ZOOM_SPEED,
    zoomDampingFactor: DEFAULT_ZOOM_DAMPING_FACTOR,
    showFPS: DEFAULT_SHOW_FPS,
    backgroundColor: DEFAULT_BACKGROUND_COLOR
  }) {
  return (
    <div
    className="w-full h-full overflow-hidden"
    // note: bg-zinc-800 is: #27272A
     >
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-full h-full">
          <Canvas

            frameloop="always"

            // those must stay ON otherwise colors will be washed out
            flat
            linear

            // doesn't work in our case since we need to display videos
            // frameloop="demand"
            

            style={{
              width: "100%",
              height: "100%",
              background: backgroundColor
            }}
            >
            <OrthographicCamera makeDefault position={[0, 0, 1]} />
            <TimelineControls

              minZoom={minZoom}
              maxZoom={maxZoom}
              zoomSpeed={zoomSpeed}
              zoomDampingFactor={zoomDampingFactor}
            />
            <TimelineGrid />
            {showFPS && <Stats className="!left-auto right-0" />}
          </Canvas>
          <HorizontalScroller />
        </div>
        <VerticalScroller />
      </div>
    </div>
  );
};
