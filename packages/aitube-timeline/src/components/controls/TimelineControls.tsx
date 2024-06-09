import { useTimeline } from "@/hooks"
import { MapControls } from "@react-three/drei"
import { TimelineControlsImpl } from "./types"
import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "@/constants/themes"
import { clamp } from "@/utils/clamp"
import { useFrame, useThree } from "@react-three/fiber"
import { DEFAULT_DURATION_IN_MS_PER_STEP, PROMPT_STEP_HEIGHT_IN_PX } from "@/constants"

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
      topBarTimeScale,
      resizeStartedAt,
      width,
      height,
      cursorTimestampAtInMs,
    } = useTimeline.getState()

    const now = performance.now() // new Date().getTime(),
    const elapsedTimeInMs = now - resizeStartedAt

    const delayThreshold = 300
    const isResizing = elapsedTimeInMs < delayThreshold
    // console.log(`now=${now}, resizeStartedAt=${resizeStartedAt}, elapsedTimeInMs=${elapsedTimeInMs}, delayThreshold=${delayThreshold}, isResizing=${isResizing}`)
    if (!timelineCamera || !timelineControls) {
      useTimeline.setState({ isResizing })
      return
    }

    scrollX = Math.max(-leftBarTrackScaleWidth, scrollX)

    /*
    const topBottomSize = (size.height > canvasHeight)
     ? ((size.height / 2) - (canvasHeight / 2))
     : ((canvasHeight / 2) - (size.height / 2))
    */


    const calculateTopBottomSizeSmooth = (height: number): number => {
      // note: contentHeight seems to depends on cellWidth zoop,
      // because when we change the horizontal "zoom" (the cellWidth)
      // this messes up our calculation
      const maxHeight = Math.max(670, contentHeight) // 820
      const minHeight = 0
      const maxTopBottomSize = maxHeight / 2
      if (height >= maxHeight) {
        return 0
      } else {
        const normalizedHeight = (height - minHeight) / (maxHeight - minHeight)

        return Math.max(0, maxTopBottomSize - (normalizedHeight * maxTopBottomSize))
      }
    };
  

    // if you find the exact formula, please submit a PR!
    const topBottomSize = calculateTopBottomSizeSmooth(size.height)  

    // console.log(`size.height=${size.height} contentHeight=${contentHeight} topBottomSize=${topBottomSize}`)
    scrollY = clamp(
      scrollY,

      // if you want to change those, fine,
      // but make sure the timeline still works properly when you change its height,
      // horizontal zoom, and number of tracks 
      -topBottomSize + PROMPT_STEP_HEIGHT_IN_PX, // to take to top time scroll bar into account
     
      // the +38px as here to represent the top scroll bar,
      // but I'm not so sure we need it anymore?
      topBottomSize //+ 38,
    )
 
    // console.log(`scrollY=${Math.round(scrollY)}`)
    timelineCamera.position.setX(scrollX)
    timelineControls.target.setX(scrollX)
 
    timelineCamera.position.setY(scrollY)
    timelineControls.target.setY(scrollY)
 
    useTimeline.setState({
      scrollX,
      scrollY,
      isResizing
    })


    if (timelineCursor) {
   
      timelineCursor.position.x = (
        (cursorTimestampAtInMs) / DEFAULT_DURATION_IN_MS_PER_STEP
      ) * cellWidth
    }

    if (topBarTimeScale) {
      topBarTimeScale.position.y = (-topBarTimeScaleHeight + scrollY) + (size.height / 2)
    }

    if (leftBarTrackScale) {
      leftBarTrackScale.position.x = scrollX
    }

    gl.render(scene, camera)
  }, 1)

  
  const setTimelineControls = useTimeline(s => s.setTimelineControls)
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
