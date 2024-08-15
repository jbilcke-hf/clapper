import { OrthographicCamera } from "@react-three/drei"

import { useTimeline } from "@/hooks"

export function TimelineCamera() {
  const setTimelineCamera = useTimeline(s => s.setTimelineCamera)
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