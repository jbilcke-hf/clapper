import { AudioState } from '@aitube/clapper-services'

export function getDefaultAudioState(): AudioState {
  const audioContext =
    typeof AudioContext !== 'undefined'
      ? new AudioContext()
      : (undefined as unknown as AudioContext)

  if (!audioContext) {
    console.log(
      "Note: the audio context isn't available in the current environment"
    )
  }

  const state: AudioState = {
    isPlaying: false,
    isMuted: false,
    userDefinedGain: 1.0,
    currentGain: 1.0,
    audioContext,
    currentlyPlaying: [],
  }

  return state
}
