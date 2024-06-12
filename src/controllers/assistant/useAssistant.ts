"use client"

import { create } from "zustand"
import { ClapOutputType, ClapProject, ClapSegment, ClapSegmentCategory, newSegment, UUID } from "@aitube/clap"

import { AssistantStore, ChatEvent } from "./types"
import { getDefaultAssistantState } from "./getDefaultAssistantState"
import { DEFAULT_DURATION_IN_MS_PER_STEP, findFreeTrack, TimelineStore, useTimeline } from "@aitube/timeline"
import { useSettings } from "../settings"
import { AssistantRequest } from "@/types"
import { askAssistant } from "./askAssistant"

// URL to the speech to text websocket server
export const STT_API_URL = process.env.NEXT_PUBLIC_SPEECH_TO_TEXT_API_URL || ""

const enableTextToSpeech = false

export const useAssistant = create<AssistantStore>((set, get) => ({
  ...getDefaultAssistantState(),
  /*
  toggleVoice: async (): Promise<boolean> => {
   
    if (!navigator?.mediaDevices?.getUserMedia || !MediaRecorder.isTypeSupported("audio/webm")) {
      console.error("This environment doesn't support microphone recording")
      return false
    }

    if (!enableTextToSpeech) {
      console.error("Text to speech is currently disabled, aborting")
      return false
    }

    const isVoiceEnabled = !get().isVoiceEnabled

    set({ isVoiceEnabled })

    if (isVoiceEnabled) {
   
      const stream = get().stream || (await navigator.mediaDevices.getUserMedia({ audio: true }))
      set({ stream })

      const recorder = get().recorder || new MediaRecorder(stream, { mimeType: "audio/webm" })
      set({ recorder })

      if (!get().socket) {
        //create a websocket connection
        const socket = new WebSocket(STT_API_URL)
        set({ socket })

        socket.onopen = () => {
          console.log({ event: "onopen" });
          recorder.addEventListener("dataavailable", async (event) => {
            if (event.data.size > 0 && socket.readyState === 1) {
              socket.send(event.data)
            }
          })
          recorder.start(1000)
        }
      
        socket.onmessage = (message) => {
          let transcript = ""
          try {
            const received = JSON.parse(message.data)
            transcript = received.channel.alternatives[0].transcript || ""
          } catch (err) {
            console.error(err)
          }
          set({
            transcript,
          })
        }
      
        socket.onclose = () => {
          console.log({ event: "onclose" });
        }
      
        socket.onerror = (error) => {
          console.log({ event: "onerror", error });
        }
      }
    } else {
      // voice recognition is expensive, so we make sure we removed everything
      const { socket, recorder, stream } = get()

      // stop existing socket
      socket?.close()
      recorder?.stop()

      set({
        socket: undefined,
        recorder: undefined,
      })
    }

    return true
  },
  */

  runCommand: (prompt: string) => {

    const query = prompt
      .toLowerCase().trim()
      .replace(/(?:\.)$/gi, "") // remove trailing periods

    if (!query) {
      return true
    }

    console.log(`do something with the query: "${query}"`)

    // TODO @julian: put back here voice control code from the original Clapper project
    return false
  },

  addEventToHistory: (event: Partial<ChatEvent>) => {

    const defaultEvent : ChatEvent = {
      eventId: UUID(),
      roomId: "",
      roomName: "",
      senderId: "director",
      senderName: "Director",
      sentAt: new Date().toISOString(),
      message: "",
      isCurrentUser: true,
    }
    const newEvent: ChatEvent = {
      ...defaultEvent,
      ...event,
      isCurrentUser: event.senderId !== "assistant"
    }

    const { history } = get()

    set({
      history: history.concat(newEvent)
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
    if (!clap) { return }

    // note: settings is not the store (with methods etc)
    // but a serializable snapshot of the values only
    const settings = useSettings.getState().getSettings()

    addEventToHistory({
      senderId: "director",
      senderName: "Director",
      message,
    })
  

    const basicCommand = await runCommand(message)
    // LLM analysis can be slow and expensive, so first we try to see if this was a trivial command
    // like "start", "pause", "stop" etc
    if (basicCommand) {

      addEventToHistory({
        senderId: "assistant",
        senderName: "Assistant",
        message: `${basicCommand}`,
      })
      return // no need to go further
    }
    
    console.log(`TODO @julian: restore the concept of "addSegment()", "updateSegment()", "active segment" and "cursor position" inside @aitube-timeline`)
    // const { addSegment, activeSegments, cursorInSteps,  } = useTimeline.getState()

    const activeSegments: ClapSegment[] = []
    const cursorInSteps = 0
  
    const referenceSegment: ClapSegment | undefined = activeSegments.at(0)
    
    if (!referenceSegment) {
      throw new Error(`No segment under the current cursor`)
    }

    console.log(`TODO @julian: filter entities to only keep the ones in the current active segment? (although.. maybe a bad idea since the LLM need as much context as possible to "fill in the gap" eg. repair/invent missing elements of the story)`)

    const entities = clap.entityIndex

    const projectInfo = clap.meta.description

    const sceneId = referenceSegment.sceneId

    const scene = clap.scenes.find(s => s.id === sceneId)
    
    const fullScene: string = scene?.sequenceFullText || ""
    const actionLine: string = scene?.line || ""
  
    const segments: ClapSegment[] = activeSegments
      .filter(s =>
        s.category === ClapSegmentCategory.LOCATION ||
        s.category === ClapSegmentCategory.TIME ||
        s.category === ClapSegmentCategory.LIGHTING ||
        s.category === ClapSegmentCategory.ACTION ||
        s.category === ClapSegmentCategory.DIALOGUE ||
        s.category === ClapSegmentCategory.WEATHER  
      )
  
    console.log(`TODO @julian: provide both contextual segments and editable ones to the LLM?`)

    const request: AssistantRequest = {
      settings,
      prompt: message,
      segments,
      fullScene,
      actionLine,
      entities,
      projectInfo,
    }
  
    const { prompt, categoryName, llmOutput } = await askAssistant(request)
    if (!prompt.length) {
      addEventToHistory({
        senderId: "assistant",
        senderName: "Assistant",
        message: llmOutput || "🤔" // or "???" for a "boomer" theme
      })
      return
    }
  
    let match = segments.find(s => s.category === categoryName) || undefined
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
      console.log("Creating new existing segment:", newSeg)
  
      console.log(`TODO Julian: add the segment!!`)
      // addSegment(newSeg)

      addEventToHistory({
        senderId: "assistant",
        senderName: "Assistant",
        message: `Segment added: ${newSeg.prompt}`,
      })
    } else {
  
      console.log("Updating an existing segment to:", {
        ...match,
        prompt,
        label: prompt,
      })
  
      console.log(`TODO Julian: update the segment!!`)
      // addSegment(newSeg)

      /*
      updateSegment({
        ...match,
        prompt,
        label: prompt,
      })
        */

      addEventToHistory({
        senderId: "assistant",
        senderName: "Assistant",
        message: `Segment updated: ${prompt}`,
      })
    }
  }
}))