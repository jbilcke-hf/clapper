import { readFileAsArrayBuffer } from "./readFileAsArrayBuffer"

export async function getAudioBuffer(input: File | string): Promise<AudioBuffer> {
  const audioContext = new AudioContext() // initialize AudioContext
  const arrayBuffer = await readFileAsArrayBuffer(input)
  
  // decode audio data from your arrayBuffer
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      resolve(buffer)
    }, (err) => {
      reject(err)
    })
  })
}