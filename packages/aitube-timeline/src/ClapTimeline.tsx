import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, Stats } from "@react-three/drei"

import {
  TimelineControls,
  HorizontalScroller,
  VerticalScroller,
  TimelineGrid
} from "@/components"
import { ClapProject } from "@aitube/clap"


export const DEFAULT_MIN_ZOOM = 1
export const DEFAULT_MAX_ZOOM = 5
export const DEFAULT_ZOOM_SPEED = 2.2 // high = faster
export const DEFAULT_SHOW_FPS = false

export function ClapTimeline({
  clap,

  minZoom = DEFAULT_MIN_ZOOM,
  maxZoom = DEFAULT_MAX_ZOOM,
  zoomSpeed = DEFAULT_ZOOM_SPEED,
  showFPS = DEFAULT_SHOW_FPS
  }: {
    clap?: ClapProject
    minZoom?: number
    maxZoom?: number
    zoomSpeed?: number
    showFPS?: false
  } = {
    clap: undefined,

    minZoom: DEFAULT_MIN_ZOOM,
    maxZoom: DEFAULT_MAX_ZOOM,
    zoomSpeed: DEFAULT_ZOOM_SPEED,
    showFPS: DEFAULT_SHOW_FPS
  }) {
  return (
    <div className="w-full h-full overflow-hidden"
    style={{ width: "100%", height: "100%", background: "rgb(18,24,39)" }}>
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-full h-full">
          <Canvas
             frameloop="demand"
            style={{ width: "100%", height: "100%", background: "rgb(18,24,39)" }}>
            <OrthographicCamera makeDefault position={[0, 0, 1]} />
            <TimelineControls

              minZoom={minZoom}
              maxZoom={maxZoom}
              zoomSpeed={zoomSpeed}
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
