import { ClapAssetSource, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

export type ExportableSegment = {
  segment: ClapSegment
  directory: string
  index: number
  prefix: string
  mimetype: string
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

  return {
    segment,
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