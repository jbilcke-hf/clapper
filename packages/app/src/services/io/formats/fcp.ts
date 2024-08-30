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

export async function generateFCP(): Promise<string> {
  const timeline: TimelineStore = useTimeline.getState()
  const {
    meta,
    getClap,
    totalDurationInMs,
    segments: timelineSegments,
  } = timeline

  const clap: ClapProject | null = await getClap()
  if (!clap) {
    throw new Error('Cannot generate FCP XML without a valid CLAP project')
  }

  // Assuming a default frame rate of 30 fps if not specified elsewhere
  const DEFAULT_FRAME_RATE = 30

  const formatFCPTime = (timeInMs: number): string => {
    const frames = Math.round((timeInMs / 1000) * DEFAULT_FRAME_RATE)
    return `${frames}/${DEFAULT_FRAME_RATE}s`
  }

  const createAssetFormat = (id: string): string => {
    return `<format id="${id}" name="FFVideoFormat${meta.height}p${DEFAULT_FRAME_RATE}" frameDuration="${formatFCPTime(1000 / DEFAULT_FRAME_RATE)}" width="${meta.width}" height="${meta.height}"/>`
  }

  const getAssetPath = (segment: ClapSegment): string => {
    switch (segment.category) {
      case ClapSegmentCategory.VIDEO:
        return `video/${segment.id}.mp4`
      case ClapSegmentCategory.STORYBOARD:
        return `storyboard/${segment.id}.png`
      case ClapSegmentCategory.DIALOGUE:
        return `dialogue/${segment.id}.mp3`
      case ClapSegmentCategory.SOUND:
        return `sound/${segment.id}.mp3`
      case ClapSegmentCategory.MUSIC:
        return `music/${segment.id}.mp3`
      default:
        return `unknown/${segment.id}`
    }
  }

  const resources: string[] = []
  const assetClips: string[] = []
  const formatId = `r${meta.width}x${meta.height}`

  // Add the main format
  resources.push(createAssetFormat(formatId))

  timelineSegments.forEach((segment: TimelineSegment) => {
    const clapSegment = timelineSegmentToClapSegment(segment)

    // note: exportToFCP is currently only called from out ZIP archive exporter,
    // so we don't need to assume that this assertion is true:
    // clapSegment.assetSourceType === ClapAssetSource.PATH
    // (in fact, it will be false)
    if (clapSegment.assetUrl) {
      // if (clapSegment.assetUrl && clapSegment.assetSourceType === ClapAssetSource.PATH) {

      const assetId = UUID()
      const assetPath = getAssetPath(clapSegment)
      resources.push(`
        <asset id="${assetId}" name="${clapSegment.label}" src="file://./${assetPath}" start="0s" duration="${formatFCPTime(clapSegment.assetDurationInMs)}" format="${formatId}"
          hasVideo="${clapSegment.category === ClapSegmentCategory.VIDEO || clapSegment.category === ClapSegmentCategory.STORYBOARD ? 1 : 0}"
          hasAudio="${clapSegment.category === ClapSegmentCategory.DIALOGUE || clapSegment.category === ClapSegmentCategory.SOUND || clapSegment.category === ClapSegmentCategory.MUSIC ? 1 : 0}"/>
      `)

      const audioRole =
        clapSegment.category === ClapSegmentCategory.DIALOGUE
          ? 'dialogue'
          : clapSegment.category === ClapSegmentCategory.SOUND
            ? 'effects'
            : clapSegment.category === ClapSegmentCategory.MUSIC
              ? 'music'
              : ''

      assetClips.push(`
        <asset-clip name="${clapSegment.label}" ref="${assetId}" offset="${formatFCPTime(clapSegment.startTimeInMs)}" duration="${formatFCPTime(clapSegment.endTimeInMs - clapSegment.startTimeInMs)}" start="${formatFCPTime(0)}" 
          ${clapSegment.category === ClapSegmentCategory.VIDEO || clapSegment.category === ClapSegmentCategory.STORYBOARD ? '' : `audioRole="${audioRole}"`}/>
      `)
    }
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.8">
  <resources>
    ${resources.join('\n')}
  </resources>
  <library>
    <event name="${meta.title}">
      <project name="${meta.title}">
        <sequence format="${formatId}" tcStart="0s" tcFormat="NDF" audioLayout="stereo" audioRate="48k">
          <spine>
            ${assetClips.join('\n')}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>`
}
