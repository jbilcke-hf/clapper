/**
 * Mic 
 */
export type MicState = {
  isSupported: boolean
  isListening: boolean
  transcript: string
  interimResults: boolean
  error: string
  lang: string
  grammar: string
  grammarWeight: number
  continuous: boolean
  recognition?: SpeechRecognition
}
export type MicControls = {
  init: () => void
  start: () => void
  stop: () => void
  clear: () => void
}

export type MicStore =
  MicState &
  MicControls
