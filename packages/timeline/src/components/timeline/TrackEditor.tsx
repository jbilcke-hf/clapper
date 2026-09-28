import { useState } from "react"
import { ClapSegmentCategory } from "@aitube/clap"
import { useTimeline } from "../../hooks/useTimeline"
import { trackCategory } from "../../utils/trackEditing"

export function TrackEditor() {
  const tracks = useTimeline(s => s.tracks)
  const segments = useTimeline(s => s.segments)
  const createTrack = useTimeline(s => s.createTrack)
  const setTrackCategory = useTimeline(s => s.setTrackCategory)
  const createClip = useTimeline(s => s.createClip)
  const [selectedId, selectTrack] = useState<number>()
  const [newCategory, selectCategory] = useState(ClapSegmentCategory.VIDEO)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const available = tracks.filter(t => t.category || segments.some(s => s.track === t.id))
  const trackId = available.find(t => t.id === selectedId)?.id ?? available[0]?.id
  const category = trackId === undefined ? newCategory : trackCategory(tracks, segments, trackId)
  const occupied = segments.some(s => s.track === trackId)
  const control = { background: "#292524", color: "white", border: "1px solid #78716c", borderRadius: 4, padding: "3px 6px" }

  return <div aria-label="Timeline editing" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, padding: "6px 8px", color: "white", background: "#1c1917", fontSize: 12, flexShrink: 0 }}>
    <label>Track <select aria-label="Selected track" style={control} value={trackId ?? ""} onChange={e => { selectTrack(Number(e.target.value)); setError("") }}>
      {!available.length && <option value="">Create a track</option>}
      {available.map(t => <option key={t.id} value={t.id}>Track {t.id} · {t.name}</option>)}
    </select></label>
    <label>Type <select aria-label="Track type" style={control} value={category ?? ""} disabled={occupied} title={occupied ? "An occupied track keeps its clip type. Create another track to use a different type." : undefined}
      onChange={e => {
        const value = e.target.value as ClapSegmentCategory
        selectCategory(value)
        if (trackId !== undefined && !setTrackCategory(trackId, value)) setError("Move or remove clips before changing the track type.")
        else setError("")
      }}>
      {!category && <option value="">Mixed types</option>}
      {Object.values(ClapSegmentCategory).map(value => <option key={value} value={value}>{value}</option>)}
    </select></label>
    <button type="button" style={control} onClick={() => { selectTrack(createTrack(category ?? newCategory)); setError("") }}>+ Track</button>
    <button type="button" style={{ ...control, opacity: busy || !category || trackId === undefined ? 0.5 : 1 }} disabled={busy || !category || trackId === undefined}
      onClick={async () => {
        if (trackId === undefined) return
        setBusy(true)
        try { if (!await createClip(trackId)) setError("Choose a typed track before adding a clip.") }
        finally { setBusy(false) }
      }}>+ Clip at playhead</button>
    <span style={{ opacity: 0.7 }}>Drag clips to move them; drop on a track of the same type. Esc cancels.</span>
    {error && <span role="status">{error}</span>}
  </div>
}
