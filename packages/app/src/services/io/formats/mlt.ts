import {
  ExportableSegment,
  formatDuration,
  formatSegmentForExport,
} from '@/lib/utils'
import { ClapSegmentCategory } from '@aitube/clap'
import { TimelineStore, useTimeline } from '@aitube/timeline'

export async function generateMLT(): Promise<string> {
  const timeline: TimelineStore = useTimeline.getState()
  const { meta, segments: timelineSegments } = timeline

  const segments: ExportableSegment[] = timelineSegments
    .map((segment, i) => formatSegmentForExport(segment, i))
    .filter(({ isExportableToFile }) => isExportableToFile)

  const videos: ExportableSegment[] = segments.filter(
    ({ segment }) => segment.category === ClapSegmentCategory.VIDEO
  )

  const storyboards: ExportableSegment[] = segments.filter(
    ({ segment }) => segment.category === ClapSegmentCategory.STORYBOARD
  )

  const dialogues: ExportableSegment[] = segments.filter(
    ({ segment }) => segment.category === ClapSegmentCategory.DIALOGUE
  )

  const sounds: ExportableSegment[] = segments.filter(
    ({ segment }) => segment.category === ClapSegmentCategory.SOUND
  )

  const music: ExportableSegment[] = segments.filter(
    ({ segment }) => segment.category === ClapSegmentCategory.MUSIC
  )

  // want to see some colors? install es6-string-html in your VSCode
  return /* XML */ `<?xml version="1.0" standalone="no"?>
<mlt LC_NUMERIC="C" version="7.24.0" title="${meta.title}" producer="main_bin">
<profile
description="${meta.width}:${meta.height}"
width="${meta.width}"
height="${meta.height}"
progressive="0"
sample_aspect_num="1"
sample_aspect_den="1"
display_aspect_num="16"
display_aspect_den="9"

${
  ''
  // a good reminder we should add a feature to keep track of the FPS in Clapper
}
frame_rate_num="25"
frame_rate_den="1"
colorspace="709"
/>
<playlist id="main_bin">
<property name="xml_retain">1</property>
</playlist>
<producer id="black" in="00:00:00.000" out="${formatDuration(meta.durationInMs)}">
<property name="length">${formatDuration(meta.durationInMs)}</property>
<property name="eof">pause</property>
<property name="resource">0</property>
<property name="aspect_ratio">1</property>
<property name="mlt_service">color</property>
<property name="mlt_image_format">rgba</property>
<property name="set.test_audio">0</property>
</producer>
<playlist id="background">
<entry producer="black" in="00:00:00.000" out="${formatDuration(meta.durationInMs)}" />
</playlist>
${segments
  .map(
    ({ segment, shortId, fileName, filePath, index }) => /* XML */ `
<producer
id="${shortId}"
in="${formatDuration(0)}"
out="${formatDuration(meta.durationInMs)}">
<property name="length">${formatDuration(meta.durationInMs)}</property>
<property name="eof">pause</property>
<property name="resource">${filePath}</property>
<property name="ttl">1</property>
<property name="aspect_ratio">1</property>
<property name="meta.media.progressive">1</property>
<property name="seekable">1</property>
<property name="format">1</property>
<property name="meta.media.width">${meta.width}</property>
<property name="meta.media.height">${meta.height}</property>
<property name="mlt_service">qimage</property>
<property name="creation_time">${
      segment.createdAt || new Date().toISOString()
    }</property>
<property name="shotcut:skipConvert">1</property>
${
  // uh, okay.. do we really need this?..
  // <property name="shotcut:hash">b22b329e4916bda3ada2ed544c9ba2b9</property>
  ''
}
<property name="shotcut:caption">${fileName}</property>
${
  ''
  // not sure what  <property name="xml">was here</property
  // is supposed to be
}
<property name="xml">was here</property>
</producer>
`
  )
  .join('')}
<playlist id="playlist0">
<property name="shotcut:video">1</property>
<property name="shotcut:name">Video clips</property>
${videos
  .map(
    ({ segment, shortId }) => /* XML */ `
<entry
  producer="${shortId}"
  in="${formatDuration(0)}"
  out="${formatDuration(segment.assetDurationInMs)}"
/>
`
  )
  .join('')}
</playlist>
<playlist id="playlist1">
<property name="shotcut:video">1</property>
<property name="shotcut:name">Storyboards</property>
${storyboards
  .map(
    ({ segment, shortId }) => /* XML */ `
<entry
  producer="${shortId}"
  in="${formatDuration(0)}"
  out="${formatDuration(segment.assetDurationInMs)}"
/>
`
  )
  .join('')}
</playlist>
${[...dialogues, ...sounds, ...music].map(
  ({ segment, filePath, fileName, shortId }) => /* XML */ `
<chain id="${shortId}" out="${formatDuration(meta.durationInMs)}">
<property name="length">${formatDuration(meta.durationInMs)}</property>
<property name="eof">pause</property>
<property name="resource">${filePath}</property>
<property name="mlt_service">avformat-novalidate</property>
<property name="meta.media.nb_streams">1</property>
<property name="meta.media.0.stream.type">audio</property>
${
  ''
  /*
I don't think we absolutely need to provide those as this is just meta

<property name="meta.media.0.codec.sample_fmt">fltp</property>
<property name="meta.media.0.codec.sample_rate">44100</property>
<property name="meta.media.0.codec.channels">2</property>
<property name="meta.media.0.codec.layout">stereo</property>
<property name="meta.media.0.codec.name">mp3float</property>
<property name="meta.media.0.codec.long_name">MP3 (MPEG audio layer 3)</property>
<property name="meta.media.0.codec.bit_rate">150551</property>
<property name="meta.attr.0.stream.encoder.markup">Lavc60.3.</property>
<property name="meta.attr.encoder.markup">Lavf60.3.100</property>
*/
}
<property name="seekable">1</property>
<property name="audio_index">0</property>
<property name="video_index">-1</property>
<property name="creation_time">${segment.createdAt}</property>
<property name="astream">0</property>
<property name="shotcut:skipConvert">1</property>
${
  ''
  // yeah well, let's skip this one as well
  // <property name="shotcut:hash">ee26f27a566e64d5ed116f433012e3d6</property>
}
<property name="shotcut:caption">${fileName}</property>
</chain>`
)}
<playlist id="playlist2">
<property name="shotcut:audio">1</property>
<property name="shotcut:name">Dialogues &amp; speech</property>
${dialogues.map(
  ({ segment, shortId }) => /* XML */ `
<entry
  producer="${shortId}"
  in="${segment.startTimeInMs}"
  out="${segment.endTimeInMs}"
/>
`
)}
</playlist>
<playlist id="playlist3">
<property name="shotcut:audio">1</property>
<property name="shotcut:name">Sound effects</property>
${sounds.map(
  ({ segment, shortId }) => /* XML */ `
<entry
  producer="${shortId}"
  in="${segment.startTimeInMs}"
  out="${segment.endTimeInMs}"
/>
`
)}
</playlist>
<playlist id="playlist4">
<property name="shotcut:audio">1</property>
<property name="shotcut:name">Music</property>
${music.map(
  ({ segment, shortId }) => /* XML */ `
<entry
  producer="${shortId}"
  in="${segment.startTimeInMs}"
  out="${segment.endTimeInMs}"
/>
`
)}
</playlist>
<tractor
id="tractor0"
title="Shotcut version 24.04.28"
in="00:00:00.000"
out="${formatDuration(meta.durationInMs)}">
<property name="shotcut">1</property>
<property name="shotcut:projectAudioChannels">2</property>
<property name="shotcut:projectFolder">1</property>
<property name="shotcut:skipConvert">0</property>
<track producer="background"/>
<track producer="playlist0"/>
<track producer="playlist1"/>
<track producer="playlist2" hide="video" />
<track producer="playlist3" hide="video" />
<track producer="playlist4" hide="video" />
<transition id="transition0">
  <property name="a_track">0</property>
  <property name="b_track">1</property>
  <property name="mlt_service">mix</property>
  <property name="always_active">1</property>
  <property name="sum">1</property>
</transition>
<transition id="transition1">
  <property name="a_track">0</property>
  <property name="b_track">1</property>
  <property name="version">0.1</property>
  <property name="mlt_service">frei0r.cairoblend</property>
  <property name="threads">0</property>
  <property name="disable">1</property>
</transition>
<transition id="transition2">
<property name="a_track">0</property>
<property name="b_track">1</property>
<property name="version">0.1</property>
<property name="mlt_service">frei0r.cairoblend</property>
<property name="threads">0</property>
<property name="disable">1</property>
</transition>
<transition id="transition3">
  <property name="a_track">0</property>
  <property name="b_track">2</property>
  <property name="mlt_service">mix</property>
  <property name="always_active">1</property>
  <property name="sum">1</property>
</transition>
<transition id="transition4">
<property name="a_track">0</property>
<property name="b_track">3</property>
<property name="mlt_service">mix</property>
<property name="always_active">1</property>
<property name="sum">1</property>
</transition>
<transition id="transition5">
<property name="a_track">0</property>
<property name="b_track">3</property>
<property name="mlt_service">mix</property>
<property name="always_active">1</property>
<property name="sum">1</property>
</transition>
</tractor>
</mlt>`
}
