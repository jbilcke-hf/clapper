import { ComputeProvider } from '@aitube/clapper-services'

export function parseComputeProvider(
  input: any,
  defaultVendor?: ComputeProvider
): ComputeProvider {
  let unknownString = `${input || ''}`.trim()

  // the "normal" case
  if (
    Object.values(ComputeProvider).includes(unknownString as ComputeProvider)
  ) {
    return unknownString as ComputeProvider
  }

  let vendor: ComputeProvider = defaultVendor || ComputeProvider.NONE

  unknownString = unknownString.toLowerCase()

  if (
    unknownString === 'none' ||
    unknownString === 'undefined' ||
    unknownString === ''
  ) {
    vendor = ComputeProvider.NONE
  } else if (
    unknownString === 'huggingface' ||
    unknownString === 'hugging_face'
  ) {
    vendor = ComputeProvider.HUGGINGFACE
  } else if (unknownString === 'replicate') {
    vendor = ComputeProvider.REPLICATE
  } else if (unknownString === 'comfyicu' || unknownString === 'comfy.icu') {
    vendor = ComputeProvider.COMFY_COMFYICU
  } else if (
    unknownString === 'eleven labs' ||
    unknownString === 'eleven labs'
  ) {
    vendor = ComputeProvider.ELEVENLABS
  } else if (unknownString === 'openai') {
    vendor = ComputeProvider.OPENAI
  } else if (unknownString === 'stabilityai') {
    vendor = ComputeProvider.STABILITYAI
  } else if (unknownString === 'fireworksai') {
    vendor = ComputeProvider.FIREWORKSAI
  } else if (unknownString === 'groq') {
    vendor = ComputeProvider.GROQ
  } else if (unknownString === 'falai') {
    vendor = ComputeProvider.FALAI
  } else if (unknownString === 'modelslab') {
    vendor = ComputeProvider.MODELSLAB
  } else {
    vendor = ComputeProvider.NONE
  }
  return vendor
}
