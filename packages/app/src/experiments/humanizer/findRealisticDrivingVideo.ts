import { TimelineSegment } from '@aitube/timeline'

import { Action, Emotion, Intensity } from './types'
import { sampleDrivingVideo } from '@/lib/core/constants'
import { drivingVideosByActionEmotionAndIntensity } from './drivingVideosByActionEmotionAndIntensity$'

const urlPrefix = ''

function formatVideoForDownload(video: string) {
  return `https://huggingface.co/datasets/jbilcke-hf/open-identities/resolve/main/driving-videos/${video}.mp4?download=true`
}

function getHumanizerCode({
  action,
  emotion,
  intensity,
}: {
  action?: Action
  emotion?: Emotion
  intensity?: Intensity
}): string {
  const emotions =
    drivingVideosByActionEmotionAndIntensity[action || Action.IDLING] ||
    drivingVideosByActionEmotionAndIntensity.IDLING
  // TODO: we could put some fallback rules to use the closest emotion available
  const intensities = emotions[emotion || Emotion.RELAXED] || emotions.RELAXED
  const url = `${intensities[intensity || Intensity.NATURAL] || intensities.NATURAL || ''}`

  return url.length > 4 ? formatVideoForDownload(url) : sampleDrivingVideo
}

export function findRealisticDrivingVideo({
  segment,
  segments,
}: {
  segment: TimelineSegment
  segments: TimelineSegment[]
}): string {
  // TODO: analyze the scene to determine:
  // action, emotion, intensity
  return getHumanizerCode({
    action: Action.IDLING,
    emotion: Emotion.RELAXED,
    intensity: Intensity.NATURAL,
  })
}
