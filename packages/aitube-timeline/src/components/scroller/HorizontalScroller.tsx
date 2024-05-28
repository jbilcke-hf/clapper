import { HorizontalSlider } from "@/components/slider"
import { useTimelineState } from "@/hooks/useTimelineState"

export function HorizontalScroller() {
 const minHorizontalZoomLevel = useTimelineState((s) => s.minHorizontalZoomLevel)
  const maxHorizontalZoomLevel = useTimelineState((s) => s.maxHorizontalZoomLevel)
  const horizontalZoomLevel = useTimelineState((s) => s.horizontalZoomLevel)
  const setHorizontalZoomLevel = useTimelineState((s) => s.setHorizontalZoomLevel)

  const handleZoomChange = (newRange: number[]) => {
    setHorizontalZoomLevel(newRange[0])
  }

  // TODO: we want to control two things:
  // on mouse click & drag, we want to move horizontally inside the timeline
  // on mouse wheel (on hover), we want to adjust the horizontal time scale
  
  return (
   <>
     <div className="flex flex-row items-center">
       <HorizontalSlider
         defaultValue={[horizontalZoomLevel]}
         min={minHorizontalZoomLevel}
         max={maxHorizontalZoomLevel}
         step={1}
         className=""
         value={[horizontalZoomLevel]}
         onValueChange={handleZoomChange}
         onWheel={(e) => {
          console.log("HorizontalTimelineSlider: received a mouse wheel event:", {
            deltaX: e.deltaX,
            deltaY: e.deltaY,
            z: e.deltaZ
          })
         }}
       />
     </div>
   </>
  )
}