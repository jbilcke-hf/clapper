'use client'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import mediaInfoFactory, { VideoTrack, AudioTrack } from 'mediainfo.js'
import { fileDataToBase64 } from './fileDataToBase64'

interface ExtractorOptions {
  frameFormat: 'png' | 'jpg'
  maxWidth: number
  maxHeight: number
  framesPerScene: number
  onProgress?: (progress: number) => void
  debug?: boolean
  autoCrop?: boolean
  sceneThreshold?: number
  minSceneDuration?: number
}

interface SceneData {
  sceneIndex: number
  startTimeInMs: number
  endTimeInMs: number
  video: string
  frames: string[]
}

export async function extractScenesFromVideo(
  videoBlob: Blob,
  options: ExtractorOptions
): Promise<SceneData[]> {
  const ffmpeg = new FFmpeg()
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

  try {
    console.log(`getting duration..`)

    const duration = await getVideoDuration(videoBlob)
    if (!duration) {
      throw new Error(`couldn't get the video duration`)
    }
    if (options.debug) {
      console.log('Video duration in seconds:', duration)
    }

    console.log(`loading FFmpeg..`)

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
    })

    if (options.debug) {
      console.log('FFmpeg loaded')
    }

    const videoUint8Array = new Uint8Array(await videoBlob.arrayBuffer())
    await ffmpeg.writeFile('input.mp4', videoUint8Array)

    console.log(`detecting crop parameters..`)

    let cropParams = ''
    if (options.autoCrop) {
      cropParams = await detectCropParameters(ffmpeg, options)
    }

    const sceneThreshold = options.sceneThreshold || 0.2
    const minSceneDuration = options.minSceneDuration || 1

    const sceneDetectionFilter = `select='gt(scene,${sceneThreshold})'`
    const scaleFilter = `scale='min(${options.maxWidth},iw)':min'(${options.maxHeight},ih)':force_original_aspect_ratio=decrease`

    let filterChain = `${sceneDetectionFilter},${scaleFilter}`
    if (cropParams) {
      filterChain = `crop=${cropParams},${filterChain}`
    }
    console.log(`detecting scenes..`)

    const sceneTimestamps = await detectScenes(
      ffmpeg,
      filterChain,
      options,
      duration
    )

    console.log(`detected ${sceneTimestamps.length} scenes`)

    const scenes: SceneData[] = []

    for (let i = 0; i < sceneTimestamps.length; i++) {
      const startTime = sceneTimestamps[i]
      const endTime =
        i < sceneTimestamps.length - 1
          ? sceneTimestamps[i + 1]
          : duration * 1000
      const sceneDuration = endTime - startTime
      console.log(`processing scene ${i}`)

      try {
        const sceneData = await processScene(
          ffmpeg,
          i,
          startTime,
          endTime,
          sceneDuration,
          options
        )
        scenes.push(sceneData)
      } catch (error) {
        console.error(`Error processing scene ${i}:`, error)
      }

      options.onProgress?.(Math.round(((i + 1) / sceneTimestamps.length) * 100))
    }

    if (options.debug) {
      console.log(`Total scenes processed: ${scenes.length}`)
    }

    return scenes
  } catch (error) {
    console.error('Error in extractFramesAndScenesFromVideo:', error)
    throw error
  } finally {
    try {
      await ffmpeg.terminate()
    } catch (error) {
      console.error('Error terminating FFmpeg:', error)
    }
  }
}

