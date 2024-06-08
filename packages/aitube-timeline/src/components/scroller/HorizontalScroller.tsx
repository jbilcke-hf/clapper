import { HorizontalSlider } from "@/components/slider"
import { useTimeline } from "@/hooks/useTimeline"

export function HorizontalScroller() {
  const timelineCamera = useTimeline(s => s.timelineCamera)
  const timelineControls = useTimeline(s => s.timelineControls)

  const minHorizontalZoomLevel = useTimeline((s) => s.minHorizontalZoomLevel)
  const maxHorizontalZoomLevel = useTimeline((s) => s.maxHorizontalZoomLevel)
  const cellWidth = useTimeline((s) => s.cellWidth)
  const setHorizontalZoomLevel = useTimeline((s) => s.setHorizontalZoomLevel)

  if (!timelineCamera || !timelineControls) { return null }

  const handleTimelinePositionChange = (newValue: number) => {
    timelineCamera.position.setX(newValue)
    timelineControls.target.setX(newValue)

  }

  const handleZoomChange = (newZoom: number) => {
    setHorizontalZoomLevel(newZoom)
  }
  // TODO: we want to control two things:
  // on mouse click & drag, we want to move horizontally inside the timeline
  // on mouse wheel (on hover), we want to adjust the horizontal time scale
  
  const range = [
    timelineCamera.position.x // start of the tracker
    // end of the tracker
  ]
  
  return (
     <div className="flex flex-row items-center">
       <HorizontalSlider
         defaultValue={range}
         min={0}
         max={100}
         step={1}
         className=""
         value={range}
         onValueChange={(newRange: number[]) => handleTimelinePositionChange(newRange[0])}
         onWheel={(e) => {
          handleZoomChange(cellWidth + e.deltaY)
         }}
       />
     </div>
  )
}