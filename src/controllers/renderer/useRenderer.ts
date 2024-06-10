"use client"

import { create } from "zustand"
import { ClapOutputType, ClapSegmentCategory } from "@aitube/clap"
import { TimelineStore, useTimeline } from "@aitube/timeline"

import { RuntimeSegment } from "@/types"

import { BufferedSegments, RendererStore } from "./types"
import { getDefaultRendererState } from "./getDefaultRendererState"
import { getSegmentCacheKey } from "./getSegmentCacheKey"
import { blockSizeInMs } from "./constants"
import { getDefaultBufferedSegments } from "./getDefaultBufferedSegments"

export const useRenderer = create<RendererStore>((set, get) => ({
  ...getDefaultRendererState(),


  // this will be called at 60 FPS - and yes, it is expensive
  // we could probably improve things by using a temporal tree index
  renderLoop: (): BufferedSegments => {

    const { computeBufferedSegments, bufferedSegments } = get()


    // note: although useRequestAnimationFrame is called at 60 FPS,
    // computeBufferedSegments has a throttle since it is expensive
    const maybeNewBufferedSegments = computeBufferedSegments()

    const activeSegmentsChanged = maybeNewBufferedSegments.activeSegmentsCacheKey !== bufferedSegments.activeSegmentsCacheKey
    const upcomingSegmentsChanged = maybeNewBufferedSegments.upcomingSegmentsCacheKey !== bufferedSegments.upcomingSegmentsCacheKey
    
    if (activeSegmentsChanged || upcomingSegmentsChanged) {

      set({ bufferedSegments: maybeNewBufferedSegments })

      return maybeNewBufferedSegments
    }

    return bufferedSegments
  },

  computeBufferedSegments: (): BufferedSegments => {
    const timelineState: TimelineStore = useTimeline.getState()
    const { cursorTimestampAtInMs, segments: clapSegments } = timelineState
    const segments = clapSegments as RuntimeSegment[]
  
    const results: BufferedSegments = getDefaultBufferedSegments()
    // console.log("useRenderer: computeBufferedSegments() called")
  
  
    // we could use a temporal index to keep things efficient here
    // thiere is this relatively recent algorithm, the IB+ Tree, 
    // which seems to be good for what we want to do
    // https://www.npmjs.com/package/i2bplustree
    // another solution could be to filter the segments into multiple arrays by category,
    // although we will have to see when those segments are re-computed / synced
    for (const segment of segments) {
      const inActiveShot = segment.startTimeInMs <= cursorTimestampAtInMs && cursorTimestampAtInMs < segment.endTimeInMs
  
      if (inActiveShot) {
        const isActiveVideo = segment.category === ClapSegmentCategory.VIDEO && segment.assetUrl
        // const isActiveStoryboard = segment.category === ClapSegmentCategory.STORYBOARD && segment.assetUrl
        if (isActiveVideo) {
          results.activeSegments.push(segment)
          results.activeVideoSegment = segment
          results.activeSegmentsCacheKey = getSegmentCacheKey(segment, results.activeSegmentsCacheKey)
        }
  
        const isActiveAudio =
          // IF this is an audio segment
          segment.outputType === ClapOutputType.AUDIO &&
        
          // AND there is an actual audio buffer attached to it
          segment.audioBuffer
  
        if (isActiveAudio) {
          results.activeSegments.push(segment)
          results.activeAudioSegments.push(segment)
          results.activeSegmentsCacheKey = getSegmentCacheKey(segment, results.activeSegmentsCacheKey)
        }
      }
      
      const inUpcomingShot =
        (segment.startTimeInMs <= (cursorTimestampAtInMs + blockSizeInMs))
        &&
        ((cursorTimestampAtInMs + blockSizeInMs) < segment.endTimeInMs)
  
      if (inUpcomingShot) {
        const isUpcomingVideo = segment.category === ClapSegmentCategory.VIDEO && segment.assetUrl
        // const isUpcomingStoryboard = segment.category === ClapSegmentCategory.STORYBOARD && segment.assetUrl
        if (isUpcomingVideo) {
          results.upcomingSegments.push(segment)
          results.upcomingVideoSegment = segment
          results.upcomingSegmentsCacheKey = getSegmentCacheKey(segment, results.upcomingSegmentsCacheKey)
        }
  
        const isUpcomingAudio =
          // IF this is an audio segment
          segment.outputType === ClapOutputType.AUDIO &&
        
          // AND there is an actual audio buffer attached to it
          segment.audioBuffer
  
        if (isUpcomingAudio) {
          results.upcomingSegments.push(segment)
          results.upcomingAudioSegments.push(segment)
          results.upcomingSegmentsCacheKey = getSegmentCacheKey(segment, results.upcomingSegmentsCacheKey)
        }
      }
        
    }
  
    // console.log("useRenderer: computeBufferedSegments() returning:", results)
  
    return results
  },
}))