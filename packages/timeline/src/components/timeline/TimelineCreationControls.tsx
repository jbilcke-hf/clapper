import { useMemo, useState, type CSSProperties, type SyntheticEvent } from "react"
import { ClapSegmentCategory } from "@aitube/clap"

import { useTimeline } from "@/hooks"

const editableCategories = [
  ClapSegmentCategory.VIDEO,
  ClapSegmentCategory.IMAGE,
  ClapSegmentCategory.DIALOGUE,
  ClapSegmentCategory.MUSIC,
  ClapSegmentCategory.SOUND,
  ClapSegmentCategory.ACTION,
  ClapSegmentCategory.CAMERA,
  ClapSegmentCategory.INTERFACE,
]

const controlStyle: CSSProperties = {
  height: 28,
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(24,24,27,0.92)",
  color: "white",
  fontSize: 12,
}

export function TimelineCreationControls() {
  const tracks = useTimeline((s) => s.tracks)
  const createTrack = useTimeline((s) => s.createTrack)
  const createClip = useTimeline((s) => s.createClip)
  const invalidate = useTimeline((s) => s.invalidate)

  const [category, setCategory] = useState<ClapSegmentCategory>(ClapSegmentCategory.VIDEO)
  const [selectedTrackId, setSelectedTrackId] = useState(0)
  const [error, setError] = useState("")

  const visibleTracks = useMemo(
    () => tracks.filter((track) => track.visible),
    [tracks]
  )

  const stopPropagation = (event: SyntheticEvent) => {
    event.stopPropagation()
  }

  const handleCreateTrack = () => {
    const trackId = createTrack({ category })
    setSelectedTrackId(trackId)
    setError("")
    invalidate()
  }

  const handleCreateClip = async () => {
    try {
      const track = tracks[selectedTrackId] ? selectedTrackId : undefined
      const segment = await createClip({ category, track })
      setSelectedTrackId(segment.track)
      setError("")
      invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div
      onClick={stopPropagation}
      onDoubleClick={stopPropagation}
      onMouseDown={stopPropagation}
      onMouseMove={stopPropagation}
      onPointerDown={stopPropagation}
      onWheel={stopPropagation}
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: 6,
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(9,9,11,0.72)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.32)",
        pointerEvents: "auto",
      }}
    >
      <select
        aria-label="Clip type"
        value={category}
        onChange={(event) => setCategory(event.target.value as ClapSegmentCategory)}
        style={{ ...controlStyle, width: 116 }}
      >
        {editableCategories.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      <select
        aria-label="Target track"
        value={tracks[selectedTrackId] ? selectedTrackId : ""}
        onChange={(event) => setSelectedTrackId(Number(event.target.value))}
        style={{ ...controlStyle, width: 120 }}
      >
        {visibleTracks.map((track) => (
          <option key={track.id} value={track.id}>
            {`Track ${track.id}: ${track.name}`}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleCreateTrack}
        style={{ ...controlStyle, padding: "0 10px", cursor: "pointer" }}
      >
        Add track
      </button>
      <button
        type="button"
        onClick={handleCreateClip}
        style={{ ...controlStyle, padding: "0 10px", cursor: "pointer" }}
      >
        Add clip
      </button>
      {error && (
        <span
          role="alert"
          style={{
            maxWidth: 220,
            color: "#fca5a5",
            fontSize: 12,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={error}
        >
          {error}
        </span>
      )}
    </div>
  )
}
