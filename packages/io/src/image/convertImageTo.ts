import { convertImageToJpeg } from "./convertImageToJpeg"
import { convertImageToPng } from "./convertImageToPng"
import { convertImageToWebp } from "./convertImageToWebp"
import { ImageFileExt } from "./imageFormats"

/**
 * Convert an image to one of the supported file formats
 * 
 * @param imgBase64 
 * @param outputFormat 
 * @returns 
 */
export async function convertImageTo(imgBase64: string = "", outputFormat: ImageFileExt): Promise<string> {
  const format = outputFormat.trim().toLowerCase() as ImageFileExt
  if (!["jpeg", "jpg", "png", "webp"].includes(format)) {
    throw new Error(`unsupported file format "${format}"`)
  }

  const isJpeg = format === "jpg" || format === "jpeg" 
     

  if (isJpeg) {
    return convertImageToJpeg(imgBase64)
  }

  if (format === "webp") {
    return convertImageToWebp(imgBase64)
  }

  return convertImageToPng(imgBase64)
}
