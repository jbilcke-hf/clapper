export async function fetchContentToBase64(url: string) {

  const predictedFormat = url.split(".").pop()?.trim().toLowerCase()

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })
  const blob = await res.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  // some providers such as Replicate return a generic octet-stream type in the headers
  const type = blob.type === "application/octet-stream"
    ? (predictedFormat === "webp" ? "image/webp" :
      predictedFormat === "jpeg" ? "image/jpeg" :
      predictedFormat === "jpg" ? "image/jpeg" :
      predictedFormat === "png" ? "image/png" :
      predictedFormat === "avif" ? "image/avif" :  
      predictedFormat === "heic" ? "image/heic" : 
      predictedFormat === "mp4" ? "video/mp4" :
      predictedFormat === "mp3" ? "audio/mp3" :
      predictedFormat === "wav" ? "audio/wav" : 
      "application/octet-stream"
  ) : blob.type

  return 'data:' + type + ';base64,' + buffer.toString('base64')
}
