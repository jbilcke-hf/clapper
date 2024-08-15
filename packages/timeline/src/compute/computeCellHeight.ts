import { ClapTracks } from "@aitube/clap"

export function computeCellHeight({
  tracks,
  trackNumber,
  defaultCellHeight,
  defaultPreviewHeight
}: {
  tracks: ClapTracks
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
