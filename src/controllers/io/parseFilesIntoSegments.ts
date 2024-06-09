
import { ClapSegment } from "@aitube/clap"
import { parseFileIntoSegments } from "./parseFileIntoSegments"

export async function parseFilesIntoSegments({ files, segments, }: {
  /**
   * The files to import
   */
  files: File[]

  /**
   * all existing segments
   */
  segments: ClapSegment[]
}): Promise<ClapSegment[]> {
  return (
    await Promise.all(files.map(file => parseFileIntoSegments({
      file,
      segments,
  })))
  ).reduce((acc, segments) => [...acc, ...segments], [])
}

