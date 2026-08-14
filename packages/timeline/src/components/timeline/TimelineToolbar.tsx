import { useState, type CSSProperties } from "react"
import { ClapSegmentCategory } from "@aitube/clap"

import { useTimeline } from "@/hooks"

const trackTypeOptions: Array<{ label: string; value: ClapSegmentCategory }> = [
  { label: "Video", value: ClapSegmentCategory.VIDEO },
  { label: "Image", value: ClapSegmentCategory.IMAGE },
  { label: "Dialogue", value: ClapSegmentCategory.DIALOGUE },
  { label: "Sound", value: ClapSegmentCategory.SOUND },
  { label: "Music", value: ClapSegmentCategory.MUSIC },
  { label: "Generic", value: ClapSegmentCategory.GENERIC },
]

const toolbarStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: "8px 10px",
  color: "#f5f5f4",
  background: "#18181b",
  borderBottom: "1px solid #3f3f46",
  fontSize: 12,
}

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
}

const selectStyle: CSSProperties = {
  color: "#f5f5f4",
  background: "#27272a",
  border: "1px solid #52525b",
  borderRadius: 4,
  padding: "3px 6px",
}

const buttonStyle: CSSProperties = {
  color: "#18181b",
  background: "#facc15",
  border: 0,
  borderRadius: 4,
  padding: "4px 8px",
  cursor: "pointer",
  fontWeight: 600,
}

export function TimelineToolbar() {
  const tracks = useTimeline(s => s.tracks)
  const addTrack = useTimeline(s => s.addTrack)
  const setTrackType = useTimeline(s => s.setTrackType)
  const createClip = useTimeline(s => s.createClip)
  const [newTrackType, setNewTrackType] = useState<ClapSegmentCategory>(ClapSegmentCategory.VIDEO)

  return (
    <div style={toolbarStyle} data-testid="timeline-toolbar">
      <div style={rowStyle}>
        <strong>Timeline tracks</strong>
        <label>
          New track type{" "}
          <select
            aria-label="New track type"
            style={selectStyle}
            value={newTrackType}
            onChange={event => setNewTrackType(event.target.value as ClapSegmentCategory)}
          >
            {trackTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => addTrack({ type: newTrackType })}
        >
          + Track
        </button>
      </div>
      <div style={rowStyle}>
        {tracks.map(track => (
          <div key={track.id} style={rowStyle}>
            <span>Track {track.id}</span>
            <select
              aria-label={`Track ${track.id} type`}
              style={selectStyle}
              value={track.type || ""}
              onChange={event => setTrackType({
                trackId: track.id,
                type: event.target.value
                  ? event.target.value as ClapSegmentCategory
                  : undefined,
              })}
            >
              <option value="">Unassigned</option>
              {trackTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button
              type="button"
              style={buttonStyle}
              aria-label={`Add clip to track ${track.id}`}
              onClick={() => void createClip({ track: track.id })}
            >
              + Clip
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
