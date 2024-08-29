'use client'

import { create } from 'zustand'
import { MicStore } from '@aitube/clapper-services'

import { getDefaultMicState } from './getDefaultMicState'

const cutoffTimeInMs = 1200

export const useMic = create<MicStore>((set, get) => ({
  ...getDefaultMicState(),

  init: () => {
    const { interimResults, lang, continuous, grammar, grammarWeight } = get()

    try {
      // Initialize webkitSpeechRecognition
      const recognition: SpeechRecognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)()

      if (!recognition) {
        set({
          isSupported: false,
          error: "this browser doesn't support speech recognition",
        })
        return
      } else {
        set({
          isSupported: true,
          error: '',
        })
      }

      recognition.interimResults = true
      recognition.lang = lang
      recognition.continuous = true
  
      const speechRecognitionList = new window.webkitSpeechGrammarList()
      speechRecognitionList.addFromString(grammar, grammarWeight)
      recognition.grammars = speechRecognitionList
  
      let debounceTimer: NodeJS.Timeout | null = null
      let lastCompleteTranscript = ''
      let currentTranscript = ''
      let lastSpeechTime = Date.now()
  
      const handleResult = (event: SpeechRecognitionEvent) => {
        const currentTime = Date.now()
  
        // Check if it's been more than $cutoffTimeInMs since the last speech
        if (currentTime - lastSpeechTime > cutoffTimeInMs) {
          lastCompleteTranscript = ''
          currentTranscript = ''
        }
  
        lastSpeechTime = currentTime
  
        // Get the most recent result
        const latestResult = event.results[event.results.length - 1]
        currentTranscript = latestResult[0].transcript.trim()
  
        // If it's a final result, update lastCompleteTranscript
        if (latestResult.isFinal) {
          lastCompleteTranscript = currentTranscript
        }
  
        const fullTranscript =
          lastCompleteTranscript +
          (currentTranscript !== lastCompleteTranscript
            ? ' ' + currentTranscript
            : '')
  
        if (debounceTimer) {
          clearTimeout(debounceTimer)
        }
  
        debounceTimer = setTimeout(() => {
          set({ transcript: fullTranscript.trim() })
          debounceTimer = null
        }, cutoffTimeInMs)
      }
  
      const handleError = (event: SpeechRecognitionErrorEvent) => {
        let error = `${event.error} ${event.message})`
  
        if (event.error === 'aborted') {
          error = 'speech recognition aborted'
        }
        set({ isListening: false, error })
      }
  
      const handleEnd = () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer)
          const fullTranscript =
            lastCompleteTranscript +
            (currentTranscript !== lastCompleteTranscript
              ? ' ' + currentTranscript
              : '')
          set({ transcript: fullTranscript.trim() })
        }
        set({ isListening: false })
      }
  
      recognition.addEventListener('result', handleResult)
      recognition.addEventListener('error', handleError)
      recognition.addEventListener('end', handleEnd)
  
      set({ recognition })
    } catch (err) {
      set({
        isSupported: false,
        error: "this browser doesn't support speech recognition",
      })
    }
  },
  start: () => {
    const { isSupported, recognition, isListening } = get()
    if (!isSupported || !recognition || isListening) {
      return
    }
    recognition.start()
    set({ isListening: true, error: '' })
  },
  stop: () => {
    const { isSupported, recognition, isListening } = get()
    if (!isSupported || !recognition || !isListening) {
      return
    }
    recognition.stop()
    set({ isListening: false, error: '' })
  },
  clear: () => {
    set({ transcript: '', error: '' })
  },
}))

if (typeof window !== 'undefined') {
  useMic.getState().init()
}
