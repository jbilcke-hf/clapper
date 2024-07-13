"use client"

import { create } from "zustand"
import { MicStore } from "@aitube/clapper-services"

import { getDefaultMicState } from "./getDefaultMicState"

export const useMic = create<MicStore>((set, get) => ({
  ...getDefaultMicState(),

  init: () => {
    const { isSupported, interimResults, lang, continuous, grammar, grammarWeight } = get()

    if (!isSupported) {
      return
    }
    
    // Initialize webkitSpeechRecognition
    const recognition: SpeechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()

    if (!recognition) {
      set({ isSupported: false, error: 'this browser doesn\'t support speech recognition' })
      return
    }

    recognition.interimResults = interimResults
    recognition.lang = lang
    recognition.continuous = continuous

    const speechRecognitionList = new window.webkitSpeechGrammarList()
    speechRecognitionList.addFromString(grammar, grammarWeight)
    recognition.grammars = speechRecognitionList

    const handleResult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results?.[i]?.[0]?.transcript || '';
      }
      set({ transcript });
    };

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      let error = `${event.error} ${event.message})`

      if (event.error === 'aborted') {
        error = 'speech recognition aborted'
      }
      set({ isListening: false, error })
    };

    const handleEnd = () => {
      set({ isListening: false, transcript: '' })
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('end', handleEnd);

    set({ recognition })
  },
  start: () => {
    const { isSupported, recognition, isListening } = get()
    if (!isSupported || !recognition || isListening) { return }
    recognition.start()
    set({ isListening: true, error: '' })
  },
  stop: () => {
    const { isSupported, recognition, isListening } = get()
    if (!isSupported || !recognition || !isListening) { return }
    recognition.stop()
    set({ isListening: false, error: '' })
  },
  clear: () => {
    set({ transcript: '', error: '' })
  },
}))
