import { rm } from "node:fs/promises"

export async function deleteFile(filePath: string, debug?: boolean): Promise<boolean> {
  try {
    await rm(filePath, { recursive: true, force: true })
    // await unlink(filePath)
    return true
  } catch (err) {
    if (debug) {
      console.error(`failed to unlink file at ${filePath}: ${err}`)
    }
  }
  return false
}