"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { useMonitor } from "@/controllers/monitor/useMonitor"
import { useTimeline } from "@aitube/timeline"

import { useRequestAnimationFrame } from "@/lib/hooks"
import { MonitoringMode } from "@/controllers/monitor/types"
import { useRenderLoop } from "@/controllers/renderer/useRenderLoop"
import { useRenderer } from "@/controllers/renderer/useRenderer"
import { ClapSegment } from "@aitube/clap"
import { DynamicBuffer } from "./DynamicBuffer"

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

  const {
    activeVideoSegment,
    upcomingVideoSegment,
    activeStoryboardSegment,
    upcomingStoryboardSegment
  } = useRenderer(s => s.bufferedSegments)

  const currentSegment =
    activeVideoSegment?.assetUrl
    ? activeVideoSegment
    : activeStoryboardSegment?.assetUrl
    ? activeStoryboardSegment
    : undefined
  
  // the upcoming asset we want to preload (note: we just want to preload it, not display it just yet)
  const preloadSegment =
    upcomingVideoSegment?.assetUrl
    ? upcomingVideoSegment
    : upcomingStoryboardSegment?.assetUrl
    ? upcomingStoryboardSegment
    : undefined

  const [dataUriBuffer1, setDataUriBuffer1] = useState<ClapSegment | undefined>()
  const [dataUriBuffer2, setDataUriBuffer2] = useState<ClapSegment | undefined>()
  const [activeBufferNumber, setActiveBufferNumber] = useState(1)

  const timeoutRef = useRef<NodeJS.Timeout>()

  const fadeDurationInMs = 250

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

  // performance optimization:
  // we only look at the first part since it might be huge
  // for assets, using a smaller header lookup like 256 or even 512 doesn't seem to be enough
  const currentSegmentKey = `${currentSegment?.assetUrl || ""}`.slice(0, 1024)
  const preloadSegmentKey = `${preloadSegment?.assetUrl || ""}`.slice(0, 1024)

  const dataUriBuffer1Key = `${dataUriBuffer1?.assetUrl || ""}`.slice(0, 1024)
  const dataUriBuffer2Key = `${dataUriBuffer2?.assetUrl || ""}`.slice(0, 1024)

  useEffect(() => {
    // trivial case: we are at the initial state
    if (!dataUriBuffer1 && !dataUriBuffer2) {
      setDataUriBuffer1(currentSegment)
      setDataUriBuffer2(preloadSegment)
      setActiveBufferNumber(1)
    }
  }, [
    dataUriBuffer1Key,
    dataUriBuffer2Key,
    currentSegmentKey,
    preloadSegmentKey
  ])

  useEffect(() => {

    clearTimeout(timeoutRef.current)

    const newActiveBufferNumber = activeBufferNumber === 1 ? 2 : 1
    setActiveBufferNumber(newActiveBufferNumber)

    timeoutRef.current = setTimeout(() => {
      // by now one buffer should be visible, and the other should be hidden
      // so let's update the invisible one
      if (newActiveBufferNumber === 2) {
        setDataUriBuffer1(preloadSegment)
      } else {
        setDataUriBuffer2(preloadSegment)
      }
    }, fadeDurationInMs + 200) // let's add some security in here

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [
    currentSegmentKey,
    preloadSegmentKey
  ])

  return (
    <div className={cn(`@container flex flex-col items-center flex-grow w-full`, className)}>
      <DynamicBuffer
        segment={dataUriBuffer1}
        isPlaying={isPlaying}
        isVisible={activeBufferNumber === 1}
      />
      <DynamicBuffer
        segment={dataUriBuffer2}
        isPlaying={isPlaying}
        isVisible={activeBufferNumber === 2}
      />
    </div>
  )
}