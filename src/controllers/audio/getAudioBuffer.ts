import { readFileAsArrayBuffer } from "./readFileAsArrayBuffer"

export async function getAudioBuffer(file: File): Promise<AudioBuffer> {
  const audioContext = new AudioContext() // initialize AudioContext
  const arrayBuffer = await readFileAsArrayBuffer(file)
  
  // decode audio data from your arrayBuffer
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      resolve(buffer)
    }, (err) => {
      reject(err)
    })
  })
}