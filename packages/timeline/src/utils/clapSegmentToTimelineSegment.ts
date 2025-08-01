import { ClapOutputType, ClapSegment } from "@aitube/clap"

import { SegmentEditionStatus, SegmentVisibility, TimelineSegment } from "@/types"
import { getAudioBuffer } from "./getAudioBuffer"
import { getSegmentColorScheme } from "./getSegmentColorScheme"

export async function clapSegmentToTimelineSegment(clapSegment: ClapSegment): Promise<TimelineSegment> {

  const segment = clapSegment as TimelineSegment

  if (!segment.visibility) { segment.visibility = SegmentVisibility.HIDDEN }

  if (!segment.textures) { segment.textures = {} }

  if (typeof segment.isSelected !== "boolean") { segment.isSelected = false }

  if (typeof segment.isHovered !== "boolean") { segment.isHovered = false }

  if (typeof segment.isActive !== "boolean") { segment.isActive = false }

  if (typeof segment.isPlaying !== "boolean") { segment.isPlaying = false }

  if (typeof segment.isHoveredOnBody !== "boolean") { segment.isHoveredOnBody = false }

  if (typeof segment.isHoveredOnLeftHandle !== "boolean") { segment.isHoveredOnLeftHandle = false }

  if (typeof segment.isHoveredOnRightHandle !== "boolean") { segment.isHoveredOnRightHandle = false }

  if (typeof segment.isGrabbedOnBody !== "boolean") { segment.isGrabbedOnBody = false }

  if (typeof segment.isGrabbedOnLeftHandle !== "boolean") { segment.isGrabbedOnLeftHandle = false }

  if (typeof segment.isGrabbedOnRightHandle !== "boolean") { segment.isGrabbedOnRightHandle = false }

  if (!segment.editionStatus) { segment.editionStatus = SegmentEditionStatus.EDITABLE }

  segment.colors = getSegmentColorScheme(segment)

  if (!segment?.audioBuffer) {
    if (segment?.outputType === ClapOutputType.AUDIO) {
      try {
        segment.audioBuffer = await getAudioBuffer(segment.assetUrl)
      } catch (err) {
        console.warn(`failed to load the audio file: ${err} (first 128 chars of assetUrl look like this: "${segment.assetUrl.slice(0, 128)}")`)
      }
    }
  }
  
  return segment
} 