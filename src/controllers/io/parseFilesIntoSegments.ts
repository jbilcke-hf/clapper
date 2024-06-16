
import { ClapSegment } from "@aitube/clap"
import { parseFileIntoSegments } from "./parseFileIntoSegments"

export async function parseFilesIntoSegments({ files }: {
  /**
   * The files to import
   */
  files: File[]
}): Promise<ClapSegment[]> {
  return (
    await Promise.all(files.map(file => parseFileIntoSegments({
      file,
  })))
  ).reduce((acc, segments) => [...acc, ...segments], [])
}

