"use client"

import { create } from "zustand"
import { UUID } from "@aitube/clap"

import { AssistantStore, ChatEvent } from "./types"
import { getDefaultAssistantState } from "./getDefaultAssistantState"

// URL to the speech to text websocket server
export const STT_API_URL = process.env.NEXT_PUBLIC_SPEECH_TO_TEXT_API_URL || ""

const enableTextToSpeech = false

export const useAssistant = create<AssistantStore>((set, get) => ({
  ...getDefaultAssistantState(),
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
  }
}))

