import { readdir } from "node:fs/promises"
import path from "node:path"

import { deleteFile } from "./deleteFile"

export const deleteFilesWithName = async (dir: string, name: string, debug?: boolean) => {
  // console.log(`deleteFilesWithName(${dir}, ${name})`)
  for (const file of await readdir(dir)) {
    if (file.includes(name)) {
      await deleteFile(path.join(dir, file))
    }
  }
}
