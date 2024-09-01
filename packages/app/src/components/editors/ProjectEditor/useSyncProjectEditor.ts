import { useTimeline } from "@aitube/timeline"
import { useEffect } from "react"

export function useSyncProjectEditor() {
  const title = useTimeline(s => s.title)
  const description = useTimeline(s => s.description)
  const synopsis = useTimeline(s => s.synopsis)
  const width = useTimeline(s => s.width)
  const height = useTimeline(s => s.height)
  const bpm = useTimeline(s => s.bpm)
  const frameRate = useTimeline(s => s.frameRate)
  const imagePrompt = useTimeline(s => s.imagePrompt)
  const systemPrompt = useTimeline(s => s.systemPrompt)
  const licence = useTimeline(s => s.licence)
  const isInteractive = useTimeline(s => s.isInteractive)
  const isLoop = useTimeline(s => s.isLoop)

  useEffect(() => {
    // sotre these somewhere, so we can do some undo
  }, [
    title,
    description,
    synopsis,
    width,
    height,
    bpm,
    frameRate,
    imagePrompt,
    systemPrompt,
    licence,
    isInteractive,
    isLoop,
  ])
}