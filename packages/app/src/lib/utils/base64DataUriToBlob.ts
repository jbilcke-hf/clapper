export function base64DataUriToBlob(dataURI: string) {
  dataURI = dataURI.replace(/^data:/, '')

  const match = dataURI.match(/(?:image|video|audio|text)\/[^;]+/)
  const type = match?.[0] || ''
  const base64 = Buffer.from(dataURI.replace(/^[^,]+,/, ''), 'base64').toString(
    'binary'
  )
  const arrayBuffer = new ArrayBuffer(base64.length)
  const typedArray = new Uint8Array(arrayBuffer)

  for (let i = 0; i < base64.length; i++) {
    typedArray[i] = base64.charCodeAt(i)
  }

  return new Blob([arrayBuffer], { type })
}
