'use client'

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
  debug?: boolean
}

export async function extractFramesFromVideo(
  videoBlob: Blob,
  options: FrameExtractorOptions
): Promise<string[]> {
  // Initialize MediaInfo
  const mediaInfo = await mediaInfoFactory({
    format: 'object',
    locateFile: () => {
      return '/wasm/MediaInfoModule.wasm'
    },
  })

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

  if (options.debug) {
    console.log('calling await mediaInfo.analyzeData(getSize, readChunk)')
  }

  const result = await mediaInfo.analyzeData(getSize, readChunk)
  if (options.debug) {
    console.log('result = ', result)
  }

  let duration: number = 0

  for (const track of result.media?.track || []) {
    if (options.debug) {
      console.log('track = ', track)
    }

    let maybeDuration: number = 0
    if (track['@type'] === 'Audio') {
      const audioTrack = track as AudioTrack
      maybeDuration = audioTrack.Duration
        ? parseFloat(`${audioTrack.Duration || 0}`)
        : 0
    } else if (track['@type'] === 'Video') {
      const videoTrack = track as VideoTrack
      maybeDuration = videoTrack.Duration
        ? parseFloat(`${videoTrack.Duration || 0}`)
        : 0
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

  if (options.debug) {
    console.log('duration in seconds:', duration)
  }

  // Initialize FFmpeg
  const ffmpeg = new FFmpeg()
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })

  if (options.debug) {
    console.log('FFmpeg loaded!')
  }

  // Write video file to FFmpeg's file system
  const videoUint8Array = new Uint8Array(await videoBlob.arrayBuffer())
  await ffmpeg.writeFile('input.mp4', videoUint8Array)
  if (options.debug) {
    console.log('input.mp4 written!')
  }
  // Prepare FFmpeg command
  const sceneFilter = `select='gt(scene,0.4)'`
  const additionalFramesFilter = `select='not(mod(n,${Math.floor(100 / options.sceneSamplingRate)}))'`
  const scaleFilter = `scale='min(${options.maxWidth},iw)':min'(${options.maxHeight},ih)':force_original_aspect_ratio=decrease`

  let lastProgress = 0
  ffmpeg.on('log', ({ message }) => {
    if (options.debug) {
      console.log('FFmpeg log:', message)
    }
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

  const ffmpegCommand = [
    '-i',
    'input.mp4',
    '-loglevel',
    'verbose',
    '-vf',
    `${sceneFilter},${additionalFramesFilter},${scaleFilter}`,
    '-vsync',
    '2',
    '-q:v',
    '2',
    '-f',
    'image2',
    '-frames:v',
    '1000', // Limit the number of frames to extract
    `frames_%03d.${options.format}`,
  ]

  if (options.debug) {
    console.log('Executing FFmpeg command:', ffmpegCommand.join(' '))
  }

  try {
    await ffmpeg.exec(ffmpegCommand)
  } catch (error) {
    console.error('FFmpeg execution error:', error)
    throw error
  }

  // Read generated frames
  const files = await ffmpeg.listDir('/')
  if (options.debug) {
    console.log('All files in FFmpeg filesystem:', files)
  }
  const frameFiles = files.filter(
    (file) =>
      file.name.startsWith('frames_') &&
      file.name.endsWith(`.${options.format}`)
  )
  if (options.debug) {
    console.log('Frame files found:', frameFiles.length)
  }

  const frames: string[] = []
  const encoder = new TextEncoder()

  for (let i = 0; i < frameFiles.length; i++) {
    const file = frameFiles[i]
    if (options.debug) {
      console.log(`Processing frame file: ${file.name}`)
    }
    try {
      const frameData = await ffmpeg.readFile(file.name)

      // Convert Uint8Array to Base64 string without using btoa
      let binary = ''
      const bytes = new Uint8Array(frameData as any)
      const len = bytes.byteLength
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      const base64Frame = window.btoa(binary)

      frames.push(`data:image/${options.format};base64,${base64Frame}`)

      // Update progress for frame processing (from 90% to 100%)
      options.onProgress?.(90 + Math.round(((i + 1) / frameFiles.length) * 10))
    } catch (error) {
      console.error(`Error processing frame ${file.name}:`, error)
      // You can choose to either skip this frame or throw an error
      // throw error; // Uncomment this line if you want to stop processing on any error
    }
  }

  if (options.debug) {
    console.log(`Total frames processed: ${frames.length}`)
  }
  return frames
}
