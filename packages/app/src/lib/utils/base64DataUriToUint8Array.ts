export function base64DataUriToUint8Array(dataURI: string): Uint8Array {
  return Uint8Array.from(atob(dataURI.replace(/^data[^,]+,/, '')), (v) =>
    v.charCodeAt(0)
  )
}
