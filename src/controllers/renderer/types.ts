import { ClapSegment } from "@aitube/clap"

export type ActiveSegments = {
  activeSegmentsCacheKey: string
  activeSegments: ClapSegment[]
  activeVideoSegment?: ClapSegment
  activeStoryboardSegment?: ClapSegment
  activeAudioSegments: ClapSegment[]
}

export type UpcomingSegments = {
  upcomingSegmentsCacheKey: string
  upcomingSegments: ClapSegment[]
  upcomingVideoSegment?: ClapSegment
  upcomingStoryboardSegment?: ClapSegment
  upcomingAudioSegments: ClapSegment[]
}

export type BufferedSegments = ActiveSegments & UpcomingSegments

export type RendererState = {
  bufferedSegments: BufferedSegments
}

export type RendererControls = {
  // this will be called at 60 FPS - and yes, it is expensive
  // we could probably improve things by using a temporal tree index

  /**
   * Cycle through the segments to see which ones are crossing the current cursor,
   * then this updates the internal buffer of segments
   * (this has side effects as it modifies the internal state)
   * 
   * @returns 
   */
  renderLoop: () => BufferedSegments

  /**
   * Cycle through the segments to see which ones are crossing the current cursor,
   * and return it (this doesn't change any state, but it reads the state from various stores)
   * @returns 
   */
  computeBufferedSegments: () => BufferedSegments
}

export type RendererStore = RendererState & RendererControls
