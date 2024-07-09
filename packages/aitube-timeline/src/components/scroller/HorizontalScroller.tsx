import { useTimeline } from "@/hooks/useTimeline"

import TimelineSlider from "../slider/TimelineSlider"

export function HorizontalScroller() {
  const theme = useTimeline(s => s.theme)

  const segments = useTimeline(s => s.segments)

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
  const totalDurationInMs = useTimeline(s => s.totalDurationInMs)

  const setScrollX = useTimeline(s => s.setScrollX)
  const contentWidth = useTimeline(s => s.contentWidth)

  const getSegmentColorScheme = useTimeline(s => s.getSegmentColorScheme)

  if (!timelineCamera || !timelineControls) { return null }

  const handleZoomChange = (newZoom: number) => {
    setHorizontalZoomLevel(newZoom)
  }

  return (
    <div className="flex flex-row items-center w-full">
      {/*
      PREVIOUS COMPONENT, NOW OBSOLETE:
      <HorizontalSlider
        defaultValue={[rangeStart, rangeEnd]} 
        min={0}
        max={width}
        step={1}
        value={[rangeStart, rangeEnd]}
        onValueChange={(newRange: number[]) => {
          handleTimelinePositionChange(newRange[0])
        }}
        onWheel={(e) => {
          // handleZoomChange(cellWidth + e.deltaY)
        }}
      />
      */}

      <TimelineSlider
        minTimeInMs={0}
        maxTimeInMs={totalDurationInMs}
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
        events={segments.map(s => ({
          id: s.id,
          track: s.track,
          startTimeInMs: s.startTimeInMs,
          endTimeInMs: s.endTimeInMs,
          color: getSegmentColorScheme(s).backgroundColor,
        }))}
        eventOpacityWhenInsideSlidingWindowRangeThumb={1.0}
        eventOpacityWhenOutsideSlidingWindowRangeThumb={0.7}
        onSlidingWindowRangeThumbUpdate={({
          slidingWindowRangeThumbStartTimeInMs,
          slidingWindowRangeThumbEndTimeInMs
        }) => {
          // we base ourself on the starting range so slidingWindowRangeThumbStartTimeInMs
          // is enough, however we could also use slidingWindowRangeThumbEndTimeInMs
          // to change the zoom factor in the timeline (@julian will implement this)

          const scrollRatio = slidingWindowRangeThumbStartTimeInMs / totalDurationInMs
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