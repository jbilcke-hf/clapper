import { ClapAssetSource, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

export type ExportableSegment = {
  segment: ClapSegment

  // lowercase category name
  category: string

  directory: string

  // a short id that is neither a hash or a UUID, but instead something like
  // video0, video1, sound100, storyboard435 etc..
  shortId: string

  // used to create short and unique IDs in the project files for external audio editors
  index: number

  prefix: string

  // eg image/jpeg, audio/mpeg
  mimetype: string

  // eg mp3, mp4
  format: string

  filePath: string

  fileName: string

  assetUrl: string

  assetSourceType: ClapAssetSource

  isExportableToFile: boolean
}

export function formatSegmentForExport(segment: ClapSegment, index: number): ExportableSegment {
  const directory = `${segment.category}`.toLowerCase()
  const prefix = `shot_${String(index).padStart(4, '0')}_`
  let mimetype = `${segment.assetFileFormat || "unknown/unknown"}`
  if (mimetype === "audio/mpeg") {
    mimetype = "audio/mp3"
  }
  const format = `${mimetype.split("/").pop() || "unknown"}`.toLowerCase()
  const fileName = `${prefix}${segment.id}.${format}`
  const filePath = `${directory}/${fileName}`
  let assetUrl = segment.assetUrl || ""
  let assetSourceType = segment.assetSourceType || ClapAssetSource.EMPTY

  const isExportableToFile = (
      segment.category === ClapSegmentCategory.VIDEO ||
      segment.category === ClapSegmentCategory.STORYBOARD ||
      segment.category === ClapSegmentCategory.DIALOGUE ||
      segment.category === ClapSegmentCategory.SOUND ||
      segment.category === ClapSegmentCategory.MUSIC
    ) &&
      format !== "unknown" &&
      segment.assetUrl.startsWith("data:")

  const category = segment.category.toLocaleLowerCase()

  return {
    segment,
    category,
    shortId: `${category}${index}`,
    directory,
    index,
    prefix,
    mimetype,
    format,
    filePath,
    fileName,
    assetUrl,
    assetSourceType,
    isExportableToFile,
  }
}