import { ClapSegmentCategory } from "@aitube/clap"
import type { CSSProperties } from "react"

import { useTimeline } from "@/hooks"
import { TIMELINE_AUTHORING_CATEGORIES, getTrackCategory } from "@/utils/timelineAuthoring"

const toolbarStyle: CSSProperties = {
  position: "absolute",
  left: 12,
  top: 10,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  borderRadius: 6,
  background: "rgba(17, 24, 39, 0.88)",
  color: "white",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.22)",
  fontSize: 12,
}

const controlStyle: CSSProperties = {
  height: 28,
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: 4,
  background: "rgba(255, 255, 255, 0.08)",
  color: "white",
  padding: "0 8px",
}

const buttonStyle: CSSProperties = {
  ...controlStyle,
  cursor: "pointer",
  fontWeight: 600,
}

export function TimelineAuthoringToolbar() {
  const tracks = useTimeline(state => state.tracks)
  const selectedTrackId = useTimeline(state => state.selectedTrackId)
  const selectedTrackCategory = useTimeline(state => state.selectedTrackCategory)
  const setSelectedTrack = useTimeline(state => state.setSelectedTrack)
  const setSelectedTrackCategory = useTimeline(state => state.setSelectedTrackCategory)
  const setTrackCategory = useTimeline(state => state.setTrackCategory)
  const createTrack = useTimeline(state => state.createTrack)
  const createClipOnTrack = useTimeline(state => state.createClipOnTrack)

  const selectedTrack = typeof selectedTrackId === "number" ? tracks[selectedTrackId] : undefined
  const selectedTrackCategoryFromTrack = getTrackCategory(selectedTrack)
  const activeCategory = selectedTrackCategoryFromTrack || selectedTrackCategory
  const selectedTrackCanChangeCategory = Boolean(selectedTrack) && !selectedTrack?.occupied

  const handleCategoryChange = (value: string) => {
    const category = value as ClapSegmentCategory
    if (typeof selectedTrackId !== "number") {
      setSelectedTrackCategory(category)
      return
    }

    if (setTrackCategory(selectedTrackId, category)) {
      setSelectedTrackCategory(category)
    }
  }

  return (
    <div style={toolbarStyle}>
      <select
        aria-label="Track"
        value={selectedTrackId ?? ""}
        onChange={event => setSelectedTrack(event.target.value === "" ? undefined : Number(event.target.value))}
        style={{ ...controlStyle, minWidth: 110 }}
      >
        <option value="">Track</option>
        {tracks.map(track => (
          <option key={track.id} value={track.id}>
            {`Track ${track.id}`}
          </option>
        ))}
      </select>
      <select
        aria-label="Clip type"
        value={activeCategory}
        onChange={event => handleCategoryChange(event.target.value)}
        disabled={Boolean(selectedTrack) && !selectedTrackCanChangeCategory}
        style={{ ...controlStyle, minWidth: 110 }}
      >
        {TIMELINE_AUTHORING_CATEGORIES.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button
        type="button"
        style={buttonStyle}
        onClick={() => createTrack(activeCategory)}
      >
        + Track
      </button>
      <button
        type="button"
        style={buttonStyle}
        onClick={() => {
          void createClipOnTrack({
            trackId: selectedTrackId,
            category: activeCategory,
          })
        }}
      >
        + Clip
      </button>
    </div>
  )
}
