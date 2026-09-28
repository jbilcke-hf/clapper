import React from "react"
import { createRoot } from "react-dom/client"
import { newClap, ClapSegmentCategory } from "@aitube/clap"
import { ClapTimeline, useTimeline } from "../src/index"
import "../src/demo.css"
import { TrackEditor } from "../src/components/timeline/TrackEditor"

await useTimeline.getState().setClap(newClap({ meta: { durationInMs: 10000 } }))
useTimeline.getState().createTrack(ClapSegmentCategory.VIDEO)
useTimeline.getState().createTrack(ClapSegmentCategory.VIDEO)
useTimeline.getState().createTrack(ClapSegmentCategory.SOUND)

class CanvasBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <><TrackEditor /><p role="status">WebGL unavailable in this browser. Toolbar checks remain available; pointer dragging needs a WebGL-capable browser.</p></> : this.props.children
  }
}

function Fixture() {
  const tracks = useTimeline(s => s.tracks)
  const segments = useTimeline(s => s.segments)
  const dragging = useTimeline(s => s.segmentDrag)
  return <>
    <div style={{ height: 640 }}><CanvasBoundary><ClapTimeline /></CanvasBoundary></div>
    <output aria-label="Project state" style={{ display: "block", whiteSpace: "pre-wrap", fontSize: 12 }}>
      {JSON.stringify({ tracks: tracks.filter(t => t.category).map(t => ({ id: t.id, category: t.category })), segments: segments.map(s => ({ id: s.id, track: s.track, category: s.category, start: s.startTimeInMs, end: s.endTimeInMs })), dragging: !!dragging }, null, 2)}
    </output>
  </>
}

createRoot(document.getElementById("root")!).render(<Fixture />)
