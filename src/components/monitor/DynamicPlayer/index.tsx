"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { useMonitor } from "@/controllers/monitor/useMonitor"

import { MonitoringMode } from "@/controllers/monitor/types"
import { useRenderLoop } from "@/controllers/renderer/useRenderLoop"
import { useRenderer } from "@/controllers/renderer/useRenderer"
import { DynamicBuffer } from "./DynamicBuffer"

export const DynamicPlayer = ({
  className,
}: {
  className?: string
}) => {  
  const isPlaying = useMonitor(s => s.isPlaying)
  const setMonitoringMode = useMonitor(s => s.setMonitoringMode)


  // this should only be called once and at only one place in the project,
  useRenderLoop()

  const dataUriBuffer1 = useRenderer(s => s.dataUriBuffer1)
  const dataUriBuffer2 = useRenderer(s => s.dataUriBuffer2)
  const setDataUriBuffer1 = useRenderer(s => s.setDataUriBuffer1)
  const setDataUriBuffer2 = useRenderer(s => s.setDataUriBuffer2)

  const activeBufferNumber = useRenderer(s => s.activeBufferNumber)
  const setActiveBufferNumber = useRenderer(s => s.setActiveBufferNumber)

  // TODO we should simplify this
  const preloadSegment = useRenderer(s => s.preloadSegment)
  const currentSegmentKey = useRenderer(s => s.currentSegmentKey)
  const preloadSegmentKey = useRenderer(s => s.preloadSegmentKey)

  const timeoutRef = useRef<NodeJS.Timeout>()


  useEffect(() => {
    setMonitoringMode(MonitoringMode.DYNAMIC)
  }, [])


  // used to control transitions between buffers
  useEffect(() => {

    clearTimeout(timeoutRef.current)

    const newActiveBufferNumber = activeBufferNumber === 1 ? 2 : 1
    setActiveBufferNumber(newActiveBufferNumber)

    // the expected fade duration time is 100ms
    // but let's add some security in here
    const fadeDurationInMs = 400

    // this intervert the buffers
    timeoutRef.current = setTimeout(() => {
      // by now one buffer should be visible, and the other should be hidden
      // so let's update the invisible one
      if (newActiveBufferNumber === 2) {
        setDataUriBuffer1(preloadSegment)
      } else {
        setDataUriBuffer2(preloadSegment)
      }
    }, fadeDurationInMs)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [
    currentSegmentKey,
    preloadSegmentKey
  ])

  return (
    <div className={cn(`
    @container flex flex-col items-center flex-grow w-full
    `, className)}>
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