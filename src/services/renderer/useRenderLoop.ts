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

/**
 * Runs a rendering loop
 *
 * Should only be called once!!
 * @returns
 */
export function useRenderLoop(): void {
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
