import { useEffect, useState } from "react"

import { HorizontalSlider } from "@/components/slider"
import { leftBarTrackScaleWidth } from "@/constants/themes"
import { useTimeline } from "@/hooks/useTimeline"
import { cn } from "@/utils"

export function HorizontalScroller() {
  const width = useTimeline(s => s.width)

  const timelineCamera = useTimeline(s => s.timelineCamera)
  const timelineControls = useTimeline(s => s.timelineControls)

  const minHorizontalZoomLevel = useTimeline((s) => s.minHorizontalZoomLevel)
  const maxHorizontalZoomLevel = useTimeline((s) => s.maxHorizontalZoomLevel)
  const cellWidth = useTimeline((s) => s.cellWidth)
  const setHorizontalZoomLevel = useTimeline((s) => s.setHorizontalZoomLevel)

  // we could display the cursor as an extra line, I guess
  // but the real range is the actual view window
  const cursorTimestampAtInMs = useTimeline(s => s.cursorTimestampAtInMs)
  const totalDurationInMs = useTimeline(s => s.totalDurationInMs)

  const scrollX = useTimeline(s => s.scrollX)
  const setScrollX = useTimeline(s => s.setScrollX)
  const contentWidth = useTimeline(s => s.contentWidth)
  
  const [rangeStart, setRangeStart] = useState(0)
  const [rangeEnd, setRangeEnd] = useState(10)
  const [cursor, setCursor] = useState(0)
  
  useEffect(() => {
    const cursorPosX = Math.min(cursorTimestampAtInMs, totalDurationInMs)
    const cursorStartRatio = totalDurationInMs > 0 ? (cursorPosX / totalDurationInMs) : 0.0
    
    const posX = scrollX + leftBarTrackScaleWidth
    const rangeStartRatio = contentWidth > 0 ? (posX / contentWidth) : 0.0
    const rangeEndRatio = (posX + width) > 0 ? ((posX + width) / contentWidth) : 1.0
  
    setCursor(Math.round(cursorStartRatio * width))
    setRangeStart(Math.round(rangeStartRatio * width))
    setRangeEnd(Math.round(rangeEndRatio * width))
  }, [
    // don't forget anything in here! all are important!
    width,
    cellWidth,
    cursorTimestampAtInMs,
    totalDurationInMs,
    leftBarTrackScaleWidth,
    contentWidth,
    scrollX,
  ])

  if (!timelineCamera || !timelineControls) { return null }

  const handleTimelinePositionChange = (newValue: number) => {
    setRangeStart(newValue)
    const scrollRatio = newValue / width
    const newScrollX = scrollRatio * contentWidth
    setScrollX(newScrollX)
    timelineCamera.position.setX(newScrollX)
    timelineControls.target.setX(newScrollX)
  }

  const handleZoomChange = (newZoom: number) => {
    setHorizontalZoomLevel(newZoom)
  }

  // not sure if we need this, as it is easy to just move the sliding window
  // then click on the timeline to set the cursor
  const handleClickOnMiniCursor = (newValue: number) => {
    // convert from the screen coordinates back to the camera position
    // const newCursorPositionInMs = newValue * cellWidth * DEFAULT_DURATION_IN_MS_PER_STEP
  }

  return (
    <div className="flex flex-row items-center w-full">
      <HorizontalSlider
        // defaultValue={range}
        defaultValue={[rangeStart]} 
        min={0}
        max={width}
        step={1}
        className={cn(`
          rounded-none
          border-none
          w-full
         `)}
        value={[rangeStart]}
        onValueChange={(newRange: number[]) => {
          handleTimelinePositionChange(newRange[0])
        }}
        onWheel={(e) => {
          // handleZoomChange(cellWidth + e.deltaY)
        }}
      />
      <div
        className={cn(`
          absolute
          bg-yellow-500
          h-4
          border-2
          border-yellow-500
          pointer-events-none
          `
        )}
        style={{
          marginLeft: `${cursor}px`
        }}
      />
    </div>
  )
}