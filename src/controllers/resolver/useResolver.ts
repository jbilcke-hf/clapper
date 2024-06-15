"use client"

import { create } from "zustand"
import { ClapEntity, ClapSegment, ClapSegmentCategory, ClapSegmentFilteringMode, ClapSegmentStatus, filterSegments } from "@aitube/clap"
import { RenderingStrategy, TimelineStore, useTimeline } from "@aitube/timeline"

import { ResolveRequest, RuntimeSegment, SegmentVisibility, SegmentVisibilityPriority } from "@/types"

import { getDefaultResolverState } from "./getDefaultResolverState"
import { useSettings } from "../settings"
import { DEFAULT_WAIT_TIME_IF_NOTHING_TO_DO_IN_MS } from "./constants"
import { ResolverStore } from "./types"


export const useResolver = create<ResolverStore>((set, get) => ({
  ...getDefaultResolverState(),

  startLoop: () => {
    const {
      isRunning,
      runLoop
    } = get()

    console.log(`useResolver.startLoop() isRunning: ${isRunning}`)

    if (isRunning) { return }

    set({ isRunning: true })

    setTimeout(() => {
      runLoop()
    }, 0)
  },

  /**
   * A loop which reconstruct a queue at each cycle
   * 
   * this has to be dynamic since the user might be moving around 
   * inside the timeline
   * @returns 
   */
  runLoop: async (): Promise<void> => {

    const { 
      imageRenderingStrategy,
      videoRenderingStrategy,
      soundRenderingStrategy,
      voiceRenderingStrategy,
      musicRenderingStrategy,
    } = useSettings.getState()
    
    const runLoopAgain = (waitTimeIfNothingToDoInMs = DEFAULT_WAIT_TIME_IF_NOTHING_TO_DO_IN_MS) => {
      setTimeout(() => {
        get().runLoop()
      }, waitTimeIfNothingToDoInMs)
    }

    // ------- trivial case: maybe we have nothing to do? ------

    const allStrategiesAreOnDemand =
      imageRenderingStrategy === RenderingStrategy.ON_DEMAND &&
      videoRenderingStrategy === RenderingStrategy.ON_DEMAND &&
      soundRenderingStrategy === RenderingStrategy.ON_DEMAND &&
      voiceRenderingStrategy === RenderingStrategy.ON_DEMAND &&
      musicRenderingStrategy
    
    // nothing to do
    if (allStrategiesAreOnDemand) {
      // console.log(`useResolver.runLoop(): all strategies are on-demand only`)
      return runLoopAgain()
    }

    // ---------- end of the very trivial case ----------------



    // console.log(`useResolver.runLoop()`)
    const timelineState: TimelineStore = useTimeline.getState()
    const { visibleSegments, loadedSegments, segments: allSegments, resolveSegment } = timelineState

    // ------------------------------------------------------------------------------------------------
    //
    // - we modify the original object in-line to add the visibility setting
    // - there is a priority order: the info that a segment is "visible" (on screen),
    //   is more important, which is why it is done after processing the "loaded" segments (the ones that are buffered, because near the sliding window)
    const tmp: Record<string, RuntimeSegment> = {}
    for (const s of loadedSegments) { (s as RuntimeSegment).visibility = SegmentVisibility.BUFFERED }
    for (const s of visibleSegments) { (s as RuntimeSegment).visibility = SegmentVisibility.VISIBLE }

    // sort segments by visibility:
    // segments visible on screen are show first,
    // then those nearby, then the hidden ones
    const segments: RuntimeSegment[] = ([...allSegments] as RuntimeSegment[]).sort((segment1, segment2) => {
      const priority1 = (SegmentVisibilityPriority as any)[segment1.visibility || SegmentVisibility.HIDDEN] || 0
      const priority2 = (SegmentVisibilityPriority as any)[segment2.visibility || SegmentVisibility.HIDDEN] || 0
      
      return priority2 - priority1
    })
    //
    // -------------------------------------------------------------------------

    const { defaultParallelismQuotas } = get()

    // note that we to create a copy here, that way we can modify it
    const parallelismQuotas = {
      ...defaultParallelismQuotas,
    }
    
    // console.log(`useResolver.runLoop() parallelismQuotas = `, parallelismQuotas)

    // we do not need ot get currentParallelismQuotas,
    // as we are going to re-compute it
    // (currentParallelismQuotas is only used in the UI 
    // to display of the parallel request counter)

    const segmentsToRender: ClapSegment[] = []
    
    // the following loop isn't the prettiest, but I think it presents
    // the dynamic generation logic in a clear way, so let's keep it for now
    for (const s of segments) {

      if (s.category === ClapSegmentCategory.VIDEO) {

        if (s.status !== ClapSegmentStatus.TO_GENERATE) {

          // this is important: we found an in-progress task!
          // it is thus vital to deduct it from the parallelism quota,
          // to avoir triggering quoote limit on the providers side
          if (s.status === ClapSegmentStatus.IN_PROGRESS) {
            parallelismQuotas.video = Math.max(0, parallelismQuotas.video - 1)
          }

          continue
        }
        
        if (videoRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }

        if (parallelismQuotas.video > 0) {
          parallelismQuotas.video = Math.max(0, parallelismQuotas.video - 1)
          segmentsToRender.push(s)
        }
      } else if (s.category === ClapSegmentCategory.STORYBOARD) {

        // console.log(`useResolver.runLoop(): found a storyboard segment`)

        if (s.status !== ClapSegmentStatus.TO_GENERATE) {
          // console.log(`useResolver.runLoop(): found a storyboard segment that is not to_generate`)

          // this is important: we found an in-progress task!
          // it is thus vital to deduct it from the parallelism quota,
          // to avoir triggering quoote limit on the providers side
          if (s.status === ClapSegmentStatus.IN_PROGRESS) {
            parallelismQuotas.image = Math.max(0, parallelismQuotas.image - 1)
          }
          
          continue
        }
        // console.log(`useResolver.runLoop(): found a storyboard segment that has to be generated`)

        if (imageRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }

        // console.log(`useResolver.runLoop(): strategy is good to go`)

        if (parallelismQuotas.image > 0) {
          // console.log(`useResolver.runLoop(): quota is good to go`)
          parallelismQuotas.image = Math.max(0, parallelismQuotas.image - 1)
          segmentsToRender.push(s)
        }
      } else if (s.category === ClapSegmentCategory.DIALOGUE) {

        if (s.status !== ClapSegmentStatus.TO_GENERATE) {

          // this is important: we found an in-progress task!
          // it is thus vital to deduct it from the parallelism quota,
          // to avoir triggering quoote limit on the providers side
          if (s.status === ClapSegmentStatus.IN_PROGRESS) {
            parallelismQuotas.voice = Math.max(0, parallelismQuotas.voice - 1)
          }
          
          continue
        }

        if (voiceRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }
        if (parallelismQuotas.voice > 0) {
          parallelismQuotas.voice = Math.max(0, parallelismQuotas.voice - 1)
          segmentsToRender.push(s)
        }
      } else if (s.category === ClapSegmentCategory.SOUND) {

        if (s.status !== ClapSegmentStatus.TO_GENERATE) {

          // this is important: we found an in-progress task!
          // it is thus vital to deduct it from the parallelism quota,
          // to avoir triggering quoote limit on the providers side
          if (s.status === ClapSegmentStatus.IN_PROGRESS) {
            parallelismQuotas.sound = Math.max(0, parallelismQuotas.sound - 1)
          }
          
          continue
        }
        if (soundRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }
        if (parallelismQuotas.sound > 0) {
          parallelismQuotas.sound = Math.max(0, parallelismQuotas.sound - 1)
          segmentsToRender.push(s)
        }
      } else if (s.category === ClapSegmentCategory.MUSIC) {

        if (s.status !== ClapSegmentStatus.TO_GENERATE) {

          // this is important: we found an in-progress task!
          // it is thus vital to deduct it from the parallelism quota,
          // to avoir triggering quoote limit on the providers side
          if (s.status === ClapSegmentStatus.IN_PROGRESS) {
            parallelismQuotas.music = Math.max(0, parallelismQuotas.music - 1)
          }
          
          continue
        }

        if (musicRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }
        if (parallelismQuotas.music > 0) {
          parallelismQuotas.music = Math.max(0, parallelismQuotas.music - 1)
          segmentsToRender.push(s)
        }
      } // else continue
    }

    if (!segmentsToRender.length) {
      // nothing to do - this will be the most common case
      return runLoopAgain()
    }

    // console.log(`useResolver.runLoop(): firing and forgetting ${segmentsToRender.length} new resolveSegment promises`)
    // we fire and forget
    segmentsToRender.forEach(segment => resolveSegment(segment))

    // we don't want to do something like this:
    // await Promise.allSettled(segmentsRenderingPromises)
    // because that would limit us in terms of parallelism.
    //
    // the idea here is that we don't want to wait for all segments
    // to finish before starting new ones.

    return runLoopAgain()
  },

  /**
   * This resolve a segment
   * 
   * Note: while we return a clap segment, the original will be replaced, too
   * 
   * @param segment 
   * @returns 
   */
  resolveSegment: async (segment: ClapSegment): Promise<ClapSegment> => {

    const settings = useSettings.getState().getSettings()
  
    const timeline: TimelineStore = useTimeline.getState()

    // note: do NOT use the visibleSegments here
    // that's because resolveSegment is 100% asynchronous,
    // meaning it might be called on invisible segments too!
    const { clap, segments: allSegments, trackSilentChangeInSegment } = timeline

    if (!clap?.meta || !allSegments.length) {
      return segment
      // throw new Error(`please call setSegmentRender(...) first`)
    }

    const shotSegments: ClapSegment[] = filterSegments(
      ClapSegmentFilteringMode.ANY,
      segment,
      allSegments
    )

    if (segment.status === ClapSegmentStatus.IN_PROGRESS) {
      // console.log(`useResolver.resolveSegment(): warning: this segment is already being generated!`)
      return segment
    }
  
    segment.status = ClapSegmentStatus.IN_PROGRESS
    
    try {
      const entities = clap.entityIndex || {}
    
      const speakingCharactersIds = shotSegments.map(s =>
        s.category === ClapSegmentCategory.DIALOGUE ? s.entityId : null
      ).filter(id => id) as string[]
    
      const generalCharactersIds = shotSegments.map(s =>
        s.category === ClapSegmentCategory.CHARACTER ? s.entityId : null
      ).filter(id => id) as string[]
    
      const mainCharacterId: string | undefined = speakingCharactersIds.at(0) || generalCharactersIds.at(0) || undefined
    
      const mainCharacterEntity: ClapEntity | undefined = mainCharacterId ? (entities[mainCharacterId] || undefined) : undefined

      const request: ResolveRequest = {
        settings,
        segment,
        segments: shotSegments,
        entities,
        speakingCharactersIds,
        generalCharactersIds,
        mainCharacterId,
        mainCharacterEntity,
        meta: clap.meta,
      }

      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
      })
      // console.log(`useResolver.resolveSegment(): result from /api.render:`, res)

      const newSegmentData = (await res.json()) as ClapSegment
      // console.log(`useResolver.resolveSegment(): newSegmentData`, newSegmentData)

      const {
        id,
        assetUrl,
        assetDurationInMs,
        assetFileFormat,
        assetSourceType,
        status
      } = newSegmentData

      // note: this modifies the old object in-place
      const newSegment = Object.assign(segment, {
        id,
        assetUrl,
        assetDurationInMs,
        assetFileFormat,
        assetSourceType,
        status
      })

      newSegment.status = ClapSegmentStatus.COMPLETED
      trackSilentChangeInSegment(newSegment.id)
      return newSegment
    } catch (err) {
      console.error(`useResolver.resolveSegment(): error: ${err}`)
      segment.status = ClapSegmentStatus.TO_GENERATE
      // we could do that in a future version to improve error tracking
      // segment.status = ClapSegmentStatus.ERROR
    }
    return segment
  }

}))

if (typeof window !== "undefined") {
  (window as any).useResolver = useResolver
}