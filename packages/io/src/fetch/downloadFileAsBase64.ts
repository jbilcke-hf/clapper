import { lookup } from "mime-types"

export const downloadFileAsBase64 = async (remoteUrl: string): Promise<string> => {
  // const controller = new AbortController()

  // download the file
  const response = await fetch(remoteUrl, {
    // signal: controller.signal
  })

  // get as Buffer
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // convert it to base64
  const base64 = buffer.toString('base64')


  const res = lookup(remoteUrl)
  let contentType = res.toString()
  if (typeof res === "boolean" && res === false) {
    contentType = response.headers.get('content-type') || ""
  }

  const assetUrl = `data:${contentType};base64,${base64}`
  return assetUrl
};