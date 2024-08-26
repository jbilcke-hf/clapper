import { ClapOutputType } from '@aitube/clap'

/**
 * break a base64 data uri string into sub-components
 */
export function getTypeAndExtension(base64: string = ''): {
  // category eg. video, audio, text
  category: string

  // file format eg. video/mp4 text/html audio/wave
  assetFileFormat: string

  // file extension eg. .mp4 .html .wav
  extension: string

  outputType: ClapOutputType
} {
  if (!base64.startsWith('data:') || !base64.includes('base64,')) {
    throw new Error('Invalid base64 data uri provided.')
  }

  const base64Index = base64.indexOf('base64,')
  const mimeType = base64.slice(5, base64Index - 1)

  // this should be enough for most media formats (jpeg, png, webp, mp4)
  const [category, extension] = mimeType.split('/')

  let outputType = ClapOutputType.TEXT

  if (category === 'audio') {
    outputType = ClapOutputType.AUDIO
  } else if (category === 'image') {
    outputType = ClapOutputType.IMAGE
  } else if (category === 'video') {
    outputType = ClapOutputType.VIDEO
  }

  return {
    category,
    assetFileFormat: mimeType,
    extension,
    outputType,
  }
}
