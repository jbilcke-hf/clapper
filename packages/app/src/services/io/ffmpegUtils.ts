import { ClapSegmentCategory, UUID } from '@aitube/clap'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

export const TAG = 'io/createFullVideo'

export type FFMPegVideoInput = {
  data: Uint8Array | null
  startTimeInMs: number
  endTimeInMs: number
  durationInSecs: number
  category: ClapSegmentCategory
}

export type FFMPegAudioInput = FFMPegVideoInput

/**
 * Download and load single and multi-threading FFMPeg.
 * MT for video
 * ST for audio (as MT has issues with it)
 * toBlobURL is used to bypass CORS issues, urls with the same domain can be used directly.
 */
export async function initializeFFmpeg() {
  const [ffmpegSt, ffmpegMt] = [new FFmpeg(), new FFmpeg()]
  const baseStURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
  const baseMtURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd'

  ffmpegSt.on('log', ({ message }) => {
    console.log(TAG, 'FFmpeg Single-Thread:', message)
  })

  ffmpegMt.on('log', ({ message }) => {
    console.log(TAG, 'FFmpeg Multi-Thread:', message)
  })

  await ffmpegSt.load({
    coreURL: await toBlobURL(`${baseStURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(
      `${baseStURL}/ffmpeg-core.wasm`,
      'application/wasm'
    ),
  })

  await ffmpegMt.load({
    coreURL: await toBlobURL(`${baseMtURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(
      `${baseMtURL}/ffmpeg-core.wasm`,
      'application/wasm'
    ),
    workerURL: await toBlobURL(
      `${baseMtURL}/ffmpeg-core.worker.js`,
      'text/javascript'
    ),
  })

  return [ffmpegSt, ffmpegMt] as [FFmpeg, FFmpeg]
}

/**
 * Get loaded FFmpeg.
 */
let ffmpegInstance: [FFmpeg, FFmpeg]
export async function loadFFmpegSt() {
  if (!ffmpegInstance) ffmpegInstance = await initializeFFmpeg()
  return ffmpegInstance[0]
}

export async function loadFFmpegMt() {
  if (!ffmpegInstance) ffmpegInstance = await initializeFFmpeg()
  return ffmpegInstance[1]
}

/**
 * Creates an exclusive logger for the FFmpeg calls inside the provided method,
 * it calculates the progress based on raw FFmpeg logs and the provided `totalTimeInMs`.
 *
 * @param totalTimeInMs
 * @param method
 * @param callback
 * @param {number} callback.progress - The progress of the FFmpeg process from 0 to 100.
 * @returns
 */
export async function captureFFmpegProgress(
  ffmpeg: FFmpeg,
  totalTimeInMs: number,
  method: () => any,
  callback: (progress: number) => void
): Promise<any> {
  const extractProgressTimeMsFromLogs = (log: string): number | null => {
    // `frame` for videos, `size` for audios
    if (!log.startsWith('frame') && !log.startsWith('size')) return null
    const timeRegex = /time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/
    const match = log.match(timeRegex)
    if (match) {
      const hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      const seconds = parseInt(match[3])
      const centiseconds = parseInt(match[4])
      const totalMilliseconds =
        hours * 3600000 + minutes * 60000 + seconds * 1000 + centiseconds * 10
      return totalMilliseconds
    }
    return null
  }
  let ffmpegLog = true
  ffmpeg.on('log', ({ message }) => {
    if (!ffmpegLog) return
    const timeInMs = extractProgressTimeMsFromLogs(message)
    if (timeInMs) callback((timeInMs / totalTimeInMs) * 100)
  })
  const result = await method()
  ffmpegLog = false
  return result
}

/**
 * It will calculate a proportional progress between a targetProgress and a startProgress
 *
 * @param startProgress e.g. 50
 * @param progress e.g. 50
 * @param targetProgress e.g. 70
 * @returns e.g. 60, because 50% of progress between 70% and 50%, would result on 60%
 */
export function calculateProgress(
  startProgress: number,
  progress: number,
  targetProgress: number
): number {
  return startProgress + (progress * (targetProgress - startProgress)) / 100
}

/**
 * Creates an empty black video and appends it to the
 * provided `fileListContentArray`.
 *
 * @param duration time in milliseconds
 * @param width
 * @param height
 * @param filename
 * @param fileListContentArray fileList.txt where to append the file name
 * @param onProgress callback to capture the progress of this method
 */
export async function addEmptyVideo(
  durationInSecs: number,
  width: number,
  height: number,
  filename: string,
  fileListContentArray: string[],
  onProgress?: (progress: number, message?: string) => void
) {
  const ffmpeg = await loadFFmpegMt()
  let targetPartialProgress = 0

  // For some reason, creating empty video with silent audio
  // in one exec doesn't work, we need to split it.

  console.log(
    TAG,
    'Creating empty video',
    filename,
    width,
    height,
    durationInSecs
  )
  let currentProgress = 0
  targetPartialProgress = 50

  await captureFFmpegProgress(
    ffmpeg,
    durationInSecs * 1000,
    async () => {
      await ffmpeg.exec([
        '-f',
        'lavfi',
        '-i',
        `color=c=black:s=${width}x${height}:d=${durationInSecs}`,
        '-c:v',
        'libx264',
        '-t',
        `${durationInSecs}`,
        '-loglevel',
        'verbose',
        `base_${filename}`,
      ])
    },
    (progress) => {
      onProgress?.((progress / 100) * targetPartialProgress)
    }
  )

  console.log(
    TAG,
    'Adding silent audio to empty video',
    filename,
    width,
    height,
    durationInSecs
  )
  currentProgress = 50
  targetPartialProgress = 100

  const exitCode = await ffmpeg.exec([
    '-i',
    `base_${filename}`,
    '-f',
    'lavfi',
    '-i',
    'anullsrc',
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-t',
    `${durationInSecs}`,
    '-loglevel',
    'verbose',
    filename,
  ])

  if (exitCode) {
    throw new Error(`${TAG}: Unexpect error while creating empty video`)
  }

  console.log(TAG, 'Empty video created', filename)
  fileListContentArray.push(`file ${filename}`)
}

/**
 * Creates the full mixed audio including silence
 * segments and loads it into ffmpeg with the given `filename`.
 * @param onProgress callback to capture the progress of this method
 * @throws Error if ffmpeg returns exit code 1
 */
export async function createFullAudio(
  audios: FFMPegAudioInput[],
  filename: string,
  totalVideoDurationInMs: number,
  onProgress?: (progress: number, message: string) => void
): Promise<void> {
  console.log(TAG, 'Creating full audio', filename)

  const ffmpeg = await loadFFmpegSt()
  const filterComplexParts: string[] = []
  const baseFilename = `base_${filename}`
  let currentProgress = 0
  let targetProgress = 25

  // To mix audios at given times, we need a first empty base audio track

  await captureFFmpegProgress(
    ffmpeg,
    totalVideoDurationInMs,
    async () => {
      await ffmpeg.exec([
        '-f',
        'lavfi',
        '-i',
        'anullsrc',
        '-t',
        `${totalVideoDurationInMs / 1000}`,
        '-loglevel',
        'verbose',
        !audios.length ? filename : baseFilename,
      ])
    },
    (progress) => {
      onProgress?.(
        calculateProgress(currentProgress, progress, targetProgress),
        'Creating base audio...'
      )
    }
  )

  // If there is no audios, the base audio is the final one
  if (!audios.length) return onProgress?.(100, 'Prepared audios...')

  currentProgress = targetProgress
  targetProgress = 50

  // Mix audios based on their start times

  const audioInputFiles = ['-i', baseFilename]
  for (let index = 0; index < audios.length; index++) {
    onProgress?.(currentProgress, 'Creating base audio...')
    console.log(TAG, `Processing audio #${index}`)
    const audio = audios[index]
    const expectedProgressForItem = ((1 / audios.length) * targetProgress) / 100
    if (!audio.data) continue
    const audioFilename = `audio_${UUID()}.mp3`
    await ffmpeg.writeFile(audioFilename, audio.data)
    audioInputFiles.push('-i', audioFilename)
    const delay = audio.startTimeInMs
    const durationInSecs = audio.endTimeInMs - audio.startTimeInMs / 1000
    filterComplexParts.push(
      `[${index + 1}:a]atrim=0:${durationInSecs},adelay=${delay}|${delay}[delayed${index}]`
    )
    currentProgress += expectedProgressForItem * 100
  }

  const amixInputs = `[0:a]${audios.map((_, index) => `[delayed${index}]`).join('')}amix=inputs=${audios.length + 1}:duration=longest`
  filterComplexParts.push(`${amixInputs}[a]`)
  const filterComplex = filterComplexParts.join('; ')

  currentProgress = targetProgress
  targetProgress = 100

  const createFullAudioExitCode = await captureFFmpegProgress(
    ffmpeg,
    totalVideoDurationInMs,
    async () => {
      await ffmpeg.exec([
        ...audioInputFiles,
        '-filter_complex',
        filterComplex,
        '-map',
        '[a]',
        '-t',
        `${totalVideoDurationInMs / 1000}`,
        '-loglevel',
        'verbose',
        filename,
      ])
    },
    (progress) => {
      onProgress?.(
        calculateProgress(currentProgress, progress, targetProgress),
        'Mixing audios...'
      )
    }
  )

  if (createFullAudioExitCode) {
    throw new Error(`${TAG}: Error while creating full audio!`)
  }
  onProgress?.(targetProgress, 'Prepared audios...')
}

/**
 * Creates the full silent video including empty black
 * segments and loads it into ffmpeg with the given `filename`.
 * @param onProgress callback to capture the progress of this method
 * @throws Error if ffmpeg returns exit code 1
 */

export async function createFullSilentVideo(
  videoInputs: FFMPegVideoInput[],
  filename: string,
  totalVideoDurationInMs: number,
  width: number,
  height: number,
  excludeEmptyContent = false,
  onProgress?: (progress: number, message: string) => void
) {
  const ffmpeg = await loadFFmpegMt()
  const fileList = 'fileList.txt'
  const fileListContentArray: string[] = []

  console.log(
    `${TAG}: Starting createFullSilentVideo with ${videoInputs.length} inputs`
  )
  console.log(`${TAG}: Total duration: ${totalVideoDurationInMs}ms`)

  onProgress?.(0, 'Preparing videos and images...')

  let currentProgress = 0
  const targetProgress = 100
  const progressStep = targetProgress / videoInputs.length

  for (let index = 0; index < videoInputs.length; index++) {
    const input = videoInputs[index]

    console.log(`${TAG}: Processing input ${index + 1}/${videoInputs.length}`)
    console.log(
      `${TAG}: Input start time: ${input.startTimeInMs}ms, end time: ${input.endTimeInMs}ms`
    )
    console.log(`${TAG}: Input category: ${input.category}`)

    if (input.data === null) {
      console.warn(`${TAG}: Skipping input at index ${index} due to null data`)
      continue
    }

    const inputFilename = `input_${index}_${UUID()}.${input.category === ClapSegmentCategory.STORYBOARD ? 'png' : 'mp4'}`
    await ffmpeg.writeFile(inputFilename, input.data)

    const segmentDuration = (input.endTimeInMs - input.startTimeInMs) / 1000
    console.log(`${TAG}: Segment duration: ${segmentDuration}s`)

    let outputFilename = `output_${index}_${UUID()}.mp4`

    if (input.category === ClapSegmentCategory.STORYBOARD) {
      // Handle image input
      console.log(`${TAG}: Processing image input`)
      const ffmpegCommand = [
        '-loop',
        '1',
        '-i',
        inputFilename,
        '-t',
        segmentDuration.toString(),
        '-vf',
        `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
        '-c:v',
        'libx264',
        '-tune',
        'stillimage',
        '-pix_fmt',
        'yuv420p',
        '-shortest',
        outputFilename,
      ]
      console.log(
        `${TAG}: FFmpeg command for image: ${ffmpegCommand.join(' ')}`
      )
      await ffmpeg.exec(ffmpegCommand)
    } else {
      // Handle video input
      console.log(`${TAG}: Processing video input`)
      const ffmpegCommand = [
        '-i',
        inputFilename,
        '-t',
        segmentDuration.toString(),
        '-vf',
        `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        '-shortest',
        outputFilename,
      ]
      console.log(
        `${TAG}: FFmpeg command for video: ${ffmpegCommand.join(' ')}`
      )
      await ffmpeg.exec(ffmpegCommand)
    }

    fileListContentArray.push(`file '${outputFilename}'`)
    console.log(`${TAG}: Added to file list: file '${outputFilename}'`)

    currentProgress += progressStep
    onProgress?.(
      currentProgress,
      `Processed input ${index + 1} of ${videoInputs.length}`
    )
  }

  if (fileListContentArray.length === 0) {
    throw new Error(`${TAG}: No valid inputs to process`)
  }

  console.log(`${TAG}: File list content:`)
  console.log(fileListContentArray.join('\n'))

  const fileListContent = fileListContentArray.join('\n')
  await ffmpeg.writeFile(fileList, fileListContent)

  onProgress?.(targetProgress, 'Concatenating videos and images...')

  const concatenateCommand = [
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    fileList,
    '-c',
    'copy',
    '-fflags',
    '+genpts',
    filename,
  ]
  console.log(`${TAG}: Concatenate command: ${concatenateCommand.join(' ')}`)

  const concatenateExitCode = await ffmpeg.exec(concatenateCommand)

  if (concatenateExitCode !== 0) {
    throw new Error(`${TAG}: Error while concatenating videos and images!`)
  }

  console.log(`${TAG}: Silent video created successfully`)
  onProgress?.(100, 'Silent video created successfully')

  // Verify the output video duration
  const probeCommand = [
    '-i',
    filename,
    '-show_entries',
    'format=duration',
    '-v',
    'quiet',
    '-of',
    'csv=p=0',
  ]
  const probeDuration = await ffmpeg.exec(probeCommand)
  console.log(
    `${TAG}: Final video duration: ${probeDuration}s (expected: ${totalVideoDurationInMs / 1000}s)`
  )
}
