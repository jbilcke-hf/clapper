import { ClapSegmentCategory, ClapTracks } from "../types"

export function sanitizeTracks(input: unknown[]): ClapTracks {
  const ids = new Set<number>()
  return input.flatMap((value): ClapTracks => {
    if (!value || typeof value !== "object") return []
    const track = value as Record<string, unknown>
    if (typeof track.id !== "number" || !Number.isSafeInteger(track.id) || track.id < 0 || track.id > 10000 || ids.has(track.id)) return []
    ids.add(track.id)
    const category = Object.values(ClapSegmentCategory).includes(track.category as ClapSegmentCategory)
      ? track.category as ClapSegmentCategory : undefined
    return [{
      id: track.id,
      category,
      name: typeof track.name === "string" ? track.name : category || "(empty)",
      isPreview: category === ClapSegmentCategory.IMAGE || category === ClapSegmentCategory.VIDEO,
      height: typeof track.height === "number" && Number.isFinite(track.height) && track.height > 0 ? Math.min(track.height, 10000) : 48,
      hue: typeof track.hue === "number" && Number.isFinite(track.hue) ? track.hue : 0,
      occupied: track.occupied === true,
      visible: track.visible !== false,
    }]
  })
}
