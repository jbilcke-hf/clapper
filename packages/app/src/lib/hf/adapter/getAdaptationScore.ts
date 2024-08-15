import { SupportedFields } from '../types'

export function getAdaptationScore(supportedFields: SupportedFields) {
  let score = 0

  // TODO: rewrite this in a better way maybe
  // until then, please don't blame me if you forget to update those!
  score += supportedFields.hasPositiveTextPrompt ? 1 : 0
  score += supportedFields.hasNegativeTextPrompt ? 1 : 0
  score += supportedFields.hasInputImage ? 1 : 0
  score += supportedFields.hasInputAudio ? 1 : 0
  score += supportedFields.hasInputWidth ? 1 : 0
  score += supportedFields.hasInputHeight ? 1 : 0
  score += supportedFields.hasInputSteps ? 1 : 0
  score += supportedFields.hasInputGuidance ? 1 : 0
  score += supportedFields.inputSeed ? 1 : 0
  return score
}
