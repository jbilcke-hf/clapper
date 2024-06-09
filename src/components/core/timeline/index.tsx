import { useEffect, useTransition } from "react"
import { ClapSegment } from "@aitube/clap"
import { ClapTimeline, useTimeline, SegmentRenderer } from "@aitube/timeline"

import { cn } from "@/lib/utils"
import { useSettings } from "@/controllers/settings"
import { RenderRequest } from "@/types"
import { useMonitor } from "@/controllers/monitor/useMonitor"

const segmentRenderer: SegmentRenderer = async ({
  segment,
  segments,
  entities,
  speakingCharactersIds,
  generalCharactersIds,
  mainCharacterId,
  mainCharacterEntity,
  meta,
}) => {

  const settings = useSettings.getState().getSettings()
  
  const request: RenderRequest = {
    settings,
    segment,
    segments,
    entities,
    speakingCharactersIds,
    generalCharactersIds,
    mainCharacterId,
    mainCharacterEntity,
    meta,
  }

  const res = await fetch("/api/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request)
  })
  console.log(`res:`, res)
  const newSegment = (await res.json()) as ClapSegment
  console.log(`newSegment:`, newSegment)
  return newSegment
}

export function Timeline() {
  const [_isPending, startTransition] = useTransition()

  const isReady = useTimeline(s => s.isReady)

  const imageRenderingStrategy = useSettings(s => s.imageRenderingStrategy)
  const setImageRenderingStrategy = useTimeline(s => s.setImageRenderingStrategy)
  useEffect(() => {
    if (isReady) setImageRenderingStrategy(imageRenderingStrategy)
  }, [isReady, setImageRenderingStrategy, imageRenderingStrategy])
  
  const videoRenderingStrategy = useSettings(s => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useTimeline(s => s.setVideoRenderingStrategy)
  useEffect(() => {
    if (isReady) setVideoRenderingStrategy(videoRenderingStrategy)
  }, [isReady, setVideoRenderingStrategy, videoRenderingStrategy])
  
  const getSettings = useSettings(s => s.getSettings)
  const setSegmentRenderer = useTimeline(s => s.setSegmentRenderer)

  const jumpAt = useMonitor(s => s.jumpAt)
  const checkIfPlaying = useMonitor(s => s.checkIfPlaying)
  const togglePlayback = useMonitor(s => s.togglePlayback)

  const setJumpAt = useTimeline(s => s.setJumpAt)
  const setIsPlaying = useTimeline(s => s.setIsPlaying)
  const setTogglePlayback = useTimeline(s => s.setTogglePlayback)

  // this is important: we connect the monitor to the timeline
  useEffect(() => {
    setSegmentRenderer(segmentRenderer)
    setJumpAt(jumpAt)
    setIsPlaying(checkIfPlaying)
    setTogglePlayback(togglePlayback)
  }, [isReady])
  
  return (
    <ClapTimeline
      showFPS={false}
      className={cn(
        "bg-[rgb(58,54,50)]"
      )}
    />
  )
}