import { TimelineStore, useTimeline } from '@aitube/timeline'
import {
  AudioStore,
  MonitorStore,
  RendererStore,
} from '@aitube/clapper-services'

import { useRequestAnimationFrame } from '@/lib/hooks'
import { useRenderer } from './useRenderer'
import { useAudio } from '@/services/audio/useAudio'
import { useMonitor } from '../monitor/useMonitor'
import { useEffect, useRef } from 'react'
import { useSettings } from '../settings'

/**
 * Runs a rendering loop
 *
 * Should only be called onc and at the root of the app,
 * otherwise if the monitor is hidden then some operations won't work
 * (eg. the assistant won't be able to pull the currently rendered segments)
 *
 * @returns
 */
export function useRenderLoop(): void {
  const setDataUriBuffer1 = useRenderer((s) => s.setDataUriBuffer1)
  const setDataUriBuffer2 = useRenderer((s) => s.setDataUriBuffer2)

  const activeBufferNumber = useRenderer((s) => s.activeBufferNumber)
  const setActiveBufferNumber = useRenderer((s) => s.setActiveBufferNumber)

  // TODO we should simplify this
  const preloadSegment = useRenderer((s) => s.preloadSegment)
  const currentSegmentKey = useRenderer((s) => s.currentSegmentKey)
  const preloadSegmentKey = useRenderer((s) => s.preloadSegmentKey)

  const timeoutRef = useRef<NodeJS.Timeout>(null)

  const setUserDefinedRenderingStrategies = useRenderer(
    (s) => s.setUserDefinedRenderingStrategies
  )

  // those are the currently active rendering strategies determined by the renderer
  // this is different from the image rendering preferences (what the user has set)
  const imageRenderingStrategy = useSettings((s) => s.imageRenderingStrategy)
  const videoRenderingStrategy = useSettings((s) => s.videoRenderingStrategy)
  const soundRenderingStrategy = useSettings((s) => s.soundRenderingStrategy)
  const voiceRenderingStrategy = useSettings((s) => s.voiceRenderingStrategy)
  const musicRenderingStrategy = useSettings((s) => s.musicRenderingStrategy)
  useEffect(() => {
    setUserDefinedRenderingStrategies({
      imageRenderingStrategy,
      videoRenderingStrategy,
      soundRenderingStrategy,
      voiceRenderingStrategy,
      musicRenderingStrategy,
    })
  }, [
    imageRenderingStrategy,
    videoRenderingStrategy,
    soundRenderingStrategy,
    voiceRenderingStrategy,
    musicRenderingStrategy,
    setUserDefinedRenderingStrategies,
  ])

  // used to control transitions between buffers
  useEffect(() => {
    clearTimeout(timeoutRef.current!)

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
      clearTimeout(timeoutRef.current!)
    }
    // eslint-disable-next-line
  }, [currentSegmentKey, preloadSegmentKey])

  useRequestAnimationFrame(() => {
    const timeline: TimelineStore = useTimeline.getState()
    const monitor: MonitorStore = useMonitor.getState()
    const renderer: RendererStore = useRenderer.getState()
    const audio: AudioStore = useAudio.getState()

    const { isPlaying, lastTimelineUpdateAtInMs, setLastTimelineUpdateAtInMs } =
      monitor

    if (!isPlaying) {
      return
    }

    const {
      //  isPlaying,
      cursorTimestampAtInMs,
      setCursorTimestampAtInMs,
    } = timeline

    // this update the internal state of the renderer to make it hold
    // all the currently visible or hearable items
    const { activeAudioSegments } = useRenderer.getState().renderLoop()

    // now all we need to do is to update the audio
    // (well we also need to update the visuals, but it is done in <DynamicPlayer />
    audio.syncAudioToCurrentCursorPosition(activeAudioSegments)

    renderer.syncVideoToCurrentCursorPosition()

    const newTimelineUpdateAtInMs = performance.now()
    const elapsedTimeInMs = newTimelineUpdateAtInMs - lastTimelineUpdateAtInMs
    setCursorTimestampAtInMs(cursorTimestampAtInMs + elapsedTimeInMs)
    setLastTimelineUpdateAtInMs(newTimelineUpdateAtInMs)
  })
}
