import { convertAudioToMp3 } from '@/lib/ffmpeg/convertAudioToMp3'

import { fetchContentToBase64 } from './fetchContentToBase64'
import { convertToJpeg } from './convertToJpeg'

export async function decodeOutput(input: any): Promise<string> {
  const urlOrBase64 = `${input || ''}`

  if (!urlOrBase64) {
    return ''
  }

  const base64Url = urlOrBase64.startsWith('data:')
    ? urlOrBase64
    : await fetchContentToBase64(urlOrBase64)

  if (base64Url.startsWith('data:image/')) {
    // this step is important since some providers store data as PNG,
    // which is a unreasonable since a few frames quickly add up to 10 Mb,
    // we can't afford to have a 20 Gb .clap file
    //
    // if you really want to have a pro, Hollywood-grade storyboard storage,
    // this isn't impossible but then you need to use either file paths or remote URL paths
    // and if you want some lossless like this, we should add a parameter to support that
    const jpegImageAsBase64 = await convertToJpeg(base64Url)

    return jpegImageAsBase64
  } else if (
    base64Url.startsWith('data:audio/wav') ||
    base64Url.startsWith('data:audio/x-wav')
  ) {
    // same logic as for images here: we convert to a more compact format
    // and if you want some lossless, we should add a parameter to support that
    const mp4AudioAsBase64 = await convertAudioToMp3(base64Url)

    return mp4AudioAsBase64
  }

  return base64Url
}
