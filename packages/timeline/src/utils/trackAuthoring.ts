import { ClapOutputType, ClapSegment, ClapSegmentCategory, ClapTrack, ClapTrackDescriptor } from '@aitube/clap'

export function isTrackCategory(value: unknown): value is ClapSegmentCategory {
  return typeof value === 'string' && Object.values(ClapSegmentCategory).includes(value as ClapSegmentCategory)
}

export function getTrackCategory(track: ClapTrack | undefined, segments: ClapSegment[]): ClapSegmentCategory | undefined {
  if (!track || track.mixed) return undefined
  const categories = new Set(segments.filter(segment => segment.track === track.id).map(segment => segment.category))
  if (categories.size > 1) return undefined
  const category = categories.values().next().value as ClapSegmentCategory | undefined
  return category || track.category
}

export function getClipOutputType(category: ClapSegmentCategory): ClapOutputType {
  switch (category) {
    case ClapSegmentCategory.VIDEO:
      return ClapOutputType.VIDEO
    case ClapSegmentCategory.IMAGE:
      return ClapOutputType.IMAGE
    case ClapSegmentCategory.DEPTH:
      return ClapOutputType.IMAGE_DEPTH
    case ClapSegmentCategory.MUSIC:
    case ClapSegmentCategory.SOUND:
    case ClapSegmentCategory.DIALOGUE:
      return ClapOutputType.AUDIO
    case ClapSegmentCategory.EVENT:
      return ClapOutputType.EVENT
    case ClapSegmentCategory.INTERFACE:
      return ClapOutputType.INTERFACE
    case ClapSegmentCategory.PHENOMENON:
      return ClapOutputType.PHENOMENON
    case ClapSegmentCategory.TRANSITION:
      return ClapOutputType.TRANSITION
    default:
      return ClapOutputType.TEXT
  }
}

export function describeTracks(tracks: ClapTrack[], segments: ClapSegment[]): ClapTrackDescriptor[] {
  return tracks.flatMap(track => {
    const category = getTrackCategory(track, segments)
    return category ? [{ id: track.id, name: track.name, category, visible: track.visible }] : []
  })
}

export function canMoveToTrack(segment: ClapSegment, track: ClapTrack | undefined, segments: ClapSegment[]): boolean {
  return !!track && (track.id === segment.track || getTrackCategory(track, segments) === segment.category)
}
