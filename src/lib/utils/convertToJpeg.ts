import sharp from 'sharp'

export function convertToJpeg(imageAsBase64DataUri: string): Promise<string> {
  const matches = imageAsBase64DataUri.match(
    /^data:image\/([A-Za-z-+\/]+);base64,(.+)$/
  )
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid input string format')
  }

  const imageData = Buffer.from(matches[2], 'base64')

  return sharp(imageData)
    .jpeg({
      quality: 97,
    })
    .toBuffer()
    .then((newImageData) => {
      const base64Image = Buffer.from(newImageData).toString('base64')
      return `data:image/jpeg;base64,${base64Image}`
    })
}
