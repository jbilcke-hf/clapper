import { existsSync, promises as fs } from "node:fs"

// note: this function will never fail
export async function removeTemporaryFiles(filesPaths: string[]) {
  try {
    // Cleanup temporary files - you could choose to do this or leave it to the user
    await Promise.all(filesPaths.map(async (filePath) => {
      try {
        if (existsSync(filePath)) {
          await fs.rm(filePath)
        }
      } catch (err) {
        //
      }
    }))
  } catch (err) {
    // no big deal, except a bit of tmp file leak
    // although.. if delete failed, it could also indicate
    // that the file has already been cleaned-up, so even better!
  } 
}