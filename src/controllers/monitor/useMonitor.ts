"use client"

import { create } from "zustand"
import { useTimeline } from "@aitube/timeline"

import { MonitoringMode, MonitorStore } from "./types"
import { getDefaultMonitorState } from "./getDefaultMonitorState"

export const useMonitor = create<MonitorStore>((set, get) => ({
  ...getDefaultMonitorState(),

  setMonitoringMode: (mode: MonitoringMode) => {
    set({ mode })
  },

  setStaticVideoRef: (staticVideoRef: HTMLVideoElement) => {
    set({
      mode: MonitoringMode.STATIC,
      staticVideoRef,
    })
  },

  checkIfPlaying: (): boolean => {
    return get().isPlaying
  },

  /**
   * Used to play/pause the project timeline (video and audio)
   * @param forceValue
   * @returns 
   */
  togglePlayback: (forcePlaying?: boolean): {
    wasPlaying: boolean
    isPlaying: boolean
  } => {
    const { isPlaying: wasPlaying, mode, staticVideoRef } = get()

    if (mode === MonitoringMode.NONE) {
      return {
        wasPlaying: false,
        isPlaying: false
      }
    }

    const isPlaying = typeof forcePlaying === "boolean" ? forcePlaying : !wasPlaying
    
    set({
      isPlaying
    })

    if (mode === MonitoringMode.STATIC && staticVideoRef) {
      if (isPlaying) {
        console.log(`previous value = ` + staticVideoRef.currentTime)
        staticVideoRef.play()
      } else {
        staticVideoRef.pause()
      }
    } else if (mode === MonitoringMode.DYNAMIC) {
      console.log(`TODO Julian: implement dynamic mode`)
    }

    return {
       wasPlaying,
       isPlaying
    }
  },
  jumpAt: (timeInMs: number = 0) => {
    const { isPlaying, mode, staticVideoRef } = get()

    const { setCursorTimestampAtInMs } = useTimeline.getState()

    setCursorTimestampAtInMs(timeInMs)

    if (mode === MonitoringMode.NONE || !staticVideoRef) {
      return
    }

    if (mode === MonitoringMode.STATIC) {
      // console.log("resetting static video current time")
      staticVideoRef.currentTime = timeInMs / 1000
    } else if (mode === MonitoringMode.DYNAMIC) {
      console.log(`TODO Julian: implement dynamic mode`)
    }
  },

}))