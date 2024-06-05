export const blobToBase64DataUri = async (blob: Blob): Promise<string> => {
  const buffer = Buffer.from(await blob.arrayBuffer())
  return "data:" + blob.type + ';base64,' + buffer.toString('base64')
}
