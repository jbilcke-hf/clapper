'use client'

import { create } from 'zustand'
import {
  ClapEntity,
  ClapOutputType,
  ClapSegmentCategory,
  ClapSegmentFilteringMode,
  ClapSegmentStatus,
  filterSegments,
} from '@aitube/clap'
import {
  RenderingStrategy,
  TimelineStore,
  useTimeline,
  getAudioBuffer,
  SegmentVisibility,
  segmentVisibilityPriority,
  TimelineSegment,
} from '@aitube/timeline'
import {
  getBackgroundAudioPrompt,
  getSoundPrompt,
  getMusicPrompt,
  getSpeechForegroundAudioPrompt,
  getVideoPrompt,
} from '@aitube/engine'
import { ResolverStore } from '@aitube/clapper-services'

import { getDefaultResolverState } from './getDefaultResolverState'
import { useSettings } from '../settings'
import { DEFAULT_WAIT_TIME_IF_NOTHING_TO_DO_IN_MS } from './constants'
import { ResolveRequest, ResolveRequestPrompts } from '@aitube/clapper-services'

export const useResolver = create<ResolverStore>((set, get) => ({
  ...getDefaultResolverState(),

  startLoop: () => {
    const { isRunning, runLoop } = get()

    console.log(`useResolver.startLoop() isRunning: ${isRunning}`)

    if (isRunning) {
      return
    }

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

    const runLoopAgain = (
      waitTimeIfNothingToDoInMs = DEFAULT_WAIT_TIME_IF_NOTHING_TO_DO_IN_MS
    ) => {
      setTimeout(() => {
        get().runLoop()
      }, waitTimeIfNothingToDoInMs)
    }

    // note: do not create a return condition in case all strategies are "on demand"
    // otherwise we won't be able to get the status of current tasks

    // console.log(`useResolver.runLoop()`)
    const timelineState: TimelineStore = useTimeline.getState()
    const {
      visibleSegments,
      loadedSegments,
      segments: allSegments,
      resolveSegment,
    } = timelineState

    // ------------------------------------------------------------------------------------------------
    //
    // - we modify the original object in-line to add the visibility setting
    // - there is a priority order: the info that a segment is "visible" (on screen),
    //   is more important, which is why it is done after processing the "loaded" segments (the ones that are buffered, because near the sliding window)

    for (const s of loadedSegments) {
      ;(s as TimelineSegment).visibility = SegmentVisibility.BUFFERED
    }
    for (const s of visibleSegments) {
      ;(s as TimelineSegment).visibility = SegmentVisibility.VISIBLE
    }

    // sort segments by visibility:
    // segments visible on screen are show first,
    // then those nearby, then the hidden ones
    const segments: TimelineSegment[] = (
      [...allSegments] as TimelineSegment[]
    ).sort((segment1, segment2) => {
      const priority1 =
        (segmentVisibilityPriority as any)[
          segment1.visibility || SegmentVisibility.HIDDEN
        ] || 0
      const priority2 =
        (segmentVisibilityPriority as any)[
          segment2.visibility || SegmentVisibility.HIDDEN
        ] || 0

      return priority2 - priority1
    })
    //
    // -------------------------------------------------------------------------

    const { defaultParallelismQuotas, isPaused } = get()

    let currentParallelismQuotaForVideo = defaultParallelismQuotas.video
    let currentParallelismQuotaForImage = defaultParallelismQuotas.image
    let currentParallelismQuotaForVoice = defaultParallelismQuotas.voice
    let currentParallelismQuotaForSound = defaultParallelismQuotas.sound
    let currentParallelismQuotaForMusic = defaultParallelismQuotas.music

    // console.log(`useResolver.runLoop() parallelismQuotas = `, parallelismQuotas)

    // we do not need ot get currentParallelismQuotas,
    // as we are going to re-compute it
    // (currentParallelismQuotas is only used in the UI
    // to display of the parallel request counter)

    const segmentsToRender: TimelineSegment[] = []

    // the following loop isn't the prettiest, but I think it presents
    // the dynamic generation logic in a clear way, so let's keep it for now
    for (const s of segments) {
      if (s.category === ClapSegmentCategory.VIDEO) {
        if (s.status !== ClapSegmentStatus.TO_GENERATE) {
          // this is important: we found an in-progress task!
          // it is thus vital to deduct it from the parallelism quota,
          // to avoir triggering quota limit on the providers side
          if (s.status === ClapSegmentStatus.IN_PROGRESS) {
            currentParallelismQuotaForVideo = Math.max(
              0,
              currentParallelismQuotaForVideo - 1
            )
          }
          continue
        }

        if (isPaused) {
          continue
        }

        if (videoRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }

        if (
          s.visibility === SegmentVisibility.HIDDEN &&
          videoRenderingStrategy !== RenderingStrategy.ON_SCREEN_THEN_ALL
        ) {
          continue
        } else if (
          s.visibility === SegmentVisibility.BUFFERED &&
          videoRenderingStrategy !==
            RenderingStrategy.ON_SCREEN_THEN_SURROUNDING
        ) {
          continue
        }

        if (currentParallelismQuotaForVideo > 0) {
          currentParallelismQuotaForVideo = Math.max(
            0,
            currentParallelismQuotaForVideo - 1
          )
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
            currentParallelismQuotaForImage = Math.max(
              0,
              currentParallelismQuotaForImage - 1
            )
          }

          continue
        }
        // console.log(`useResolver.runLoop(): found a storyboard segment that has to be generated`)

        if (isPaused) {
          continue
        }

        if (imageRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }

        if (
          s.visibility === SegmentVisibility.HIDDEN &&
          imageRenderingStrategy !== RenderingStrategy.ON_SCREEN_THEN_ALL
        ) {
          continue
        } else if (
          s.visibility === SegmentVisibility.BUFFERED &&
          imageRenderingStrategy !==
            RenderingStrategy.ON_SCREEN_THEN_SURROUNDING
        ) {
          continue
        }

        // console.log(`useResolver.runLoop(): strategy is good to go`)

        if (currentParallelismQuotaForImage > 0) {
          // console.log(`useResolver.runLoop(): quota is good to go`)
          currentParallelismQuotaForImage = Math.max(
            0,
            currentParallelismQuotaForImage - 1
          )
          segmentsToRender.push(s)
        }
      } else if (s.category === ClapSegmentCategory.DIALOGUE) {
        if (s.status !== ClapSegmentStatus.TO_GENERATE) {
          // this is important: we found an in-progress task!
          // it is thus vital to deduct it from the parallelism quota,
          // to avoir triggering quoote limit on the providers side
          if (s.status === ClapSegmentStatus.IN_PROGRESS) {
            currentParallelismQuotaForVoice = Math.max(
              0,
              currentParallelismQuotaForVoice - 1
            )
          }

          continue
        }

        if (isPaused) {
          continue
        }

        if (voiceRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }

        if (
          s.visibility === SegmentVisibility.HIDDEN &&
          voiceRenderingStrategy !== RenderingStrategy.ON_SCREEN_THEN_ALL
        ) {
          continue
        } else if (
          s.visibility === SegmentVisibility.BUFFERED &&
          voiceRenderingStrategy !==
            RenderingStrategy.ON_SCREEN_THEN_SURROUNDING
        ) {
          continue
        }

        if (currentParallelismQuotaForVoice > 0) {
          currentParallelismQuotaForVoice = Math.max(
            0,
            currentParallelismQuotaForVoice - 1
          )
          segmentsToRender.push(s)
        }
      } else if (s.category === ClapSegmentCategory.SOUND) {
        if (s.status !== ClapSegmentStatus.TO_GENERATE) {
          // this is important: we found an in-progress task!
          // it is thus vital to deduct it from the parallelism quota,
          // to avoir triggering quoote limit on the providers side
          if (s.status === ClapSegmentStatus.IN_PROGRESS) {
            currentParallelismQuotaForSound = Math.max(
              0,
              currentParallelismQuotaForSound - 1
            )
          }

          continue
        }

        if (isPaused) {
          continue
        }

        if (soundRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }

        if (
          s.visibility === SegmentVisibility.HIDDEN &&
          soundRenderingStrategy !== RenderingStrategy.ON_SCREEN_THEN_ALL
        ) {
          continue
        } else if (
          s.visibility === SegmentVisibility.BUFFERED &&
          soundRenderingStrategy !==
            RenderingStrategy.ON_SCREEN_THEN_SURROUNDING
        ) {
          continue
        }

        if (currentParallelismQuotaForSound > 0) {
          currentParallelismQuotaForSound = Math.max(
            0,
            currentParallelismQuotaForSound - 1
          )
          segmentsToRender.push(s)
        }
      } else if (s.category === ClapSegmentCategory.MUSIC) {
        if (s.status !== ClapSegmentStatus.TO_GENERATE) {
          // this is important: we found an in-progress task!
          // it is thus vital to deduct it from the parallelism quota,
          // to avoir triggering quoote limit on the providers side
          if (s.status === ClapSegmentStatus.IN_PROGRESS) {
            currentParallelismQuotaForMusic = Math.max(
              0,
              currentParallelismQuotaForMusic - 1
            )
          }

          continue
        }

        if (isPaused) {
          continue
        }

        if (musicRenderingStrategy === RenderingStrategy.ON_DEMAND) {
          continue
        }

        if (
          s.visibility === SegmentVisibility.HIDDEN &&
          musicRenderingStrategy !== RenderingStrategy.ON_SCREEN_THEN_ALL
        ) {
          continue
        } else if (
          s.visibility === SegmentVisibility.BUFFERED &&
          musicRenderingStrategy !==
            RenderingStrategy.ON_SCREEN_THEN_SURROUNDING
        ) {
          continue
        }

        if (currentParallelismQuotaForMusic > 0) {
          currentParallelismQuotaForMusic = Math.max(
            0,
            currentParallelismQuotaForMusic - 1
          )
          segmentsToRender.push(s)
        }
      } // else continue
    }

    // we don't want to do something like this:
    // await Promise.allSettled(segmentsRenderingPromises)
    // because that would limit us in terms of parallelism.
    //
    // the idea here is that we don't want to wait for all segments
    // to finish before starting new ones.

    const nbPendingRequestsForVideo =
      defaultParallelismQuotas.video - currentParallelismQuotaForVideo
    const nbPendingRequestsForImage =
      defaultParallelismQuotas.image - currentParallelismQuotaForImage
    const nbPendingRequestsForVoice =
      defaultParallelismQuotas.voice - currentParallelismQuotaForVoice
    const nbPendingRequestsForSound =
      defaultParallelismQuotas.sound - currentParallelismQuotaForSound
    const nbPendingRequestsForMusic =
      defaultParallelismQuotas.music - currentParallelismQuotaForMusic

    const nbRequestsRunningInParallel =
      nbPendingRequestsForVideo +
      nbPendingRequestsForImage +
      nbPendingRequestsForVoice +
      nbPendingRequestsForSound +
      nbPendingRequestsForMusic

    const isBusyResolving = nbRequestsRunningInParallel > 0

    set({
      currentParallelismQuotaForVideo,
      currentParallelismQuotaForImage,
      currentParallelismQuotaForVoice,
      currentParallelismQuotaForSound,
      currentParallelismQuotaForMusic,
      // just some aliases for convenience
      nbPendingRequestsForVideo,
      nbPendingRequestsForImage,
      nbPendingRequestsForVoice,
      nbPendingRequestsForSound,
      nbPendingRequestsForMusic,
      nbRequestsRunningInParallel,
      isBusyResolving,
    })

    // console.log(`useResolver.runLoop(): firing and forgetting ${segmentsToRender.length} new resolveSegment promises`)
    // we fire and forget
    segmentsToRender.forEach((segment) => resolveSegment(segment))

    return runLoopAgain()
  },

  togglePause: (isPaused?: boolean): boolean => {
    const { isPaused: previouslyPaused } = get()
    if (typeof isPaused === 'boolean') {
      set({ isPaused })
      return isPaused
    } else {
      set({ isPaused: !previouslyPaused })
      return !previouslyPaused
    }
  },

  /**
   * This resolve an entity (eg. a character or a location)
   *
   * This will generate for instance an image and a voice
   * for the entity, based on the entity description.
   *
   * @param segment
   * @returns
   */
  resolveEntity: async (entity: ClapEntity): Promise<ClapEntity> => {
    throw new Error('Not implemented (TODO by @Julian)')
  },

  /**
   * This resolve a segment.
   *
   * Resolving means taking input parameters and generating an output (changes in the
   * segment settings, typically the assetUrl but this can have other implications
   * and changes as well)
   *
   * This function returns the original segment, modified in-line.
   *
   * Side-effects are propagated by using useTimeline.trackSilentChangeInSegment()
   *
   * @param segment
   * @returns
   */
  resolveSegment: async (
    segment: TimelineSegment
  ): Promise<TimelineSegment> => {
    const settings = useSettings.getState().getRequestSettings()

    const timeline: TimelineStore = useTimeline.getState()

    // note: do NOT use the visibleSegments here
    // that's because resolveSegment is 100% asynchronous,
    // meaning it might be called on invisible segments too!
    const { clap, segments: allSegments, trackSilentChangeInSegment } = timeline

    if (!clap?.meta || !allSegments.length) {
      return segment
      // throw new Error(`please call setSegmentRender(...) first`)
    }

    const segments: TimelineSegment[] = filterSegments(
      ClapSegmentFilteringMode.ANY,
      segment,
      allSegments
    )

    if (segment.status === ClapSegmentStatus.IN_PROGRESS) {
      // console.log(`useResolver.resolveSegment(): warning: this segment is already being generated!`)
      return segment
    }

    segment.status = ClapSegmentStatus.IN_PROGRESS

    const entities = clap.entityIndex || {}

    const speakingCharactersIds = segments
      .map((s) =>
        s.category === ClapSegmentCategory.DIALOGUE ? s.entityId : null
      )
      .filter((id) => id) as string[]

    const generalCharactersIds = segments
      .map((s) =>
        s.category === ClapSegmentCategory.CHARACTER ? s.entityId : null
      )
      .filter((id) => id) as string[]

    const mainCharacterId: string | undefined =
      speakingCharactersIds.at(0) || generalCharactersIds.at(0) || undefined

    const mainCharacterEntity: ClapEntity | undefined = mainCharacterId
      ? entities[mainCharacterId] || undefined
      : undefined

    const storyboard = segments.find(
      (s) => s.category === ClapSegmentCategory.STORYBOARD
    )

    const dialogue = segments.find(
      (s) => s.category === ClapSegmentCategory.DIALOGUE
    )

    const imagePrompt = getVideoPrompt(segments, entities)

    const positiveImagePrompt = [
      settings.imagePromptPrefix,
      imagePrompt,
      settings.imagePromptSuffix,
    ]
      .map((x) => x.trim())
      .filter((x) => x)
      .join(', ')

    const negativeImagePrompt = [settings.imageNegativePrompt]
      .map((x) => x.trim())
      .filter((x) => x)
      .join(', ')

    const positiveVoicePrompt = getSpeechForegroundAudioPrompt(segments)
    const positiveAudioPrompt = getSoundPrompt(segments)
    const positiveMusicPrompt = getMusicPrompt(segments)

    // we can also create a background audio ambiance by calling
    // getBackgroundAudioPrompt()

    // note: not all AI models will support those parameters.
    // in 2024, even the "best" proprietary video models like Sora, Veo, Kling, Gen-3, Dream Machine etc..
    // don't support voice input for lip syncing, for instance.
    const prompts: ResolveRequestPrompts = {
      image: {
        // the "identification picture" of the character, if available
        identity: `${mainCharacterEntity?.imageId || ''}`,
        positive: positiveImagePrompt,
        negative: negativeImagePrompt,
      },
      video: {
        // image to animate
        image: `${storyboard?.assetUrl || ''}`,

        // dialogue line to lip-sync
        voice: `${dialogue?.assetUrl || ''}`,
      },
      voice: {
        identity: `${mainCharacterEntity?.audioId || ''}`,
        positive: positiveVoicePrompt,
        negative: '',
      },
      audio: {
        positive: positiveAudioPrompt,
        negative: '',
      },
      music: {
        positive: positiveMusicPrompt,
        negative: '',
      },
    }

    const serializableSegment = { ...segment }
    // we delete things that cannot be serialized properly
    delete serializableSegment.scene
    delete serializableSegment.audioBuffer
    serializableSegment.textures = {}

    const request: ResolveRequest = {
      settings,
      segment: serializableSegment,
      segments,
      entities,
      speakingCharactersIds,
      generalCharactersIds,
      mainCharacterId,
      mainCharacterEntity,
      meta: clap.meta,
      prompts,
    }

    try {
      const res = await fetch('/api/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
      // console.log(`useResolver.resolveSegment(): result from /api.render:`, res)

      // note: this isn't really a "full" TimelineSegment,
      // it will miss some data that cannot be serialized
      const newSegmentData = (await res.json()) as TimelineSegment

      // console.log(`useResolver.resolveSegment(): newSegmentData`, newSegmentData)

      // note: this modifies the old object in-place
      // it is super important as this helps preserving the reference
      const newSegment = Object.assign(
        segment,
        newSegmentData,

        // this step is super-important when rendering multiple segments at once:
        // the position of the segment might have changed while it was being generated,
        // so we need to preserve it
        {
          startTimeInMs: segment.startTimeInMs,
          endTimeInMs: segment.endTimeInMs,
        }
      ) as TimelineSegment

      if (newSegment.outputType === ClapOutputType.AUDIO) {
        if (newSegment.assetUrl) {
          try {
            newSegment.audioBuffer = await getAudioBuffer(newSegment.assetUrl)
          } catch (err) {
            console.error(`failed to load the audio file: ${err}`)
          }
        }
      }

      // after a segment has ben resolved, it is possible that the size
      // of its asset changed (eg. a dialogue line longer than the segment's length)
      //
      // there are multiple ways to solve this, one approach could be to
      // just add some more B-roll (more shots)
      //
      // or we can also extend it, which is the current simple solution
      //
      // for the other categories, such as MUSIC or SOUND,
      // we assume it is okay if they are too short or too long,
      // and that we can crop them etc
      //
      // note that video clips are also concerned: we want them to perfectly fit
      if (newSegment.category === ClapSegmentCategory.DIALOGUE) {
        // by default fitSegmentToAssetDuration() will fit the segment to the asset duration without any gap,
        // which can be weird to hear.. so let's add a little delay

        // that is assuming that our dialogue lines have been properly cut,
        //
        await timeline.fitSegmentToAssetDuration(
          newSegment,
          typeof newSegment.assetDurationInMs === 'number'
            ? // this delay is arbitrary, could be another value (200, 500, 1200..)
              newSegment.assetDurationInMs + 700
            : 2000
        )
      } else if (newSegment.category === ClapSegmentCategory.SOUND) {
        await timeline.fitSegmentToAssetDuration(
          newSegment,
          typeof newSegment.assetDurationInMs === 'number'
            ? // this delay is arbitrary, could be another value (200, 500, 1200..)
              newSegment.assetDurationInMs
            : 2000
        )
      } else if (newSegment.category === ClapSegmentCategory.MUSIC) {
        await timeline.fitSegmentToAssetDuration(
          newSegment,
          typeof newSegment.assetDurationInMs === 'number'
            ? // this delay is arbitrary, could be another value (200, 500, 1200..)
              newSegment.assetDurationInMs
            : 2000
        )
      } else if (newSegment.category === ClapSegmentCategory.VIDEO) {
        await timeline.fitSegmentToAssetDuration(newSegment)
      }

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
  },
}))
