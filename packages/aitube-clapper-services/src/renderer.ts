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
}

export type BufferedSegments = ActiveSegments & UpcomingSegments

export type RendererState = {
  bufferedSegments: BufferedSegments

  // various helpers to manage buffering,
  // cache, cache invalidation..
  dataUriBuffer1?: ClapSegment
  dataUriBuffer2?: ClapSegment
  activeBufferNumber: number
  currentSegment?: ClapSegment
  preloadSegment?: ClapSegment
  currentSegmentKey: string
  preloadSegmentKey: string
  dataUriBuffer1Key: string
  dataUriBuffer2Key: string
}

export type RendererControls = {

  // used to clear the renderer eg. when we load a new project
  clear: () => void

  // this will be called at 60 FPS - and yes, it is expensive
  // we could probably improve things by using a temporal tree index

  /**
   * Cycle through the segments to see which ones are crossing the current cursor,
   * then this updates the internal buffer of segments
   * (this has side effects as it modifies the internal state)
   * 
   * @returns 
   */
  renderLoop: (jumpedSomewhere?: boolean) => BufferedSegments

  /**
   * Cycle through the segments to see which ones are crossing the current cursor,
   * and return it (this doesn't change any state, but it reads the state from various stores)
   * @returns 
   */
  computeBufferedSegments: () => BufferedSegments

  setDataUriBuffer1: (dataUriBuffer1?: ClapSegment) => void
  setDataUriBuffer2: (dataUriBuffer2?: ClapSegment) => void
  setActiveBufferNumber: (activeBufferNumber: number) => void

  syncVideoToCurrentCursorPosition: () => void
}

export type RendererStore = RendererState & RendererControls
