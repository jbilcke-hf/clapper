"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { useMonitor } from "@/controllers/monitor/useMonitor"
import { useTimeline } from "@aitube/timeline"

import { useRequestAnimationFrame } from "@/lib/hooks"
import { MonitoringMode } from "@/controllers/monitor/types"
import { VideoClipBuffer } from "./VideoClipBuffer"
import { useRenderLoop } from "@/controllers/renderer/useRenderLoop"
import { useRenderer } from "@/controllers/renderer/useRenderer"

export const DynamicPlayer = ({
  className,
}: {
  className?: string
}) => {  
  const isPlaying = useMonitor(s => s.isPlaying)
  const setMonitoringMode = useMonitor(s => s.setMonitoringMode)

  const setCursorTimestampAtInMs = useTimeline(s => s.setCursorTimestampAtInMs)

  // this should only be called once and at only one place in the project!
  useRenderLoop()

  const { activeVideoSegment, upcomingVideoSegment } = useRenderer(s => s.bufferedSegments)

  const currentVideoUrl = activeVideoSegment?.assetUrl || ""

  // the upcoming video we want to preload (note: we just want to preload it, not display it just yet)
  const preloadVideoUrl = upcomingVideoSegment?.assetUrl || ""

  const [buffer1Value, setBuffer1Value] = useState("")
  const [buffer2Value, setBuffer2Value] = useState("")
  const [activeBufferNumber, setActiveBufferNumber] = useState(1)

  const timeoutRef = useRef<NodeJS.Timeout>()

  const fadeDurationInMs = 300

  useEffect(() => {
    setMonitoringMode(MonitoringMode.DYNAMIC)
  }, [])

  useRequestAnimationFrame(() => {
    const { isPlaying, lastTimelineUpdateAtInMs, setLastTimelineUpdateAtInMs } = useMonitor.getState()
    if (!isPlaying) { return }
    const { cursorTimestampAtInMs } = useTimeline.getState()
    const newTimelineUpdateAtInMs = performance.now()
    const elapsedTimeInMs = newTimelineUpdateAtInMs - lastTimelineUpdateAtInMs
    // console.log(`TODO: move the timeline cursor according to the elapsed time`)
    setCursorTimestampAtInMs(cursorTimestampAtInMs + elapsedTimeInMs)
    setLastTimelineUpdateAtInMs(newTimelineUpdateAtInMs)

  })

  useEffect(() => {
    // trivial case: we are at the initial state
    if (!buffer1Value && !buffer2Value) {
      setBuffer1Value(currentVideoUrl)
      setBuffer2Value(preloadVideoUrl)
      setActiveBufferNumber(1)
    }
  }, [buffer1Value, currentVideoUrl, preloadVideoUrl])


  // console.log("cursorInSteps:", cursorInSteps)
  useEffect(() => {
    /*
    console.log("ATTENTION: something changed among those: ", {
      currentVideoUrl, preloadVideoUrl
    })
    */

    clearTimeout(timeoutRef.current)

    const newActiveBufferNumber = activeBufferNumber === 1 ? 2 : 1
    // console.log(`our pre-loaded video should already be available in buffer ${newActiveBufferNumber}`)

    setActiveBufferNumber(newActiveBufferNumber)

    timeoutRef.current = setTimeout(() => {
      // by now one buffer should be visible, and the other should be hidden
      // so let's update the invisible one
      if (newActiveBufferNumber === 2) {
        setBuffer1Value(preloadVideoUrl)
      } else {
        setBuffer2Value(preloadVideoUrl)
      }
    }, fadeDurationInMs + 200) // let's add some security in here

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [currentVideoUrl, preloadVideoUrl])

  return (
    <div className={cn(`@container flex flex-col flex-grow w-full`, className)}>
      <VideoClipBuffer
        src={buffer1Value}
        isPlaying={isPlaying}
        className={cn(activeBufferNumber === 1 ? `opacity-100` : `opacity-0`)}
      />
      <VideoClipBuffer
        src={buffer2Value}
        isPlaying={isPlaying}
        className={cn(activeBufferNumber === 2 ? `opacity-100` : `opacity-0`)}
      />
    </div>
  )
}