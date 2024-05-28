import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, Stats } from "@react-three/drei"

import {
  TimelineControls,
  HorizontalScroller,
  VerticalScroller,
  TimelineGrid
} from "@/components"

export function ClapTimeline({
  showFPS
  }: {
    showFPS?: false
  } = {
    showFPS: false
  }) {
  return (
    <div className="w-full h-full overflow-hidden bg-gray-900">
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-full h-full">
          <Canvas
             frameloop="demand"
            style={{ width: "100%", height: "100%", background: "rgb(18,24,39)" }}>
            <OrthographicCamera makeDefault position={[0, 0, 1]} />
            <TimelineControls />
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
