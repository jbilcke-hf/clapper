import { TimelineSegment } from "@/types"
import { ClapSegment } from "@aitube/clap"

export function timelineSegmentToClapSegment(timelineSegment: TimelineSegment): ClapSegment {

  const segment: any = {
    ...timelineSegment
  }

  delete segment.scene
  delete segment.startAtLine
  delete segment.endAtLine
  delete segment.audioBuffer
  delete segment.visibility
  delete segment.textures

  delete segment.isSelected
  delete segment.isHovered
  delete segment.isHoveredOnBody
  delete segment.isHoveredOnLeftHandle
  delete segment.isHoveredOnRightHandle
  delete segment.isGrabbedOnBody
  delete segment.isGrabbedOnLeftHandle
  delete segment.isGrabbedOnRightHandle
  delete segment.isActive
  delete segment.isPlaying
  delete segment.editionStatus

  return segment as ClapSegment
}