export type FalAiImagesResponse = {
  prompt: string
  timings: { inference: number }
  has_nsfw_concepts: boolean[]
  seed: number
  images: {
    url: string
    width: number
    height: number
    file_name: string
    file_size: string
    content_type: string
  }[]
}

export type FalAiImageResponse = {
  prompt: string
  timings: { inference: number }
  has_nsfw_concepts: boolean[]
  seed: number
  image: {
    url: string
    width: number
    height: number
    file_name: string
    file_size: string
    content_type: string
  }
}

export type FalAiVideoResponse = {
  video: {
    url: string
    content_type: string
    file_name: string
    file_size: number
  }
  timings: { inference: number }
  has_nsfw_concepts: boolean[]
  seed: number
}

export type FalAiAudioResponse = {
  audio_file: {
    url: string
    content_type: string
    file_name: string
    file_size: number
  }
  timings: { inference: number }
  has_nsfw_concepts: boolean[]
  seed: number
}

export type FalAiSpeechResponse = {
  audio_url: {
    url: string
    content_type: string
    file_name: string
    file_size: number
  }
  timings: { inference: number }
  has_nsfw_concepts: boolean[]
  seed: number
}
