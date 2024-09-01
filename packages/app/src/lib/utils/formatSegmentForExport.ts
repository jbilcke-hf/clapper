import { ClapAssetSource, ClapSegmentCategory } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'

export type ExportableSegment = {
  id: string

  segment: TimelineSegment

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

export function formatSegmentForExport(
  segment: TimelineSegment,
  index: number
): ExportableSegment {
  const directory = `${segment.category}`.toLowerCase()
  const prefix = `shot_${String(index).padStart(4, '0')}_`

  const notFoundFileFormat = 'unknown/unknown'
  let fallbackFileFormat = notFoundFileFormat

  if (segment.assetUrl.startsWith('data:')) {
    const reg = new RegExp(/data:(.*);base64/gi)
    fallbackFileFormat = `${reg.exec(segment.assetUrl)?.[1] || notFoundFileFormat}`
  }

  // old .clap files might not have the `assetFileFormat`
  // which is why we perform a fallback check
  let mimetype = `${segment.assetFileFormat || fallbackFileFormat}`
  if (mimetype === 'audio/mpeg') {
    mimetype = 'audio/mp3'
  }
  const format = `${mimetype.split('/').pop() || 'unknown'}`.toLowerCase()
  const fileName = `${prefix}${segment.id}.${format}`
  const filePath = `${directory}/${fileName}`
  let assetUrl = segment.assetUrl || ''
  let assetSourceType = segment.assetSourceType || ClapAssetSource.EMPTY

  const isExportableToFile =
    (segment.category === ClapSegmentCategory.VIDEO ||
      segment.category === ClapSegmentCategory.IMAGE ||
      segment.category === ClapSegmentCategory.DIALOGUE ||
      segment.category === ClapSegmentCategory.SOUND ||
      segment.category === ClapSegmentCategory.MUSIC) &&
    format !== 'unknown' &&
    segment.assetUrl.startsWith('data:')

  const category = segment.category.toLocaleLowerCase()

  return {
    id: segment.id,
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
