
export type AudioAnalysis = {
  audioBuffer: AudioBuffer
  bpm: number
  durationInMs: number
  durationInSteps: number
}

export type AudioState = {
  isMuted: boolean
  audioContext: AudioContext // we keep a single audio context
  currentlyPlaying: CurrentlyPlayingAudioSource[]
}

export type AudioControls = {
}

export type AudioStore = AudioState & AudioControls
/**
 * This is the data structure used to keep track of currently played audio nodes
 */
export type CurrentlyPlayingAudioSource = {
  /**
   * The unique ID associated with this audio source
   * 
   * This exists because the same segment might can be present multiple times
   * 
   * Eg. the same "cymbal crash" sound might be triggered multiple times
   */
  sourceId: string

  /**
   * The segment being played (this is for identification so we only need the ID)
   */
  segmentId: string

  /**
   * The actual source node (this allows us to call .stop() on it)
   */
  sourceNode: AudioScheduledSourceNode

  /**
   * The gain node, to control the volume
   * 
   * Note that for the moment, we do not persist the changes to the gain,
   * but this is something we should do since it is part of the project data
   */

  gainNode: GainNode
}