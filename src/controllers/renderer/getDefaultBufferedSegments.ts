import { BufferedSegments } from "./types"

export function getDefaultBufferedSegments(): BufferedSegments {
  const result: BufferedSegments = {
    activeSegmentsCacheKey: "",
    activeSegments: [],
    activeVideoSegment: undefined,
    activeStoryboardSegment: undefined,
    activeAudioSegments: [],

    upcomingSegmentsCacheKey: "",
    upcomingSegments: [],
    upcomingVideoSegment: undefined,
    upcomingStoryboardSegment: undefined,
    upcomingAudioSegments: [],
  }
  return result
}
