import { HorizontalSlider } from "@/components/slider"
import { useTimelineState } from "@/hooks/useTimelineState"

export function HorizontalScroller() {
  const timelineCamera = useTimelineState(s => s.timelineCamera)
  const timelineControls = useTimelineState(s => s.timelineControls)

  const minHorizontalZoomLevel = useTimelineState((s) => s.minHorizontalZoomLevel)
  const maxHorizontalZoomLevel = useTimelineState((s) => s.maxHorizontalZoomLevel)
  const cellWidth = useTimelineState((s) => s.cellWidth)
  const setHorizontalZoomLevel = useTimelineState((s) => s.setHorizontalZoomLevel)

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