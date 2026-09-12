import { describe, expect, test } from "bun:test"
import { ClapOutputType, ClapSegmentCategory, ClapTrack } from "@aitube/clap"

import {
  findNextAvailableStartTime,
  getTrackAtPointY,
  getTrackCategory,
  hasTrackOverlap,
  outputTypeForCategory,
  snapTimeToStep,
} from "./timelineAuthoring"

const segments = [
  {
    id: "video-1",
    track: 1,
    startTimeInMs: 1000,
    endTimeInMs: 2000,
  },
  {
    id: "video-2",
    track: 1,
    startTimeInMs: 2500,
    endTimeInMs: 3000,
  },
  {
    id: "audio-1",
    track: 2,
    startTimeInMs: 1000,
    endTimeInMs: 2000,
  },
]

describe("timeline authoring helpers", () => {
  test("snaps times to the nearest positive step", () => {
    expect(snapTimeToStep(1240, 500)).toBe(1000)
    expect(snapTimeToStep(1260, 500)).toBe(1500)
    expect(snapTimeToStep(-125, 500)).toBe(0)
  })

  test("detects overlaps only on the requested track", () => {
    expect(hasTrackOverlap({
      segments,
      track: 1,
      startTimeInMs: 1500,
      endTimeInMs: 1800,
    })).toBe(true)

    expect(hasTrackOverlap({
      segments,
      track: 1,
      startTimeInMs: 2000,
      endTimeInMs: 2400,
    })).toBe(false)

    expect(hasTrackOverlap({
      segments,
      track: 1,
      startTimeInMs: 1500,
      endTimeInMs: 1800,
      excludeSegmentId: "video-1",
    })).toBe(false)
  })

  test("places new clips after existing conflicts", () => {
    expect(findNextAvailableStartTime({
      segments,
      track: 1,
      startTimeInMs: 1500,
      durationInMs: 500,
    })).toBe(2000)

    expect(findNextAvailableStartTime({
      segments,
      track: 1,
      startTimeInMs: 1800,
      durationInMs: 900,
    })).toBe(3000)
  })

  test("maps categories to render output types", () => {
    expect(outputTypeForCategory(ClapSegmentCategory.VIDEO)).toBe(ClapOutputType.VIDEO)
    expect(outputTypeForCategory(ClapSegmentCategory.IMAGE)).toBe(ClapOutputType.IMAGE)
    expect(outputTypeForCategory(ClapSegmentCategory.DIALOGUE)).toBe(ClapOutputType.AUDIO)
    expect(outputTypeForCategory(ClapSegmentCategory.ACTION)).toBe(ClapOutputType.TEXT)
  })

  test("reads explicit track categories and rejects mixed labels", () => {
    expect(getTrackCategory({ name: ClapSegmentCategory.VIDEO } as ClapTrack)).toBe(ClapSegmentCategory.VIDEO)
    expect(getTrackCategory({ name: "(misc)" } as ClapTrack)).toBeUndefined()
  })

  test("finds a track from a vertical scene point", () => {
    const tracks = [
      { id: 0, height: 10 },
      { id: 1, height: 20 },
      { id: 2, height: 10 },
    ] as ClapTrack[]

    expect(getTrackAtPointY({ tracks, pointY: -5, defaultCellHeight: 10 })).toBe(0)
    expect(getTrackAtPointY({ tracks, pointY: -15, defaultCellHeight: 10 })).toBe(1)
    expect(getTrackAtPointY({ tracks, pointY: -35, defaultCellHeight: 10 })).toBe(2)
    expect(getTrackAtPointY({ tracks, pointY: -45, defaultCellHeight: 10 })).toBeUndefined()
  })
})
