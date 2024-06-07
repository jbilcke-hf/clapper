import { useTimelineState } from "@/hooks"
import { MapControls } from "@react-three/drei"
import { TimelineControlsImpl } from "./types"
import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "@/constants/themes"
import { clamp } from "@/utils/clamp"
import { useFrame, useThree } from "@react-three/fiber"
import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@/constants"

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
  const { size } = useThree()

  // this controls the top grid ruler bar and makes it sticky
  // this works by controlling the render priority, and taking over whatever the Controls might have set
  //
  // there is a tiny issue, when we resize the camera
  // it looks like there is a delay in the size.height value,
  // or maybe the useFrame, but it doesn't resize immediately
  useFrame(({ gl, scene, camera }) => {
    let {
      clap,
      cellWidth,
      scrollX,
      scrollY,
      timelineCamera,
      timelineControls,
      timelineCursor,
      contentHeight,
      leftBarTrackScale,
      topBarTimelineScale,
      resizeStartedAt,
      width,
      height,
      cursorTimestampAt,
    } = useTimelineState.getState()

    const now = performance.now() // new Date().getTime(),
    const elapsedTimeInMs = now - resizeStartedAt

    const delayThreshold = 300
    const isResizing = elapsedTimeInMs < delayThreshold
    // console.log(`now=${now}, resizeStartedAt=${resizeStartedAt}, elapsedTimeInMs=${elapsedTimeInMs}, delayThreshold=${delayThreshold}, isResizing=${isResizing}`)
    if (!timelineCamera || !timelineControls) {
      useTimelineState.setState({ isResizing })
      return
    }

    scrollX = Math.max(-leftBarTrackScaleWidth, scrollX)

    const canvasHeight = size.height // * gl.getPixelRatio()

    //  *------------------------*
    //  |       scrollY          |         
    //  |  *---------------*     |
    //  |  |               |     |   \
    //  |  |               |     |    <--- canvasHeight
    //  |  |               |     |   /
    //  *--|---------------|-----*
    //     |               |
    //     | ------------- |
    //     |               |
    //     |               |   \
    //     |               |    <------ contentHeight (can be > or < than the canvasHeight)
    //     |               |   /
    //     |               | 
    //     *---------------*
    //

    scrollY = clamp(
      // should depend upon the current zoom level
      // if we are "high" in the sky (low zoom value)
      // then we need to to go further noth
      // now, the problem is that depends
      scrollY, // + (zoomHeight / 2),

      -60, // min value: enough to display about one row + the top bar

      900,
      /*
      // TODO: find the right formula
      size.height > 550 ? 250 :
      size.height > 500 ? 400 :
      size.height > 450 ? 450 :
      size.height > 400 ? 500 :
      size.height > 350 ? 550 :
      size.height > 300 ? 550 :
      900 // determine how far down we can move (to see more of what is up)
      */
    )
 
    // console.log(`scrollY=${Math.round(scrollY)}`)
    timelineCamera.position.setX(scrollX)
    timelineControls.target.setX(scrollX)
 
    timelineCamera.position.setY(scrollY)
    timelineControls.target.setY(scrollY)
 
    useTimelineState.setState({
      scrollX,
      scrollY,
      isResizing
    })


    if (timelineCursor) {
   
      const positionInSteps = (
        (cursorTimestampAt * 1000) / DEFAULT_DURATION_IN_MS_PER_STEP
      ) * cellWidth

      timelineCursor.position.x = positionInSteps
    }

    if (topBarTimelineScale) {
      topBarTimelineScale.position.y = (-topBarTimeScaleHeight + scrollY) + (size.height / 2)
    }

    if (leftBarTrackScale) {
      leftBarTrackScale.position.x = scrollX
    }

    gl.render(scene, camera)
  }, 1)

  
  const setTimelineControls = useTimelineState(s => s.setTimelineControls)
  // TODO: we should create a new class extending from MapControls
  // and add some custom code to put limits, to avoid going out of bounds
  // I also don't like how scroll is working on macOS, because the mouse wheel
  // creates a natural damping effect, which create an acceleration hard to stop
  // it it's hard to stop the zoom "in time"
  return (
    <MapControls
      ref={(mapControls) => {
        if (mapControls) {
          setTimelineControls(mapControls)
        }
      }}
      makeDefault
      enabled={false}
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

      // we don't need the zoom if we have powerful grom size control settings,
      // since those provide control over the X and Y zoom
      enableZoom={false}

      zoomSpeed={zoomSpeed}

      enableRotate={false}
      // rotateSpeed={0}
      enablePan
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
