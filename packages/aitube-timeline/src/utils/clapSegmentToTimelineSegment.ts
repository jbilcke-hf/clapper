import { ClapOutputType, ClapSegment } from "@aitube/clap"

import { SegmentEditionStatus, SegmentVisibility, TimelineSegment } from "@/types"
import { getAudioBuffer } from "./getAudioBuffer"

export async function clapSegmentToTimelineSegment(clapSegment: ClapSegment): Promise<TimelineSegment> {

  const segment = clapSegment as TimelineSegment

  if (!segment.visibility) { segment.visibility = SegmentVisibility.HIDDEN }

  if (!segment.textures) { segment.textures = {} }

  if (typeof segment.isSelected !== "boolean") { segment.isSelected = false }

  if (typeof segment.isHovered !== "boolean") { segment.isHovered = false }

  if (typeof segment.isActive !== "boolean") { segment.isActive = false }

  if (typeof segment.isPlaying !== "boolean") { segment.isPlaying = false }

  if (!segment.editionStatus) { segment.editionStatus = SegmentEditionStatus.EDITABLE }


  if (!segment.audioBuffer) {
    if (segment.outputType === ClapOutputType.AUDIO) {
      try {
        segment.audioBuffer = await getAudioBuffer(segment.assetUrl)
      } catch (err) {
        console.error(`failed to load the audio file: ${err}`)
      }
    }
  }
  
  return segment
} 