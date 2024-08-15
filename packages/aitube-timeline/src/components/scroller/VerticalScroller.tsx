import { useThree } from "@react-three/fiber"

import { VerticalSlider } from "@/components/slider"
import { useTimeline } from "@/hooks/useTimeline"

export function VerticalScroller() {
  const timelineCamera = useTimeline(s => s.timelineCamera)
  const timelineControls = useTimeline(s => s.timelineControls)

  const cellWidth = useTimeline((s) => s.cellWidth)
  const setHorizontalZoomLevel = useTimeline((s) => s.setHorizontalZoomLevel)

  // TODO: we want to control two things:
  // on mouse click & drag, we want to move horizontally inside the timeline
  // on mouse wheel (on hover), we want to adjust the horizontal time scale
  
  if (!timelineCamera || !timelineControls) { return null }

  const handleScrollChange = (newValue: number) => {
    
  }

  const value = timelineCamera.zoom ? (timelineCamera.position.y / timelineCamera.zoom) : timelineCamera.position.y

  return (
   <>
     <div className="flex flex-col items-center w-8">
       <VerticalSlider
         defaultValue={[value]}
         min={0}
         max={100}
         step={1}
         className=""
         value={[value]}
         onValueChange={(newRange: number[]) => handleScrollChange(newRange[0])}

       />
     </div>
   </>
  )
}