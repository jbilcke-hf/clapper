import sharp from "sharp"

export async function convertImageToJpeg(imgBase64: string = "", quality: number = 92): Promise<string> {

  const base64WithoutHeader = imgBase64.split(";base64,")[1] || ""

  if (!base64WithoutHeader) {
    const slice = `${imgBase64 || ""}`.slice(0, 50)
    throw new Error(`couldn't process input image "${slice}..."`)
  }

  // Convert base64 to buffer
  const tmpBuffer = Buffer.from(base64WithoutHeader, 'base64')

  // Resize the buffer to the target size
  const newBuffer = await sharp(tmpBuffer)
    .jpeg({
      quality,
      // we don't use progressive: true because we pre-load images anyway
     })
      .toBuffer()

  // Convert the buffer back to base64
  const newImageBase64 = newBuffer.toString('base64')

  return `data:image/jpeg;base64,${newImageBase64}`
}