import { UUID } from '@aitube/clap'
import {
  calculateProgress,
  captureFFmpegProgress,
  createFullAudio,
  createFullSilentVideo,
  FFMPegAudioInput,
  FFMPegVideoInput,
  loadFFmpegMt,
  loadFFmpegSt,
  TAG,
} from './ffmpegUtils'

/**
 * Creates full video with audio using `@ffmpeg/ffmpeg` multi-core,
 * emits progress via callback.
 *
 */
export async function createFullVideo(
  videoInputs: FFMPegVideoInput[],
  audios: FFMPegAudioInput[],
  width: number,
  height: number,
  totalVideoDurationInMs: number,
  onProgress: (progress: number, message: string) => void
): Promise<Uint8Array> {
  const ffmpeg = await loadFFmpegMt()
  const fullVideoFilename = `full_video_${UUID()}.mp4`
  const fullAudioFilename = `full_audio_${UUID()}.mp3`
  const fullSilentVideoFilename = `full_silent_video_${UUID()}.mp4`

  onProgress?.(0, 'Creating silent video...')
  console.log(TAG, 'Creating silent video...')

  // Split the work in 3 units, each one of 33.3%,
  // each unit will emit a sub progress.
  let currentProgress = 0
  let targetProgress = 33.3

  await createFullSilentVideo(
    videoInputs,
    fullSilentVideoFilename,
    totalVideoDurationInMs,
    width,
    height,
    false,
    (progress, message) => {
      onProgress?.(
        calculateProgress(currentProgress, progress, targetProgress),
        message
      )
    }
  )

  onProgress?.(targetProgress, 'Creating full audio...')
  console.log(TAG, 'Creating full audio...')

  currentProgress = targetProgress
  targetProgress = 66.6

  await createFullAudio(
    audios,
    fullAudioFilename,
    totalVideoDurationInMs,
    (progress, message) => {
      onProgress?.(
        calculateProgress(currentProgress, progress, targetProgress),
        message
      )
    }
  )

  // The audio is saved in FFmpegST, let's share it to FFmpegMT
  const ffmpegSt = await loadFFmpegSt()
  const fileFromFfmpegSt = await ffmpegSt.readFile(fullAudioFilename)
  await ffmpeg.writeFile(fullAudioFilename, fileFromFfmpegSt)

  onProgress?.(targetProgress, 'Merging audio and video...')
  console.log(TAG, 'Merging audio with video...')

  currentProgress = targetProgress
  targetProgress = 100

  const createdFullVideo = await captureFFmpegProgress(
    ffmpeg,
    totalVideoDurationInMs,
    async () => {
      return await ffmpeg.exec([
        '-i',
        fullSilentVideoFilename,
        '-i',
        fullAudioFilename,
        '-map',
        '0:v',
        '-map',
        '1:a',
        '-c:v',
        'copy',
        fullVideoFilename,
      ])
    },
    (progress: number) => {
      onProgress?.(
        calculateProgress(currentProgress, progress, targetProgress),
        'Merging audio and video...'
      )
    }
  )

  if (createdFullVideo) {
    throw new Error(`${TAG}: Error while adding audio into full video!`)
  }
  onProgress?.(targetProgress, 'Full video was successfully created')

  console.log(TAG, `Full video was successfully created`)
  const data = await ffmpeg.readFile(fullVideoFilename)
  return data as Uint8Array
}
