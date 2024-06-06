import { useEffect, useTransition } from "react"
import { ClapSegment } from "@aitube/clap"
import { ClapTimeline, useTimelineState, SegmentRenderer } from "@aitube/timeline"
import { cn } from "@/lib/utils"

import { useSettings } from "@/controllers/settings"
import { RenderRequest } from "@/types"

const segmentRenderer: SegmentRenderer = async ({
  segment,
  segments,
  entities,
  meta,
}) => {

  console.log(`custom segmentRender() called with:`, { segment, segments, entities })
  const request: RenderRequest = {
    settings: useSettings.getState().getSettings(),
    segment,
    segments,
    entities,
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

  const isReady = useTimelineState(s => s.isReady)

  const storyboardRenderingStrategy = useSettings(s => s.storyboardRenderingStrategy)
  const setStoryboardRenderingStrategy = useTimelineState(s => s.setStoryboardRenderingStrategy)
  useEffect(() => {
    if (isReady) setStoryboardRenderingStrategy(storyboardRenderingStrategy)
  }, [isReady, setStoryboardRenderingStrategy, storyboardRenderingStrategy])
  
  const videoRenderingStrategy = useSettings(s => s.videoRenderingStrategy)
  const setVideoRenderingStrategy = useTimelineState(s => s.setVideoRenderingStrategy)
  useEffect(() => {
    if (isReady) setVideoRenderingStrategy(videoRenderingStrategy)
  }, [isReady, setVideoRenderingStrategy, videoRenderingStrategy])
  
  const getSettings = useSettings(s => s.getSettings)
  const setSegmentRenderer = useTimelineState(s => s.setSegmentRenderer)

  useEffect(() => {
    setSegmentRenderer(segmentRenderer)
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