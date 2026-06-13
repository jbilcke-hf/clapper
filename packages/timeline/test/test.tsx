import { describe, expect, it } from "bun:test"
import { ClapSegmentCategory } from "@aitube/clap"

import { useTimeline } from "../src/hooks/useTimeline"
import { SegmentPointerEvent } from "../src/types/timeline"
import { getDefaultState } from "../src/utils/getDefaultState"

const resetTimeline = () => {
  useTimeline.setState(getDefaultState())
}

const makePointerEvent = ({
  timestampInMs,
  track,
  buttons = 1,
}: {
  timestampInMs: number
  track: number
  buttons?: number
}) => {
  const state = useTimeline.getState()
  const pointX = ((timestampInMs / state.durationInMsPerStep) * state.cellWidth) - (state.containerWidth / 2)
  const cursorY = state.getVerticalCellPosition(0, track) + (state.getCellHeight(track) / 2)
  const pointY = (state.contentHeight / 2) - cursorY

  return {
    buttons,
    offsetX: 200,
    offsetY: 200,
    pointerId: 1,
    point: {
      x: pointX,
      y: pointY,
    },
    stopPropagation: () => {},
    target: {
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
    },
  } as any
}

describe("timeline track and clip creation", () => {
  it("creates an empty track and recomputes timeline content", () => {
    resetTimeline()

    const trackId = useTimeline.getState().createTrack({
      name: "Dialogue",
      category: ClapSegmentCategory.DIALOGUE,
    })

    const state = useTimeline.getState()
    expect(trackId).toBe(0)
    expect(state.tracks[trackId].name).toBe("Dialogue")
    expect(state.tracks[trackId].occupied).toBe(false)
    expect(state.contentHeight).toBeGreaterThan(0)
  })

  it("creates a clip on a new track when no track is requested", async () => {
    resetTimeline()

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.SOUND,
      startTimeInMs: 1000,
      durationInMs: 2500,
      label: "Door knock",
    })

    const state = useTimeline.getState()
    expect(state.segments).toHaveLength(1)
    expect(state.segments[0].id).toBe(clip.id)
    expect(clip.track).toBe(0)
    expect(clip.startTimeInMs).toBe(1000)
    expect(clip.endTimeInMs).toBe(3500)
    expect(state.tracks[clip.track].name).toBe("SOUND")
  })

  it("reuses an existing same-category track when it has room", async () => {
    resetTimeline()
    const trackId = useTimeline.getState().createTrack({
      name: "IMAGE",
      category: ClapSegmentCategory.IMAGE,
    })

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.IMAGE,
      startTimeInMs: 1000,
      durationInMs: 1000,
      label: "Storyboard frame",
    })

    const state = useTimeline.getState()
    expect(clip.track).toBe(trackId)
    expect(state.tracks[trackId].occupied).toBe(true)
    expect(state.segments[0].track).toBe(trackId)
  })

  it("creates a clip on a requested track and materializes missing tracks", async () => {
    resetTimeline()

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.IMAGE,
      track: 4,
      label: "Storyboard frame",
    })

    const state = useTimeline.getState()
    expect(clip.track).toBe(4)
    expect(state.tracks[4].name).toBe("IMAGE")
    expect(state.tracks[4].isPreview).toBe(true)
    expect(state.segments[0].track).toBe(4)
  })

  it("sets an empty track category from the track selector", () => {
    resetTimeline()
    const trackId = useTimeline.getState().createTrack()

    const changed = useTimeline.getState().setTrackCategory({
      trackId,
      category: ClapSegmentCategory.VIDEO,
    })

    const state = useTimeline.getState()
    expect(changed).toBe(true)
    expect(state.tracks[trackId].name).toBe("VIDEO")
    expect(state.tracks[trackId].isPreview).toBe(true)
    expect(state.tracks[trackId].height).toBe(state.defaultPreviewHeight)
  })

  it("rejects changing an occupied track to an incompatible category", async () => {
    resetTimeline()
    const trackId = useTimeline.getState().createTrack({
      category: ClapSegmentCategory.SOUND,
    })

    await useTimeline.getState().createClip({
      category: ClapSegmentCategory.SOUND,
      track: trackId,
      startTimeInMs: 1000,
      durationInMs: 2000,
    })

    const changed = useTimeline.getState().setTrackCategory({
      trackId,
      category: ClapSegmentCategory.IMAGE,
    })

    const state = useTimeline.getState()
    expect(changed).toBe(false)
    expect(state.tracks[trackId].name).toBe("SOUND")
    expect(state.segments[0].category).toBe(ClapSegmentCategory.SOUND)
  })

  it("moves a clip along the timeline and onto a same-category track", async () => {
    resetTimeline()
    const firstTrack = useTimeline.getState().createTrack({
      category: ClapSegmentCategory.SOUND,
    })
    const secondTrack = useTimeline.getState().createTrack({
      category: ClapSegmentCategory.SOUND,
    })

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.SOUND,
      track: firstTrack,
      startTimeInMs: 1000,
      durationInMs: 2000,
    })

    const moved = useTimeline.getState().moveClip({
      segmentId: clip.id,
      startTimeInMs: 4000,
      track: secondTrack,
    })

    const state = useTimeline.getState()
    expect(moved?.track).toBe(secondTrack)
    expect(moved?.startTimeInMs).toBe(4000)
    expect(moved?.endTimeInMs).toBe(6000)
    expect(state.segments[0].track).toBe(secondTrack)
    expect(state.tracks[firstTrack].occupied).toBe(false)
    expect(state.tracks[secondTrack].occupied).toBe(true)
  })

  it("clamps leftward clip movement at zero while preserving duration", async () => {
    resetTimeline()
    const trackId = useTimeline.getState().createTrack({
      category: ClapSegmentCategory.SOUND,
    })

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.SOUND,
      track: trackId,
      startTimeInMs: 1000,
      durationInMs: 2000,
    })

    const moved = useTimeline.getState().moveClip({
      segmentId: clip.id,
      startTimeInMs: -500,
      track: trackId,
    })

    expect(moved?.startTimeInMs).toBe(0)
    expect(moved?.endTimeInMs).toBe(2000)
  })

  it("rejects moving a clip into an overlapping same-category slot", async () => {
    resetTimeline()
    const trackId = useTimeline.getState().createTrack({
      category: ClapSegmentCategory.SOUND,
    })

    const firstClip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.SOUND,
      track: trackId,
      startTimeInMs: 1000,
      durationInMs: 2000,
    })
    await useTimeline.getState().createClip({
      category: ClapSegmentCategory.SOUND,
      track: trackId,
      startTimeInMs: 5000,
      durationInMs: 1000,
    })

    const moved = useTimeline.getState().moveClip({
      segmentId: firstClip.id,
      startTimeInMs: 4500,
      track: trackId,
    })

    const state = useTimeline.getState()
    expect(moved).toBeUndefined()
    expect(state.segments.find((segment) => segment.id === firstClip.id)?.startTimeInMs).toBe(1000)
  })

  it("rejects moving a clip to a different track category", async () => {
    resetTimeline()
    const soundTrack = useTimeline.getState().createTrack({
      category: ClapSegmentCategory.SOUND,
    })
    const imageTrack = useTimeline.getState().createTrack({
      category: ClapSegmentCategory.IMAGE,
    })

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.SOUND,
      track: soundTrack,
      startTimeInMs: 1000,
      durationInMs: 2000,
    })

    const moved = useTimeline.getState().moveClip({
      segmentId: clip.id,
      startTimeInMs: 4000,
      track: imageTrack,
    })

    const state = useTimeline.getState()
    expect(moved).toBeUndefined()
    expect(state.segments[0].track).toBe(soundTrack)
    expect(state.segments[0].startTimeInMs).toBe(1000)
  })

  it("preserves the grabbed clip offset during pointer drag", async () => {
    resetTimeline()
    const firstTrack = useTimeline.getState().createTrack({
      category: ClapSegmentCategory.SOUND,
    })
    const secondTrack = useTimeline.getState().createTrack({
      category: ClapSegmentCategory.SOUND,
    })

    const clip = await useTimeline.getState().createClip({
      category: ClapSegmentCategory.SOUND,
      track: firstTrack,
      startTimeInMs: 1000,
      durationInMs: 2000,
    })

    useTimeline.getState().handleSegmentEvent({
      eventType: SegmentPointerEvent.DOWN,
      segment: clip,
    })(makePointerEvent({
      timestampInMs: 1500,
      track: firstTrack,
    }))

    expect(useTimeline.getState().segmentDragOffsetInMs).toBe(500)

    useTimeline.getState().handleSegmentEvent({
      eventType: SegmentPointerEvent.MOVE,
      segment: clip,
    })(makePointerEvent({
      timestampInMs: 4500,
      track: secondTrack,
    }))

    useTimeline.getState().handleSegmentEvent({
      eventType: SegmentPointerEvent.UP,
      segment: clip,
    })(makePointerEvent({
      timestampInMs: 4500,
      track: secondTrack,
      buttons: 0,
    }))

    const state = useTimeline.getState()
    expect(state.segmentDragOffsetInMs).toBe(0)
    expect(state.segments[0].track).toBe(secondTrack)
    expect(state.segments[0].startTimeInMs).toBe(4000)
    expect(state.segments[0].endTimeInMs).toBe(6000)
  })
})
