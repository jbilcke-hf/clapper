import { OrthographicCamera } from "@react-three/drei"

import { useTimelineState } from "@/hooks"

export function TimelineCamera() {
  const setTimelineCamera = useTimelineState(s => s.setTimelineCamera)
  return (
  <OrthographicCamera
    ref={(ortographicCamera) => {
      if (ortographicCamera) {
        setTimelineCamera(ortographicCamera)
      }
    }}
    makeDefault
    position={[0, 0, 1]}
    />
  )      
}