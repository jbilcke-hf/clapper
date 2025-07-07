import { SupportedFields } from '../types'

export function getDefaultFields(): SupportedFields {
  return {
    inputPositiveTextPrompt: '',
    hasPositiveTextPrompt: false,
    inputNegativeTextPrompt: '',
    hasNegativeTextPrompt: false,
    inputImage: '',
    hasInputImage: false,
    inputAudio: '',
    hasInputAudio: false,
    inputWidth: 1024,
    hasInputWidth: false,
    inputHeight: 574,
    hasInputHeight: false,
    inputSteps: 8,
    hasInputSteps: false,
    inputGuidance: 7,
    hasInputGuidance: false,
    inputSeed: -1,
    hasInputSeed: false,
    inputDuration: 2,
    hasInputDuration: false,
    inputFps: 16,
    hasInputFps: false,
  }
}
