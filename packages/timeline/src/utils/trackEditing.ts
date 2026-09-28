import { ClapOutputType, ClapSegmentCategory, ClapTracks } from "@aitube/clap"
import type { TimelineSegment } from "../types/timeline"

export function trackCategory(tracks: ClapTracks, segments: TimelineSegment[], trackId: number): ClapSegmentCategory | undefined {
  const categories = new Set(segments.filter(s => s.track === trackId).map(s => s.category))
  if (categories.size > 1) return undefined
  return categories.size === 1 ? [...categories][0] : tracks[trackId]?.category
}

export function outputTypeForCategory(category: ClapSegmentCategory): ClapOutputType {
  if ([ClapSegmentCategory.DIALOGUE, ClapSegmentCategory.SOUND, ClapSegmentCategory.MUSIC].includes(category)) return ClapOutputType.AUDIO
  if (category === ClapSegmentCategory.IMAGE) return ClapOutputType.IMAGE
  if (category === ClapSegmentCategory.VIDEO) return ClapOutputType.VIDEO
  return Object.values(ClapOutputType).includes(category as unknown as ClapOutputType)
    ? category as unknown as ClapOutputType : ClapOutputType.TEXT
}

export function trackAtPosition(tracks: ClapTracks, position: number): number | undefined {
  if (!Number.isFinite(position) || position < 0) return undefined
  let bottom = 0
  for (const track of tracks) {
    bottom += track.height
    if (position < bottom) return track.id
  }
  return undefined
}
