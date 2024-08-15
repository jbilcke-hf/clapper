'use client'

import { create } from 'zustand'
import {
  AssistantAction,
  AssistantMessage,
  AssistantRequest,
  AssistantStore,
  ChatEvent,
  ChatEventVisibility,
} from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapOutputType,
  ClapScene,
  ClapSegment,
  ClapSegmentCategory,
  newSegment,
  UUID,
} from '@aitube/clap'
import {
  clapSegmentToTimelineSegment,
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
import { useMonitor } from '../monitor/useMonitor'
import { parseRawInputToAction } from './parseRawInputToAction'
import { useAudio } from '../audio/useAudio'
import { updateStoryAndScene } from './updateStoryAndScene'

export const useAssistant = create<AssistantStore>((set, get) => ({
  ...getDefaultAssistantState(),

  processActionOrMessage: async (
    actionOrAssistantMessage: AssistantAction | AssistantMessage
  ): Promise<void> => {
    const { addEventToHistory } = get()
    const { mute, unmute } = useAudio.getState()
    const { togglePlayback } = useMonitor.getState()

    let response = ''

    const assistantMessage =
      typeof actionOrAssistantMessage === 'object'
        ? (actionOrAssistantMessage as AssistantMessage)
        : {
            comment: '',
            action: actionOrAssistantMessage,
            updatedStoryBlocks: [],
            updatedSceneSegments: [],
          }

    try {
      switch (assistantMessage.action) {
        case AssistantAction.PLAY_VIDEO:
          togglePlayback(true)
          break

        case AssistantAction.PAUSE_VIDEO:
          togglePlayback(false)
          break

        case AssistantAction.MUTE_AUDIO:
          mute()
          break

        case AssistantAction.UNMUTE_AUDIO:
          unmute()
          break

        case AssistantAction.UPDATE_STORY_AND_SCENE:
          // this is not processed in there
          break

          // note: in case we find a way to update a segment in place
          // (eg. if LLMs become good at preserving IDs)
          // we can also try to do this:

          // Object.assign(match, {
          //   prompt,
          //   label: prompt,
          // })

          // // tell the timeline that this individual segment should be redrawn
          // trackSilentChangeInSegment(match.id)

          break

        case AssistantAction.GO_BACK:
          // TODO
          break

        case AssistantAction.GO_FORWARD:
          // TODO
          break

        case AssistantAction.UNDO:
          // this should be the undo of the ASSISTANT actions
          break

        case AssistantAction.REDO:
          // this should be the redo of the ASSISTANT actions
          break

        case AssistantAction.NONE:
        default:
          if (assistantMessage.comment) {
            addEventToHistory({
              senderId: 'assistant',
              senderName: 'Assistant',
              message: assistantMessage.comment || '🤔', // or "???" for a "boomer" theme
            })
          } else {
            console.log(
              `processActionOrMessage: the message was empty or incomplete`
            )
          }
          return
      }
    } catch (err) {
      addEventToHistory({
        senderId: 'assistant',
        senderName: 'Assistant',
        message: `I'm sorry, I was unable to process your request. Error message: ${err}`,
      })
      return
    }

    if (response) {
      addEventToHistory({
        senderId: 'assistant',
        senderName: 'Assistant',
        message: response,
      })
    }
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
      visibility: ChatEventVisibility.TO_BOTH,
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

  processUserMessage: async (input: string) => {
    const message = input.trim()
    if (!message) {
      return
    }

    console.log('processUserMessage():', input)

    const { addEventToHistory, processActionOrMessage } = get()
    const {
      bufferedSegments: { activeSegments },
    } = useRenderer.getState()
    const timeline: TimelineStore = useTimeline.getState()
    const { meta, scenes, addSegment, entityIndex } = timeline

    // note: here `settings` is not the store's state itself (with methods etc)
    // but a snapshot of the serializable state values only
    //
    // when need that because we are going send those settings in HTTPS to our gateway
    const settings = useSettings.getState().getRequestSettings()

    addEventToHistory({
      senderId: 'director',
      senderName: 'Director',
      message,
    })

    // before calling any costly LLM (in terms of money or latency),
    // we first check if we have an immediate match for an action
    const directVocalCommandAction = parseRawInputToAction(message)
    if (directVocalCommandAction !== AssistantAction.NONE) {
      console.log(
        `processUserMessage: we intercept a command! skipping LLM step..`
      )
      await processActionOrMessage(directVocalCommandAction)
      return
    }

    const referenceSegment: TimelineSegment | undefined = activeSegments.at(0)

    console.log(
      'uh oh.. where are the scene? TODO @julian add them back to useTimeline'
    )
    const scene: ClapScene | undefined = referenceSegment?.sceneId
      ? scenes.find((s) => s.id === referenceSegment.sceneId)
      : undefined

    // we should be careful with how we filter and send the segments to the API
    //
    // - we need to remove elements that are specific to the browser (eg. audio context nodes)
    // - we may need to remove binary files (base64 assets) like for sound and music,
    //  although some AI models could support it
    // - we don't want to keep all the kinds of segments
    const existingSegments: TimelineSegment[] = activeSegments.filter(
      (s) =>
        // we only keep the camera
        s.category === ClapSegmentCategory.CAMERA ||
        s.category === ClapSegmentCategory.LOCATION ||
        s.category === ClapSegmentCategory.TIME ||
        s.category === ClapSegmentCategory.LIGHTING ||
        s.category === ClapSegmentCategory.ACTION ||
        s.category === ClapSegmentCategory.CHARACTER ||
        s.category === ClapSegmentCategory.DIALOGUE ||
        s.category === ClapSegmentCategory.WEATHER ||
        s.category === ClapSegmentCategory.ERA ||
        s.category === ClapSegmentCategory.MUSIC ||
        s.category === ClapSegmentCategory.SOUND ||
        s.category === ClapSegmentCategory.STYLE ||
        s.category === ClapSegmentCategory.GENERIC
    )

    // this is where we filter out expensive or heavy binary elements
    const serializableSegments: TimelineSegment[] = existingSegments.map(
      (segment) => ({
        ...segment,

        // we remove things that cannot be serialized easily
        audioBuffer: undefined,
        textures: {},

        // we also remove this since it might contain heavy information
        // although at some point we will want to put it back for some types,
        // as the most advanced LLMs can handle images and sound files
        assetUrl: '',
        assetSourceType: ClapAssetSource.EMPTY,
      })
    )

    const request: AssistantRequest = {
      settings,
      prompt: message,
      segments: serializableSegments,
      fullScene: scene?.sequenceFullText || '',
      actionLine: scene?.line || '',
      entities: entityIndex,
      projectInfo: meta.description,
      history: get().history,
    }

    console.log(`processUserMessage: calling askAssistant() with:`, request)
    const assistantMessage = await askAssistant(request)
    console.log(
      `processUserMessage: result from askAssistant():`,
      assistantMessage
    )

    if (assistantMessage.action === AssistantAction.UPDATE_STORY_AND_SCENE) {
      await updateStoryAndScene({
        assistantMessage,
        existingSegments,
      })
    } else {
      await processActionOrMessage(assistantMessage)
    }
  },
}))
