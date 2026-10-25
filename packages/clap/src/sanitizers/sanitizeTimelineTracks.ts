import { ClapSegmentCategory, ClapTrackDescriptor } from '@/types'

export function sanitizeTimelineTracks(value: unknown): ClapTrackDescriptor[] | undefined {
  if (!Array.isArray(value)) return undefined
  const ids = new Set<number>()
  const categories = new Set<string>(Object.values(ClapSegmentCategory))
  const tracks: ClapTrackDescriptor[] = []
  for (const track of value) {
    if (
      !track ||
      typeof track !== 'object' ||
      !Number.isSafeInteger(track.id) ||
      track.id < 0 ||
      track.id >= 4096 ||
      !categories.has(track.category) ||
      ids.has(track.id)
    )
      continue
    ids.add(track.id)
    tracks.push({
      id: track.id,
      name: typeof track.name === 'string' ? track.name : track.category,
      category: track.category,
      visible: typeof track.visible === 'boolean' ? track.visible : true,
    })
  }
  return tracks
}
