// for some reason VS Code is confused when using this
// import { analyze } from "web-audio-beat-detector"

// but this one works
import { analyze } from 'web-audio-beat-detector/build/es2019/module'

export async function detectBPM(audioBuffer: AudioBuffer): Promise<number> {
  try {
    const bpm: number = await analyze(audioBuffer)

    return bpm
  } catch (err) {
    return 120
  }
}
