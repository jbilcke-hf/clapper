'use client'

import { create } from 'zustand'
import {
  AssistantRequest,
  AssistantStore,
  ChatEvent,
} from '@aitube/clapper-services'
import {
  ClapOutputType,
  ClapSegmentCategory,
  newSegment,
  UUID,
} from '@aitube/clap'
import {
  DEFAULT_DURATION_IN_MS_PER_STEP,
  findFreeTrack,
  TimelineSegment,
  TimelineStore,
  useTimeline,
} from '@aitube/timeline'

import { getDefaultAssistantState } from './getDefaultAssistantState'
import { useSettings } from '../settings'

import { askAssistant } from './askAssistant'
import { useRenderer } from '../renderer'

const enableTextToSpeech = false

export const useAssistant = create<AssistantStore>((set, get) => ({
  ...getDefaultAssistantState(),

  runCommand: (prompt: string) => {
    const query = prompt
      .toLowerCase()
      .trim()
      .replace(/(?:\.)$/gi, '') // remove trailing periods

    if (!query) {
      return true
    }

    console.log(`do something with the query: "${query}"`)

    // TODO @julian: put back here voice control code from the original Clapper project
    return false
  },

  addEventToHistory: (event: Partial<ChatEvent>) => {
    const defaultEvent: ChatEvent = {
      eventId: UUID(),
      roomId: '',
      roomName: '',
      senderId: 'director',
      senderName: 'Director',
      sentAt: new Date().toISOString(),
      message: '',
      isCurrentUser: true,
    }
    const newEvent: ChatEvent = {
      ...defaultEvent,
      ...event,
      isCurrentUser: event.senderId !== 'assistant',
    }

    const { history } = get()

    set({
      history: history.concat(newEvent),
    })

    return newEvent
  },

  clearHistory: () => {
    set({ history: [] })
  },

  processMessage: async (input: string) => {
    const message = input.trim()
    if (!message) {
      return
    }
    const { addEventToHistory, runCommand } = get()

    const timelineState: TimelineStore = useTimeline.getState()
    const { clap } = timelineState
    if (!clap) {
      return
    }

    // note: settings is not the store (with methods etc)
    // but a serializable snapshot of the values only
    const settings = useSettings.getState().getSettings()

    addEventToHistory({
      senderId: 'director',
      senderName: 'Director',
      message,
    })

    const basicCommand = await runCommand(message)
    // LLM analysis can be slow and expensive, so first we try to see if this was a trivial command
    // like "start", "pause", "stop" etc
    if (basicCommand) {
      addEventToHistory({
        senderId: 'assistant',
        senderName: 'Assistant',
        message: `${basicCommand}`,
      })
      return // no need to go further
    }

    console.log(
      `TODO @julian: restore the concept of "addSegment()", "updateSegment()", "active segment" and "cursor position" inside @aitube-timeline`
    )
    const {
      bufferedSegments: { activeSegments },
    } = useRenderer.getState()

    const cursorInSteps = 0

    const referenceSegment: TimelineSegment | undefined = activeSegments.at(0)

    if (!referenceSegment) {
      throw new Error(`No segment under the current cursor`)
    }

    console.log(
      `TODO @julian: filter entities to only keep the ones in the current active segment? (although.. maybe a bad idea since the LLM need as much context as possible to "fill in the gap" eg. repair/invent missing elements of the story)`
    )

    const entities = clap.entityIndex

    const projectInfo = clap.meta.description

    const sceneId = referenceSegment.sceneId

    const scene = clap.scenes.find((s) => s.id === sceneId)

    const fullScene: string = scene?.sequenceFullText || ''
    const actionLine: string = scene?.line || ''

    const segments: TimelineSegment[] = activeSegments.filter(
      (s) =>
        s.category === ClapSegmentCategory.CAMERA ||
        s.category === ClapSegmentCategory.LOCATION ||
        s.category === ClapSegmentCategory.TIME ||
        s.category === ClapSegmentCategory.LIGHTING ||
        s.category === ClapSegmentCategory.ACTION ||
        s.category === ClapSegmentCategory.DIALOGUE ||
        s.category === ClapSegmentCategory.WEATHER ||
        s.category === ClapSegmentCategory.ERA ||
        s.category === ClapSegmentCategory.INTERFACE ||
        s.category === ClapSegmentCategory.MUSIC ||
        s.category === ClapSegmentCategory.SOUND ||
        s.category === ClapSegmentCategory.STORYBOARD ||
        s.category === ClapSegmentCategory.STYLE ||
        s.category === ClapSegmentCategory.TRANSITION ||
        s.category === ClapSegmentCategory.GENERIC
    )

    console.log(
      `TODO @julian: provide both contextual segments and editable ones to the LLM?`
    )

    const request: AssistantRequest = {
      settings,
      prompt: message,
      segments,
      fullScene,
      actionLine,
      entities,
      projectInfo,
      history: get().history,
    }

    const { prompt, categoryName, llmOutput } = await askAssistant(request)
    if (!prompt.length) {
      addEventToHistory({
        senderId: 'assistant',
        senderName: 'Assistant',
        message: llmOutput || '🤔', // or "???" for a "boomer" theme
      })
      return
    }

    console.log(`askAssistant response: `, { prompt, categoryName, llmOutput })

    let match = segments.find((s) => s.category === categoryName) || undefined
    if (!match) {
      const startTimeInMs = cursorInSteps * DEFAULT_DURATION_IN_MS_PER_STEP
      const durationInSteps = 4
      const durationInMs = durationInSteps * DEFAULT_DURATION_IN_MS_PER_STEP
      const endTimeInMs = startTimeInMs + durationInMs

      const newSeg = newSegment({
        startTimeInSteps: cursorInSteps,
        prompt: [prompt],
        durationInSteps: 4,
        trackId: findFreeTrack({
          segments,
          startTimeInMs,
          endTimeInMs,
        }),
        outputType: ClapOutputType.TEXT,
        categoryName,
      })
      console.log('Creating new existing segment:', newSeg)

      console.log(`TODO Julian: add the segment!!`)
      // addSegment(newSeg)

      addEventToHistory({
        senderId: 'assistant',
        senderName: 'Assistant',
        message: `Segment added: ${newSeg.prompt}`,
      })
    } else {
      console.log('Updating an existing segment to:', {
        ...match,
        prompt,
        label: prompt,
        categoryName,
      })

      console.log(`TODO Julian: update the segment!!`)

      // const segments: ClapSegment[] = useTimeline.getState().segments
      // const segment = segments.find(s => s.id === newSeg.id)
      Object.assign(match, {
        prompt,
        label: prompt,
      })

      // tell the timeline that this individual segment should be redrawn
      timelineState.trackSilentChangeInSegment(match.id)

      addEventToHistory({
        senderId: 'assistant',
        senderName: 'Assistant',
        message: `Segment updated: ${prompt}`,
      })
    }
  },
}))
