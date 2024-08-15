import { MicState } from '@aitube/clapper-services'

export function getDefaultMicState(): MicState {
  return {
    isSupported:
      typeof window === 'undefined' || !('webkitSpeechRecognition' in window),
    isListening: false,
    transcript: '',
    interimResults: true,
    error: '',
    lang: 'en-US',
    grammar:
      '#JSGF V1.0; grammer punctuation; public <punc> =. |, |? | | ; | : ;',
    grammarWeight: 1,
    continuous: false,
    recognition: undefined,
  }
}
