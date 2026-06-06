import { beforeEach, describe, expect, test, vi } from "vitest"
import { ClapSegmentCategory, newSegment } from "@aitube/clap"

import { useTimeline } from "./useTimeline"

describe("timeline track and clip creation", () => {
  beforeEach(() => {
    useTimeline.getState().clear()
  })

  test("creates typed tracks and typed clips", async () => {
    const trackId = useTimeline.getState().createTrack(ClapSegmentCategory.VIDEO)

    expect(trackId).toBe(0)
    expect(useTimeline.getState().tracks[trackId]).toMatchObject({
      id: trackId,
      name: ClapSegmentCategory.VIDEO,
      occupied: false,
      visible: true,
    })

    const clip = await useTimeline.getState().createClip({
      trackId,
      category: ClapSegmentCategory.VIDEO,
      startTimeInMs: 1000,
      durationInMs: 2000,
    })

    expect(clip.category).toBe(ClapSegmentCategory.VIDEO)
    expect(clip.track).toBe(trackId)
    expect(clip.startTimeInMs).toBe(1000)
    expect(clip.endTimeInMs).toBe(3000)
    expect(useTimeline.getState().segments).toHaveLength(1)
    expect(useTimeline.getState().tracks[trackId].occupied).toBe(true)
  })

  test("prevents assigning clips to typed tracks of a different category", async () => {
    const videoTrackId = useTimeline.getState().createTrack(ClapSegmentCategory.VIDEO)
    const imageSegment = newSegment({
      category: ClapSegmentCategory.IMAGE,
      track: 9,
      startTimeInMs: 0,
      endTimeInMs: 1000,
    })
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    await useTimeline.getState().assignTrack({
      segment: imageSegment,
      track: videoTrackId,
      triggerChange: true,
    })

    expect(imageSegment.track).toBe(9)
    expect(useTimeline.getState().tracks[videoTrackId]).toMatchObject({
      name: ClapSegmentCategory.VIDEO,
      occupied: false,
    })
    expect(warn).toHaveBeenCalledWith("Cannot move IMAGE segment to VIDEO track")

    warn.mockRestore()
  })
})
