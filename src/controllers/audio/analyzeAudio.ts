import { DEFAULT_DURATION_IN_MS_PER_STEP } from "@aitube/timeline"

import { getAudioBuffer } from "./getAudioBuffer"
import { AudioAnalysis } from "./types"
import { detectBPM } from "./detectBPM"

export async function analyzeAudio(file: File): Promise<AudioAnalysis> {
  const audioBuffer = await getAudioBuffer(file)
  const durationInMs = audioBuffer.duration * 1000
  const durationInSteps = Math.ceil(durationInMs / DEFAULT_DURATION_IN_MS_PER_STEP)

  try {
    const bpm = await detectBPM(audioBuffer)
 
    return {
      audioBuffer,
      bpm,
      durationInMs,
      durationInSteps
    }
  } catch (err) {
    console.error(`failed to detect the BPM will fall back to 120 BPM (${err})`)
    return {
      audioBuffer,
      bpm: 120,
      durationInMs,
      durationInSteps
    }
  }
}