async function getVideoDuration(
  videoBlob: Blob,
  debug: boolean = false
): Promise<number> {
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

  if (debug) {
    console.log('calling await mediaInfo.analyzeData(getSize, readChunk)')
  }

  const result = await mediaInfo.analyzeData(getSize, readChunk)
  if (debug) {
    console.log('result = ', result)
  }

  let duration: number = 0

  for (const track of result.media?.track || []) {
    if (debug) {
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
  return duration
}

async function detectCropParameters(
  ffmpeg: FFmpeg,
  options: ExtractorOptions
): Promise<string> {
  const cropDetectCommand = [
    '-i',
    'input.mp4',
    '-vf',
    'cropdetect=limit=0.1:round=2:reset=0',
    '-f',
    'null',
    '-t',
    '10',
    '-',
  ]

  if (options.debug) {
    console.log(
      'Executing crop detection command:',
      cropDetectCommand.join(' ')
    )
  }

  let cropParams = ''
  ffmpeg.on('log', ({ message }) => {
    const cropMatch = message.match(/crop=(\d+:\d+:\d+:\d+)/)
    if (cropMatch) {
      cropParams = cropMatch[1]
    }
  })

  await ffmpeg.exec(cropDetectCommand)

  if (options.debug) {
    console.log('Detected crop parameters:', cropParams)
  }

  return cropParams
}

async function detectScenes(
  ffmpeg: FFmpeg,
  filterChain: string,
  options: ExtractorOptions,
  duration: number
): Promise<number[]> {
  const extractScenesCommand = [
    '-i',
    'input.mp4',
    '-filter_complex',
    `${filterChain},metadata=print:file=scenes.txt`,
    '-f',
    'null',
    '-',
  ]

  if (options.debug) {
    console.log(
      'Executing scene detection command:',
      extractScenesCommand.join(' ')
    )
  }

  await ffmpeg.exec(extractScenesCommand)

  const scenesMetadata = await ffmpeg.readFile('scenes.txt')
  const decodedMetadata = new TextDecoder().decode(scenesMetadata as Uint8Array)

  if (options.debug) {
    console.log('Scenes metadata:', decodedMetadata)
  }

  const sceneTimestamps = decodedMetadata
    .split('\n')
    .filter((line) => line.includes('pts_time'))
    .map((line) => parseFloat(line.split('pts_time:')[1]) * 1000) // Convert to milliseconds

  // Add start and end timestamps
  sceneTimestamps.unshift(0)
  sceneTimestamps.push(duration * 1000)

  // Filter out scenes that are too short
  const filteredScenes = sceneTimestamps.filter((timestamp, index, array) => {
    if (index === 0) return true
    const sceneDuration = timestamp - array[index - 1]
    return sceneDuration >= (options.minSceneDuration || 1) * 1000
  })

  return filteredScenes
}

async function processScene(
  ffmpeg: FFmpeg,
  index: number,
  startTime: number,
  endTime: number,
  duration: number,
  options: ExtractorOptions
): Promise<SceneData> {
  const extractSceneCommand = [
    '-ss',
    (startTime / 1000).toString(),
    '-i',
    'input.mp4',
    '-t',
    (duration / 1000).toString(),
    '-c:v',
    'libx264',
    '-preset',
    'ultrafast',
    '-crf',
    '23',
    '-c:a',
    'aac',
    `scene_${index}.mp4`,
  ]
  // console.log(`calling ffmpeg.exec(extractSceneCommand)`, extractSceneCommand)
  await ffmpeg.exec(extractSceneCommand)

  // Calculate frame interval to get the desired number of frames
  const frameInterval = Math.max(
    1,
    Math.floor(duration / (1000 * options.framesPerScene))
  )

  const extractFramesCommand = [
    '-i',
    `scene_${index}.mp4`,
    '-vf',
    `select='not(mod(n,${frameInterval}))',setpts=N/FRAME_RATE/TB`,
    '-frames:v',
    options.framesPerScene.toString(),
    '-vsync',
    '0',
    '-q:v',
    '2',
    '-f',
    'image2',
    `scene_${index}_frame_%03d.${options.frameFormat}`,
  ]
  // console.log(`calling ffmpeg.exec(extractFramesCommand)`, extractFramesCommand)
  await ffmpeg.exec(extractFramesCommand)

  const sceneVideo = await ffmpeg.readFile(`scene_${index}.mp4`)
  const frameFiles = (await ffmpeg.listDir('/')).filter(
    (file) =>
      file.name.startsWith(`scene_${index}_frame_`) &&
      file.name.endsWith(`.${options.frameFormat}`)
  )

  const frames: string[] = []
  for (const frameFile of frameFiles) {
    const frameData = await ffmpeg.readFile(frameFile.name)
    const base64Frame = fileDataToBase64(frameData)
    frames.push(`data:image/${options.frameFormat};base64,${base64Frame}`)
  }

  const base64Video = fileDataToBase64(sceneVideo)

  return {
    sceneIndex: index,
    startTimeInMs: Math.round(startTime),
    endTimeInMs: Math.round(endTime),
    video: `data:video/mp4;base64,${base64Video}`,
    frames,
  }
}
