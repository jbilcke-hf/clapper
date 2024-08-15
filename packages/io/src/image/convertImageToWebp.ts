import sharp from "sharp"

export async function convertImageToWebp(imgBase64: string = ""): Promise<string> {

  const base64WithoutHeader = imgBase64.split(";base64,")[1] || ""

  if (!base64WithoutHeader) {
    const slice = `${imgBase64 || ""}`.slice(0, 50)
    throw new Error(`couldn't process input image "${slice}..."`)
  }

  // Convert base64 to buffer
  const tmpBuffer = Buffer.from(base64WithoutHeader, 'base64')

  // Resize the buffer to the target size
  const newBuffer = await sharp(tmpBuffer)
    .webp({
      // for options please see https://sharp.pixelplumbing.com/api-output#webp

      // preset: "photo",

      // effort: 3,

      // for a PNG-like quality
      // lossless: true,

      // by default it is quality 80
      quality: 80,

      // nearLossless: true,

      // use high quality chroma subsampling
      smartSubsample: true,
     })
      .toBuffer()

  // Convert the buffer back to base64
  const newImageBase64 = newBuffer.toString('base64')

  return `data:image/webp;base64,${newImageBase64}`
}