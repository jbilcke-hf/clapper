import { useRequestAnimationFrame } from "@/lib/hooks"
import { useRenderer } from "./useRenderer"
import { useAudio } from "@/controllers/audio/useAudio"
import { useMonitor } from "../monitor/useMonitor"

/**
 * Runs a rendering loop
 * 
 * Should only be called once!!
 * @returns 
 */
export function useRenderLoop(): void {
  useRequestAnimationFrame(() => {
    if (!useMonitor.getState().isPlaying) { return }
    // this update the internal state of the renderer to make it hold
    // all the currently visible or hearable items
    const { activeAudioSegments } = useRenderer.getState().renderLoop()

    // now all we need to do is to update the audio
    // (well we also need to update the visuals, but it is done in <DynamicPlayer />
    useAudio.getState().syncAudioToCurrentCursorPosition(activeAudioSegments)
  })
}