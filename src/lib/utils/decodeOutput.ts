import { fetchContentToBase64 } from "./fetchContentToBase64"

export async function decodeOutput(input: any): Promise<string> {
  const urlOrBase64 = `${input || ''}`

  if (!urlOrBase64) { return '' }

  return urlOrBase64.startsWith("data:")
  ? urlOrBase64
  : (await fetchContentToBase64(urlOrBase64))
}