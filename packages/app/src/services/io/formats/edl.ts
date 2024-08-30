import {
  ClapAssetSource,
  ClapProject,
  ClapSegment,
  ClapSegmentCategory,
  UUID,
} from '@aitube/clap'
import {
  TimelineSegment,
  timelineSegmentToClapSegment,
  TimelineStore,
  useTimeline,
} from '@aitube/timeline'
import {
  ExportableSegment,
  formatSegmentForExport,
} from '@/lib/utils/formatSegmentForExport'

const secondsToTimecode = (seconds: number, fps: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const f = Math.floor((seconds % 1) * fps)

  const pad = (n: number): string => n.toString().padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`
}

export async function generateEDL(): Promise<string> {
  const timeline: TimelineStore = useTimeline.getState()
  const {
    meta,
    getClap,
    totalDurationInMs,
    segments: timelineSegments,
  } = timeline

  const clap: ClapProject | null = await getClap()
  if (!clap) {
    throw new Error('Cannot generate EDL without a valid CLAP project')
  }

  const fps = 30 // Assuming 30 fps, adjust as needed

  const formatEDLTime = (timeInMs: number): string => {
    return secondsToTimecode(timeInMs / 1000, fps)
  }

  const getReelName = (filePath: string): string => {
    const folderName = filePath.split('/')[0].toUpperCase()
    return folderName.slice(0, 7) // Limit to 7 characters for EDL compatibility
  }

  let edlContent = `TITLE: ${meta.title}\nFCM: NON-DROP FRAME\n\n`
  let timelineInPoint = 0

  const exportableSegments: ExportableSegment[] = timelineSegments
    .map((segment, index) => formatSegmentForExport(segment, index))
    .filter(({ isExportableToFile }) => isExportableToFile)

  exportableSegments.forEach(
    (exportableSegment: ExportableSegment, index: number) => {
      const { segment, filePath, category } = exportableSegment

      if (
        segment.assetUrl &&
        segment.assetSourceType === ClapAssetSource.PATH
      ) {
        const reelName = getReelName(filePath)
        const eventNumber = (index + 1).toString().padStart(3, '0')

        const clipInPoint = formatEDLTime(segment.startTimeInMs)
        const clipOutPoint = formatEDLTime(segment.endTimeInMs)
        const timelineOutPoint = formatEDLTime(
          timelineInPoint + (segment.endTimeInMs - segment.startTimeInMs)
        )

        edlContent += `${eventNumber}  ${reelName} AA/V  C        ${clipInPoint} ${clipOutPoint} ${formatEDLTime(timelineInPoint)} ${timelineOutPoint}\n`
        edlContent += `* FROM CLIP NAME: ${filePath}\n`
        edlContent += `* COMMENT:\nFINAL CUT PRO REEL: ${filePath} REPLACED BY: ${reelName}\n\n`

        timelineInPoint += segment.endTimeInMs - segment.startTimeInMs
      }
    }
  )

  return edlContent
}
