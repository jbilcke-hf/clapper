import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import mediaInfoFactory, {
  Track,
  GeneralTrack,
  VideoTrack,
  AudioTrack,
  TextTrack,
  ImageTrack,
  MenuTrack,
  OtherTrack,
} from 'mediainfo.js'

interface FrameExtractorOptions {
  format: 'png' | 'jpg'
  maxWidth: number
  maxHeight: number
  sceneSamplingRate: number // Percentage of additional frames between scene changes (0-100)
  onProgress?: (progress: number) => void // Callback function for progress updates
}

async function extractFramesFromVideo(
  videoBlob: Blob,
  options: FrameExtractorOptions
): Promise<string[]> {
  // Initialize MediaInfo
  const mediaInfo = await mediaInfoFactory({ format: 'object' })

  // Get video duration using MediaInfo
  const getSize = () => videoBlob.size
  const readChunk = (chunkSize: number, offset: number) =>
    new Promise<Uint8Array>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(event.target.result))
        } else {
          reject(new Error('Failed to read chunk'))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(videoBlob.slice(offset, offset + chunkSize))
    })

  const result = await mediaInfo.analyzeData(getSize, readChunk)

  let duration: number = 0

  for (const track of result.media?.track || []) {
    ///  '@type': "General" | "Video" | "Audio" | "Text" | "Image" | "Menu" | "Other"
    let maybeDuration: number = 0
    if (track['@type'] === 'Audio') {
      const audioTrack = track as AudioTrack
      maybeDuration = audioTrack.Duration || 0
    } else if (track['@type'] === 'Video') {
      const videoTrack = track as VideoTrack
      maybeDuration = videoTrack.Duration || 0
    }
    if (
      typeof maybeDuration === 'number' &&
      isFinite(maybeDuration) &&
      !isNaN(maybeDuration)
    ) {
      duration = maybeDuration
    }
  }

  if (!duration) {
    throw new Error('Could not determine video duration (or it is length 0)')
  }

  // Initialize FFmpeg
  const ffmpeg = new FFmpeg()
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })

  // Write video file to FFmpeg's file system
  const videoUint8Array = new Uint8Array(await videoBlob.arrayBuffer())
  await ffmpeg.writeFile('input.mp4', videoUint8Array)

  // Prepare FFmpeg command
  const sceneFilter = `select='gt(scene,0.4)'`
  const additionalFramesFilter = `select='not(mod(n,${Math.floor(100 / options.sceneSamplingRate)}))'`
  const scaleFilter = `scale=iw*min(${options.maxWidth}/iw\,${options.maxHeight}/ih):ih*min(${options.maxWidth}/iw\,${options.maxHeight}/ih)`

  let lastProgress = 0
  ffmpeg.on('log', ({ message }) => {
    const timeMatch = message.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/)
    if (timeMatch) {
      const [, hours, minutes, seconds] = timeMatch
      const currentTime =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds)
      const progress = Math.min(100, Math.round((currentTime / duration) * 100))
      if (progress > lastProgress) {
        lastProgress = progress
        options.onProgress?.(progress)
      }
    }
  })

  await ffmpeg.exec([
    '-i',
    'input.mp4',
    '-vf',
    `${sceneFilter},${additionalFramesFilter},${scaleFilter}`,
    '-vsync',
    '0',
    '-q:v',
    '2',
    `frames_%03d.${options.format}`,
  ])

  // Read generated frames
  const files = await ffmpeg.listDir('/')
  const frameFiles = files.filter(
    (file) =>
      file.name.startsWith('frames_') &&
      file.name.endsWith(`.${options.format}`)
  )

  const frames: string[] = []
  for (let i = 0; i < frameFiles.length; i++) {
    const file = frameFiles[i]
    const frameData = await ffmpeg.readFile(file.name)
    const base64Frame = btoa(
      String.fromCharCode.apply(null, frameData as unknown as number[])
    )
    frames.push(`data:image/${options.format};base64,${base64Frame}`)

    // Update progress for frame processing (from 90% to 100%)
    options.onProgress?.(90 + Math.round(((i + 1) / frameFiles.length) * 10))
  }

  return frames
}

export default extractFramesFromVideo
