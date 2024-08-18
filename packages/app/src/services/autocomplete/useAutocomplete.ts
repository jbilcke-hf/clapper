'use client'

import { create } from 'zustand'
import { TaskCategory, TaskVisibility } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapSegmentCategory,
  ClapSegmentFilteringMode,
  ClapSegmentStatus,
  filterSegments,
  newSegment,
} from '@aitube/clap'
import {
  clapSegmentToTimelineSegment,
  TimelineSegment,
  TimelineStore,
  useTimeline,
} from '@aitube/timeline'

import { useTasks } from '@/components/tasks/useTasks'
import { isValidNumber } from '@/lib/utils'
import { extractCaptionsFromFrames } from './extractCaptionsFromFrames'
import { getDefaultAutocompleteState } from './getDefaultAutocompleteState'
import { AutocompleteStore } from './types'

export const useAutocomplete = create<AutocompleteStore>((set, get) => ({
  ...getDefaultAutocompleteState(),

  storyboardsToStory: async (
    params: {
      startTimeInMs?: number
      endTimeInMs?: number
    } = {}
  ): Promise<void> => {
    const { isRunning } = get()

    if (isRunning) {
      console.log(`Job is already running..`)
      return
    }

    const timeline: TimelineStore = useTimeline.getState()

    const startTimeInMs = isValidNumber(params?.startTimeInMs)
      ? params?.startTimeInMs!
      : 0
    const endTimeInMs = isValidNumber(params?.endTimeInMs)
      ? params?.endTimeInMs!
      : timeline.totalDurationInMs

    const range = { startTimeInMs, endTimeInMs }

    const task = useTasks.getState().add({
      category: TaskCategory.IMPORT,
      // visibility: TaskVisibility.BLOCKER,

      // since this is very long task, we can run it in the background
      visibility: TaskVisibility.BACKGROUND,
      initialMessage: `Analyzing storyboards..`,
      successMessage: `Analyzing storyboards.. 100% done`,
      value: 0,
    })

    set({ isRunning: true })

    try {
      const storyboards = filterSegments<TimelineSegment>(
        ClapSegmentFilteringMode.ANY,
        range,
        timeline.segments,
        ClapSegmentCategory.STORYBOARD
      ).filter((storyboard) => storyboard.assetUrl.startsWith('data:'))

      let i = 0
      let progress = 0
      // to keep things light and in the background, we use an async for loop
      for (const storyboard of storyboards) {
        const isStillRunning = get().isRunning
        if (!isStillRunning) {
          break
        }

        try {
          console.log(`analyzing storyboard:`, storyboard)
          const frames = [storyboard.assetUrl]
          const captions = await extractCaptionsFromFrames(
            frames,
            (
              progress: number,
              storyboardIndex: number,
              nbStoryboards: number
            ) => {
              // this will be counting from to 100%, for each call to extractCaptionsFromFrames()
              // so TODO @Julian: adjust this for the right calculation
              // task.setProgress({
              //   message: `Analyzing storyboards (${progress}%)`,
              //   value: progress,
              // })
            }
          )

          i++

          const relativeProgress = i / storyboards.length

          progress += relativeProgress * 100

          task.setProgress({
            message: `Analyzing storyboards (${Math.round(progress)}%)`,
            value: progress,
          })

          const caption = `${captions[0] || ''}`

          // the model currently used is a browser-side model,
          // and isn't smart enough to give the result as a YAML with categories etc
          console.log("  '--> caption:", caption)

          const sentences = caption
            .split('. ')
            .map((x) => x.trim())
            .filter((x) => x)
          const categories = {
            [ClapSegmentCategory.CHARACTER]: [] as string[],
            [ClapSegmentCategory.LOCATION]: [] as string[],
            [ClapSegmentCategory.LIGHTING]: [] as string[],
            [ClapSegmentCategory.STYLE]: [] as string[],
            [ClapSegmentCategory.ACTION]: [] as string[],
            [ClapSegmentCategory.GENERIC]: [] as string[],
          }

          // those regex are a temporary solution, until we can embed larger models
          // able to decompose a scene automatically
          for (const sentence of sentences) {
            if (sentence.match(/(?:is wearing|wears)/)) {
              categories[ClapSegmentCategory.CHARACTER].push(sentence)
            } else if (sentence.match(/(?:the (?:image|screen) (?:is|has))/)) {
              categories[ClapSegmentCategory.STYLE].push(sentence)
            } else if (
              sentence.match(
                /(?:the (?:lighting|lights|light|fire|sun|moon)|bright|dim|neon|candle|lit up)/
              )
            ) {
              categories[ClapSegmentCategory.LIGHTING].push(sentence)
            } else if (
              sentence.match(
                /(?:the (?:man|woman|kid|child|person|animal|person|robot)|(?:she|he) (?:has|is))/
              )
            ) {
              categories[ClapSegmentCategory.CHARACTER].push(sentence)
            } else if (
              sentence.match(/(?:behind the|background|room|location|place)/)
            ) {
              categories[ClapSegmentCategory.LOCATION].push(sentence)
            } else {
              categories[ClapSegmentCategory.GENERIC].push(sentence)
            }
          }

          console.log('categories:', categories)

          const segments: TimelineSegment[] = []

          // this is temporary, we can do better later
          segments.push(
            await clapSegmentToTimelineSegment(
              newSegment({
                category: ClapSegmentCategory.CAMERA,
                prompt: 'medium-shot',
                label: 'medium-shot',
                startTimeInMs: storyboard.startTimeInMs,
                endTimeInMs: storyboard.endTimeInMs,
                status: ClapSegmentStatus.COMPLETED,
                track: timeline.findFreeTrack({ startTimeInMs, endTimeInMs }), // track row index
              })
            )
          )

          for (const [cat, prompts] of Object.entries(categories)) {
            const category = cat as ClapSegmentCategory
            for (const prompt of prompts) {
              if (!prompt) {
                continue
              }
              const segment = await clapSegmentToTimelineSegment(
                newSegment({
                  category,
                  prompt,
                  label: prompt,
                  startTimeInMs: storyboard.startTimeInMs,
                  endTimeInMs: storyboard.endTimeInMs,
                  status: ClapSegmentStatus.COMPLETED,
                  track: timeline.findFreeTrack({ startTimeInMs, endTimeInMs }), // track row index
                })
              )
              segments.push(segment)
            }
          }

          await timeline.addSegments({ segments })
        } catch (err) {
          console.error(`failed to analyze a storyboard:`, err)
        }

        // TODO: use a special prompt to get categorized captions
      }
    } catch (err) {
      console.error(`storyboardsToStory(): failed to analyze storyboards:`, err)
    } finally {
      task.success()
      set({ isRunning: false })
    }
  },
}))
