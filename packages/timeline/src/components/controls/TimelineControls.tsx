import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { MapControls } from "@react-three/drei"

import { leftBarTrackScaleWidth, topBarTimeScaleHeight } from "@/constants/themes"
import { useTimeline } from "@/hooks"
import { clamp } from "@/utils/clamp"


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
  const { size, camera, invalidate } = useThree()
  const setInvalidate = useTimeline(s => s.setInvalidate)
  const timelineControls = useTimeline(s => s.timelineControls)
  const setTimelineControls = useTimeline(s => s.setTimelineControls)
  const initialPinchDistanceRef = useRef<number | null>(null)

  useEffect(() => {
    setInvalidate(invalidate)
  }, [invalidate, setInvalidate])

  useEffect(() => {
    if (!timelineControls || !camera) return

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]
        initialPinchDistanceRef.current = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        )
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2 && initialPinchDistanceRef.current !== null) {
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        )
        const delta = (currentDistance - initialPinchDistanceRef.current) * 0.01

        // Manually adjust the camera zoom
        const newZoom = camera.zoom * (1 + delta * zoomSpeed)
        camera.zoom = clamp(newZoom, minZoom, maxZoom)
        camera.updateProjectionMatrix()

        // Update the controls target and position
        if (timelineControls.target && timelineControls.object) {
          const zoomChange = camera.zoom / timelineControls.object.zoom
          timelineControls.target.sub(timelineControls.object.position).multiplyScalar(1 - zoomChange).add(timelineControls.object.position)
          timelineControls.object.zoom = camera.zoom
          timelineControls.object.updateProjectionMatrix()
          timelineControls.update()
        }

        initialPinchDistanceRef.current = currentDistance
      }
    }

    const domElement = timelineControls.domElement

    if (!domElement) { return }

    domElement.addEventListener('touchstart', handleTouchStart, { passive: false })
    domElement.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      domElement.removeEventListener('touchstart', handleTouchStart)
      domElement.removeEventListener('touchmove', handleTouchMove)
    }
  }, [timelineControls, camera, zoomSpeed, minZoom, maxZoom])


  // this controls the top grid ruler bar and makes it sticky
  // this works by controlling the render priority, and taking over whatever the Controls might have set
  //
  // there is a tiny issue, when we resize the camera
  // it looks like there is a delay in the size.height value,
  // or maybe the useFrame, but it doesn't resize immediately
  useFrame(({ gl, scene, camera }) => {
    let {
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
      -topBottomSize, // to take to top time scroll bar into account
     
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
        (cursorTimestampAtInMs) / useTimeline.getState().durationInMsPerStep
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

      // I don't remember why we put enabled false here
      enabled

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

      touches={{
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN
      }}
    />
  );
};
