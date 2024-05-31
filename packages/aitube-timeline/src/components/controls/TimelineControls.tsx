import { MapControls } from "@react-three/drei"

// for doc see:
// https://threejs.org/docs/index.html?q=controls#examples/en/controls/MapControls

export function TimelineControls({
  minZoom,
  maxZoom,
  zoomSpeed,
  zoomDampingFactor,
}:{
  minZoom: number
  maxZoom: number
  zoomSpeed: number
  zoomDampingFactor: number
}) {

  // TODO: we should create a new class extending from MapControls
  // and add some custom code to put limits, to avoid going out of bounds
  // I also don't like how scroll is working on macOS, because the mouse wheel
  // creates a natural damping effect, which create an acceleration hard to stop
  // it it's hard to stop the zoom "in time"
  return (
    <MapControls
      makeDefault
      // enabled
      // minDistance={10}
      // maxDistance={10}
      minZoom={minZoom}
      maxZoom={maxZoom}

      // minPolarAngle: number;
      // maxPolarAngle: number;
      // minAzimuthAngle: number;
      // maxAzimuthAngle: number;
      enableDamping
      dampingFactor={zoomDampingFactor}

      enableZoom
      zoomSpeed={zoomSpeed}

      enableRotate={false}
      // rotateSpeed={0}
      // enablePan
      // panSpeed={1.0}
      screenSpacePanning
      // keyPanSpeed: number;
      zoomToCursor
      // autoRotate={false}
      // autoRotateSpeed={0}
      // reverseOrbit: boolean;
      // reverseHorizontalOrbit: boolean;
      // reverseVerticalOrbit: boolean;
    />
  );
};
