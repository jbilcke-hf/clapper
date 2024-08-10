export function addBase64Header(
  image?: string,
  format?:
    | 'jpeg'
    | 'jpg'
    | 'png'
    | 'webp'
    | 'heic'
    | 'mp3'
    | 'wav'
    | 'mp4'
    | 'webm'
    | string
) {
  if (!image || typeof image !== 'string' || image.length < 60) {
    return ''
  }

  const ext = (`${format || ''}`.split('.').pop() || '').toLowerCase().trim()

  let mime = ''
  if (ext === 'jpeg' || ext === 'jpg') {
    mime = 'image/jpeg'
  } else if (ext === 'webp') {
    mime = 'image/webp'
  } else if (ext === 'png') {
    mime = 'image/png'
  } else if (ext === 'heic') {
    mime = 'image/heic'
  } else if (ext === 'mp3') {
    mime = 'audio/mp3'
  } else if (ext === 'mp4') {
    mime = 'video/mp4'
  } else if (ext === 'webm') {
    mime = 'video/webm'
  } else if (ext === 'wav') {
    mime = 'audio/wav'
  } else {
    throw new Error(`addBase64Header failed (unsupported format: ${format})`)
  }

  if (image.startsWith('data:')) {
    if (image.startsWith(`data:${mime};base64,`)) {
      return image
    } else {
      throw new Error(
        `addBase64Header failed (input string is NOT a ${mime} image)`
      )
    }
  } else {
    return `data:${mime};base64,${image}`
  }
}
