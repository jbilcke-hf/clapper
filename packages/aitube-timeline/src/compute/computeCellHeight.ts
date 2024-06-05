import { Tracks } from "@/types/timeline"

export function computeCellHeight({
  tracks,
  trackNumber,
  defaultCellHeight,
  defaultPreviewHeight
}: {
  tracks: Tracks
  trackNumber: number
  defaultCellHeight: number
  defaultPreviewHeight: number
}): number {
  let cellHeight = defaultCellHeight

  if (typeof trackNumber === "number" && !isNaN(trackNumber) && isFinite(trackNumber)) {
    const track = tracks[trackNumber]
    if (track) {
      cellHeight =
        track.isPreview && track.visible
        ? defaultPreviewHeight
        : track.visible
        ? track.height
        : defaultCellHeight
    } else {
      // missing data
    }
  }

  return cellHeight
}
