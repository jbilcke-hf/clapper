import { AudioState } from "./types"

export function getDefaultAudioState(): AudioState {

  const audioContext = typeof AudioContext !== "undefined"
    ? (new AudioContext())
    : undefined as unknown as AudioContext

  if (!audioContext) {
    console.log("Note: the audio context isn't available in the current environment")
  }
  
  const state: AudioState = {
    isMuted: false,
    audioContext,
    currentlyPlaying: [],
  }

  return state
}
