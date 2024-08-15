export async function blobToDataUri(blob: Blob, defaultContentType = ""): Promise<string> {
  if (typeof window === "undefined") {
    const arrayBuffer = await blob.arrayBuffer()
    let buffer = Buffer.from(arrayBuffer)
    return "data:" + (defaultContentType || blob.type) + ';base64,' + buffer.toString('base64');
  } else {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = _e => {
        let dataUri = `${reader.result as string || ""}`
        if (defaultContentType) {
          dataUri = dataUri.replace("application/octet-stream", defaultContentType)
        }
        resolve(dataUri)
      }
      reader.onerror = _e => reject(reader.error)
      reader.onabort = _e => reject(new Error("Read aborted"))
      reader.readAsDataURL(blob)
    });
  }
}