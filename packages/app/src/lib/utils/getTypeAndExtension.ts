import { ClapOutputType } from '@aitube/clap'

/**
 * break a base64 string into sub-components
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
  // Regular expression to extract the MIME type and the base64 data
  const matches = base64.match(/^data:([A-Za-z-+0-9/]+);base64,(.+)$/)

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string')
  }

  const assetFileFormat = matches[1] || ''

  // this should be enough for most media formats (jpeg, png, webp, mp4)
  const [category, extension] = assetFileFormat.split('/')

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
    assetFileFormat,
    extension,
    outputType,
  }
}
