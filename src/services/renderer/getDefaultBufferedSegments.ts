import { BufferedSegments } from "@aitube/clapper-services"

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
  }
  return result
}
