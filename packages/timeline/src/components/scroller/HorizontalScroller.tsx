import { useMemo } from "react"

import { useTimeline } from "@/hooks/useTimeline"
import { getSegmentColorScheme } from "@/utils/getSegmentColorScheme"


import TimelineSlider from "../slider/TimelineSlider"

export function HorizontalScroller() {
  const theme = useTimeline(s => s.theme)

  const containerWidth = useTimeline(s => s.containerWidth)

  const segments = useTimeline(s => s.segments)

  const atLeastOneSegmentChanged = useTimeline(s => s.atLeastOneSegmentChanged)

  const timelineCamera = useTimeline(s => s.timelineCamera)
  const timelineControls = useTimeline(s => s.timelineControls)

  // note: those do two different things:
  // move the actual "physical" cursor (with setCursorTimestampAtInMs())
  // and trigger a callback to ask the parent app to do something (eg. jump/seek into the timeline)
  const setCursorTimestampAtInMs = useTimeline(s => s.setCursorTimestampAtInMs)
  const jumpAt = useTimeline(s => s.jumpAt)

  const setHorizontalZoomLevel = useTimeline((s) => s.setHorizontalZoomLevel)

  // we could display the cursor as an extra line, I guess
  // but the real range is the actual view window
  const cursorTimestampAtInMs = useTimeline(s => s.cursorTimestampAtInMs)
  const durationInMs = useTimeline(s => s.durationInMs)

  const setScrollX = useTimeline(s => s.setScrollX)
  const contentWidth = useTimeline(s => s.contentWidth)

  const cachedSegments = useMemo(() => segments, [atLeastOneSegmentChanged, containerWidth, contentWidth])
  
  if (!timelineCamera || !timelineControls) { return null }

  // TODO: we need to be able to change the zoom level from the horizontal scroller
  const handleZoomChange = (newZoom: number) => {
    setHorizontalZoomLevel(newZoom)
  }

  return (
    <div className="flex flex-row items-center w-full">
      <TimelineSlider
        minTimeInMs={0}
        maxTimeInMs={durationInMs}
        currentPlaybackCursorPosition={cursorTimestampAtInMs}
        playbackCursorPositionColor={theme.playbackCursor.lineColor}
        playbackCursorPositionWidthInPx={2}
        allowPlaybackCursorToBeDragged={true}
        slidingWindowRangeThumbStartTimeInMs={0}
        slidingWindowRangeThumbEndTimeInMs={16000}
        allowSlidingWindowRangeThumbResizeOnMouseWheel={false}
        mouseWheelSensibility={1.0}
        minSlidingWindowRangeThumbWidthInPx={8}
        slidingWindowRangeThumbBorderColor="rgba(255,255,255,0.2)"
        slidingWindowRangeThumbBorderRadiusInPx={2}
        slidingWindowRangeThumbBackgroundColor="rgba(0,123,123,0.2)"
        className="w-full h-14"
        segments={cachedSegments}
        segmentOpacityWhenInsideSlidingWindowRangeThumb={1.0}
        segmentOpacityWhenOutsideSlidingWindowRangeThumb={0.7}
        onSlidingWindowRangeThumbUpdate={({
          slidingWindowRangeThumbStartTimeInMs,
          slidingWindowRangeThumbEndTimeInMs
        }) => {
          // we base ourself on the starting range so slidingWindowRangeThumbStartTimeInMs
          // is enough, however we could also use slidingWindowRangeThumbEndTimeInMs
          // to change the zoom factor in the timeline (@julian will implement this)

          const scrollRatio = slidingWindowRangeThumbStartTimeInMs / durationInMs
          const newScrollX = scrollRatio * contentWidth
          setScrollX(newScrollX)
          timelineCamera.position.setX(newScrollX)
          timelineControls.target.setX(newScrollX)
        }}
        onPlaybackCursorUpdate={({ playbackCursorPositionInMs }) => {
          // note: those do two different things:
          // move the actual "physical" cursor (with setCursorTimestampAtInMs())
          // and trigger a callback to ask the parent app to do something (eg. jump/seek into the timeline)
          setCursorTimestampAtInMs(playbackCursorPositionInMs)
          jumpAt(playbackCursorPositionInMs)
        }}
      />
    </div>
  )
}