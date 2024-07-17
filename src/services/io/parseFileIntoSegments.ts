'use client'

import {
  ClapAssetSource,
  ClapOutputType,
  ClapSegmentCategory,
  ClapSegmentStatus,
  newSegment,
  UUID,
} from '@aitube/clap'
import {
  clapSegmentToTimelineSegment,
  SegmentEditionStatus,
  SegmentVisibility,
  TimelineSegment,
} from '@aitube/timeline'

import { blobToBase64DataUri } from '@/lib/utils/blobToBase64DataUri'

import { analyzeAudio } from '../audio/analyzeAudio'
import { ResourceCategory, ResourceType } from '@aitube/clapper-services'

export async function parseFileIntoSegments({
  file,
}: {
  /**
   * The file to import
   */
  file: File
}): Promise<TimelineSegment[]> {
  // console.log(`parseFileIntoSegments(): filename = ${file.name}`)
  // console.log(`parseFileIntoSegments(): file size = ${file.size} bytes`)
  // console.log(`parseFileIntoSegments(): file type = ${file.type}`)

  const extension = file.name.split('.').pop()?.toLowerCase()

  console.log(
    'TODO: open a popup to ask if this is a voice character sample, dialogue, music etc'
  )

  let type: ResourceType = 'misc'
  let resourceCategory: ResourceCategory = 'misc'

  const newSegments: TimelineSegment[] = []

  switch (file.type) {
    case 'image/webp':
      type = 'image'
      resourceCategory = 'control_image'
      break

    case 'audio/mpeg': // this is the "official" one
    case 'audio/mp3': // this is just an alias
    case 'audio/wav':
    case 'audio/mp4':
    case 'audio/x-mp4': // should be rare, normally is is audio/mp4
    case 'audio/m4a': // shouldn't exist
    case 'audio/x-m4a': // should be rare, normally is is audio/mp4
    case 'audio/webm':
      // for background track, or as an inspiration track, or a voice etc
      type = 'audio'
      resourceCategory = 'background_music'

      // TODO: add caption analysis
      const { durationInMs, durationInSteps, bpm, audioBuffer } =
        await analyzeAudio(file)
      console.log('User dropped an audio sample:', {
        bpm,
        durationInMs,
        durationInSteps,
      })

      // TODO: use the correct drop time
      const startTimeInMs = 0
      const startTimeInSteps = 1

      const endTimeInSteps = durationInSteps
      const endTimeInMs = startTimeInMs + durationInMs

      // ok let's stop for a minute there:
      // if someone drops a .mp3, and assuming we don't yet have the UI to select the category,
      // do you think it should be a SOUND, a VOICE or a MUSIC by default?
      // I expect people will use AI service providers for sound and voice,
      // maybe in some case music too, but there are also many people
      // who will want to use their own track eg. to create a music video
      const category = ClapSegmentCategory.MUSIC

      const assetUrl = await blobToBase64DataUri(file)

      const newSegmentData: Partial<TimelineSegment> = {
        prompt: 'audio track',
        startTimeInMs, // start time of the segment
        endTimeInMs, // end time of the segment (startTimeInMs + durationInMs)
        status: ClapSegmentStatus.COMPLETED,
        // track: findFreeTrack({ segments, startTimeInMs, endTimeInMs }), // track row index
        label: `${file.name} (${Math.round(durationInMs / 1000)}s @ ${Math.round(bpm * 100) / 100} BPM)`, // a short label to name the segment (optional, can be human or LLM-defined)
        category,
        assetUrl,
        assetDurationInMs: endTimeInMs,
        assetSourceType: ClapAssetSource.DATA,
        assetFileFormat: `${file.type}`,
      }

      const timelineSegment = await clapSegmentToTimelineSegment(
        newSegment(newSegmentData)
      )
      timelineSegment.outputType = ClapOutputType.AUDIO
      timelineSegment.outputGain = 1.0
      timelineSegment.audioBuffer = audioBuffer

      // we assume we want it to be immediately visible
      timelineSegment.visibility = SegmentVisibility.VISIBLE

      // console.log("newSegment:", audioSegment)

      // poof! type disappears.. it's magic
      newSegments.push(timelineSegment)
      break

    case 'text/plain':
      // for dialogue, prompts..
      type = 'text'
      resourceCategory = 'text_prompt'
      break

    default:
      console.log(`unrecognized file type "${file.type}"`)
      break
  }

  // note: we always upload the files, because even if it is an unhandled format (eg. a PDF)
  // this can still be part of the project as a resource for humans (inspiration, guidelines etc)

  const id = UUID()
  const fileName = `${id}.${extension}`

  const storage = `resources`
  const filePath = `${type}/${fileName}`

  /*
  const { data, error } = await supabase
    .storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })
  */

  // Note: uploading is optional, some file type don't need it (eg. text prompt)

  return newSegments
}
