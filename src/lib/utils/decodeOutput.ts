import { fetchContentToBase64 } from "./fetchContentToBase64"
import { convertToJpeg } from "./convertToJpeg"

export async function decodeOutput(input: any): Promise<string> {
  const urlOrBase64 = `${input || ''}`

  if (!urlOrBase64) { return '' }

  const base64Url =
    urlOrBase64.startsWith("data:")
      ? urlOrBase64
      : (await fetchContentToBase64(urlOrBase64))

    
  if (base64Url.startsWith("data:image/")) {
    // this step is important since some providers store data as PNG,
    // which is a unreasonable since a few frames quickly add up to 10 Mb,
    // we can't afford to have a 20 Gb .clap file
    //
    // if you really want to have a pro, Hollywood-grade storyboard storage,
    // this isn't impossible but then you need to use either file paths or remote URL paths
    const jpegImageAsBase64 = await convertToJpeg(base64Url)

    return jpegImageAsBase64
  }

  return base64Url
}
