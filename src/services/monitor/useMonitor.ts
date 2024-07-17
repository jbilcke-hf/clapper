'use client'

import { create } from 'zustand'
import { ClapSegment } from '@aitube/clap'
import { TimelineStore, useTimeline } from '@aitube/timeline'
import {
  MonitoringMode,
  MonitorStore,
  RendererStore,
} from '@aitube/clapper-services'

import { useAudio } from '../audio/useAudio'
import { getDefaultMonitorState } from './getDefaultMonitorState'
import { useRenderer } from '../renderer'

export const useMonitor = create<MonitorStore>((set, get) => ({
  ...getDefaultMonitorState(),

  bindShortcuts: () => {
    if (get().shortcutsAreBound) {
      return
    }

    document.addEventListener('keydown', (event) => {
      const element = event.target as unknown as HTMLElement

      if (
        event.code === 'Space' &&
        // those exception are important, otherwise we won't be able to add spaces
        // in the search boxes, edit fields, or even the script editor
        element.nodeName !== 'INPUT' &&
        element.nodeName !== 'TEXTAREA'
      ) {
        console.log(
          '[SHORTCUT DETECTED] User pressed space key outside a text input: toggling video playback'
        )

        // prevent the default behavior, which is strange (automatic scroll to the buttom)
        // https://www.jankollars.com/posts/preventing-space-scrolling/
        event.preventDefault()

        get().togglePlayback()
      }
    })

    set({
      shortcutsAreBound: true,
    })
  },
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
  togglePlayback: (
    forcePlaying?: boolean
  ): {
    wasPlaying: boolean
    isPlaying: boolean
  } => {
    const { isPlaying: wasPlaying, mode, staticVideoRef } = get()
    const { play, stop } = useAudio.getState()

    if (mode === MonitoringMode.NONE) {
      set({
        isPlaying: false,
        lastTimelineUpdateAtInMs: performance.now(),
      })
      return {
        wasPlaying: false,
        isPlaying: false,
      }
    }

    const isPlaying =
      typeof forcePlaying === 'boolean' ? forcePlaying : !wasPlaying

    if (mode === MonitoringMode.STATIC && staticVideoRef) {
      if (isPlaying) {
        //  console.log(`previous value = ` + staticVideoRef.currentTime)
        staticVideoRef.play()
      } else {
        staticVideoRef.pause()
      }
    } else if (mode === MonitoringMode.DYNAMIC) {
      // console.log(`TODO Julian: implement dynamic mode`)
      if (isPlaying) {
        // restart audio
        play()
      } else {
        stop()
      }
    }

    set({
      isPlaying,
      lastTimelineUpdateAtInMs: performance.now(),
    })

    return {
      wasPlaying,
      isPlaying,
    }
  },
  jumpAt: (timeInMs: number = 0) => {
    const monitor: MonitorStore = get()
    const renderer: RendererStore = useRenderer.getState()
    const timeline: TimelineStore = useTimeline.getState()

    const { isPlaying, mode, staticVideoRef } = monitor
    const { renderLoop } = renderer
    const { setCursorTimestampAtInMs, cursorTimestampAtInMs } = timeline

    if (cursorTimestampAtInMs !== timeInMs) {
      setCursorTimestampAtInMs(timeInMs)
    }

    if (mode === MonitoringMode.NONE) {
      return
    }

    if (mode === MonitoringMode.STATIC) {
      if (!staticVideoRef) {
        return
      }
      // console.log("resetting static video current time")
      staticVideoRef.currentTime = timeInMs / 1000
    } else if (mode === MonitoringMode.DYNAMIC) {
      // we force a full state recompute
      // and we also pass jumpedSomewhere=true to indicate that we
      // need a buffer transition
      renderLoop(true)
    }
  },

  setLastTimelineUpdateAtInMs: (lastTimelineUpdateAtInMs: number) => {
    set({ lastTimelineUpdateAtInMs })
  },
}))

setTimeout(() => {
  if (typeof document !== 'undefined') {
    useMonitor.getState().bindShortcuts()
  }
}, 0)
