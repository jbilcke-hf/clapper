import React, { useMemo, useState } from "react"
import { ClapSegmentCategory } from "@aitube/clap"

import { useTimeline } from "@/hooks"

const editableCategories = [
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.ACTION,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.MUSIC,
  ClapSegmentCategory.CAMERA,
  ClapSegmentCategory.GENERIC,
]

export function TimelineCreationToolbar() {
  const [category, setCategory] = useState<ClapSegmentCategory>(ClapSegmentCategory.VIDEO)
  const [selectedTrackId, setSelectedTrackId] = useState<number | "new">("new")
  const tracks = useTimeline((s) => s.tracks)
  const createTrack = useTimeline((s) => s.createTrack)
  const createClip = useTimeline((s) => s.createClip)
  const invalidate = useTimeline((s) => s.invalidate)

  const matchingTracks = useMemo(
    () => tracks.filter((track) => track.name === category),
    [category, tracks]
  )

  const handleCreateTrack = () => {
    const trackId = createTrack(category)
    setSelectedTrackId(trackId)
    invalidate()
  }

  const handleCreateClip = async () => {
    const trackId =
      selectedTrackId === "new"
        ? createTrack(category)
        : selectedTrackId

    setSelectedTrackId(trackId)
    await createClip({ trackId, category })
    invalidate()
  }

  return (
    <div className="flex h-9 items-center gap-2 border-b border-neutral-800 bg-neutral-950 px-2 text-xs text-neutral-100">
      <select
        aria-label="Track type"
        className="h-7 rounded border border-neutral-700 bg-neutral-900 px-2"
        value={category}
        onChange={(event) => {
          setCategory(event.target.value as ClapSegmentCategory)
          setSelectedTrackId("new")
        }}
      >
        {editableCategories.map((editableCategory) => (
          <option key={editableCategory} value={editableCategory}>
            {editableCategory.toLowerCase()}
          </option>
        ))}
      </select>
      <select
        aria-label="Target track"
        className="h-7 rounded border border-neutral-700 bg-neutral-900 px-2"
        value={selectedTrackId}
        onChange={(event) => {
          setSelectedTrackId(
            event.target.value === "new"
              ? "new"
              : Number(event.target.value)
          )
        }}
      >
        <option value="new">new track</option>
        {matchingTracks.map((track) => (
          <option key={track.id} value={track.id}>
            track {track.id}
          </option>
        ))}
      </select>
      <button
        className="h-7 rounded border border-neutral-700 px-2 hover:bg-neutral-800"
        type="button"
        onClick={handleCreateTrack}
      >
        Add track
      </button>
      <button
        className="h-7 rounded border border-neutral-700 bg-neutral-100 px-2 text-neutral-950 hover:bg-white"
        type="button"
        onClick={handleCreateClip}
      >
        Add clip
      </button>
    </div>
  )
}
