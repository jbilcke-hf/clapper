import { ClapProject, UUID } from '@aitube/clap'
import { TimelineStore, useTimeline } from '@aitube/timeline'
import {
  ExportableSegment,
  formatSegmentForExport,
} from '@/lib/utils/formatSegmentForExport'

export async function generateFCP(): Promise<string> {
  const timeline: TimelineStore = useTimeline.getState()
  const { title, width, height, getClap, segments: timelineSegments } = timeline

  const DEFAULT_FRAME_RATE = 24

  const formatFCPTime = (
    timeInMs: number,
    frameRate: number = DEFAULT_FRAME_RATE
  ): string => {
    const frames = Math.round((timeInMs / 1000) * frameRate)
    return `${frames}/${frameRate}s`
  }

  const clap: ClapProject | null = await getClap()
  if (!clap) {
    throw new Error('Cannot generate FCP XML without a valid CLAP project')
  }

  const createAssetFormat = (id: string): string => {
    return /* XML */ `<format id="${id}" name="FFVideoFormat${height}p${DEFAULT_FRAME_RATE}" frameDuration="${formatFCPTime(1000 / DEFAULT_FRAME_RATE)}" width="${width}" height="${height}"/>`
  }

  const resources: string[] = []
  const assetClips: string[] = []
  const formatId = `r${width}x${height}`

  resources.push(createAssetFormat(formatId))

  const exportableSegments: ExportableSegment[] = timelineSegments
    .map((segment, index) => formatSegmentForExport(segment, index))
    .filter(({ isExportableToFile }) => isExportableToFile)

  exportableSegments.forEach((exportableSegment: ExportableSegment) => {
    const { segment, filePath, category } = exportableSegment

    if (segment.assetUrl) {
      const assetId = UUID()
      resources.push(// want to see some colors? install es6-string-html in your VSCode
      /* XML */ `
        <asset id="${assetId}" name="${segment.label}" src="file://./${filePath}" start="0s" duration="${formatFCPTime(segment.assetDurationInMs)}" format="${formatId}"
          hasVideo="${category === 'video' || category === 'storyboard' ? 1 : 0}"
          hasAudio="${category === 'dialogue' || category === 'sound' || category === 'music' ? 1 : 0}"/>
      `)

      const audioRole =
        category === 'dialogue'
          ? 'dialogue'
          : category === 'sound'
            ? 'effects'
            : category === 'music'
              ? 'music'
              : ''

      assetClips.push(/* XML */ `
        <asset-clip name="${segment.label}" ref="${assetId}" offset="${formatFCPTime(segment.startTimeInMs)}" duration="${formatFCPTime(segment.endTimeInMs - segment.startTimeInMs)}" start="${formatFCPTime(0)}" 
          ${category === 'video' || category === 'storyboard' ? '' : `audioRole="${audioRole}"`}/>
      `)
    }
  })

  return /* XML */ `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.8">
  <resources>
    ${resources.join('\n')}
  </resources>
  <library>
    <event name="${title}">
      <project name="${title}">
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

export async function generateFCP7XML(): Promise<string> {
  const timeline: TimelineStore = useTimeline.getState()
  const {
    title,
    durationInMs,
    width,
    height,
    segments: timelineSegments,
  } = timeline

  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="5">
  <sequence>
    <name>${title}</name>
    <duration>${durationInMs / 1000}</duration>
    <rate>
      <timebase>30</timebase>
      <ntsc>FALSE</ntsc>
    </rate>
    <media>
      <video>
        <format>
          <samplecharacteristics>
            <width>${width}</width>
            <height>${height}</height>
          </samplecharacteristics>
        </format>
        <track>
`

  const exportableSegments: ExportableSegment[] = timelineSegments
    .map((segment, index) => formatSegmentForExport(segment, index))
    .filter(({ isExportableToFile }) => isExportableToFile)

  exportableSegments.forEach((exportableSegment: ExportableSegment) => {
    const { segment, filePath } = exportableSegment
    xmlContent += `
          <clipitem>
            <name>${segment.label}</name>
            <duration>${(segment.endTimeInMs - segment.startTimeInMs) / 1000}</duration>
            <start>${segment.startTimeInMs / 1000}</start>
            <end>${segment.endTimeInMs / 1000}</end>
            <file>
              <name>${filePath}</name>
              <pathurl>file://localhost/${filePath}</pathurl>
            </file>
          </clipitem>
`
  })

  xmlContent += `
        </track>
      </video>
    </media>
  </sequence>
</xmeml>`

  return xmlContent
}
