import { HfInference, HfInferenceEndpoint } from '@huggingface/inference'

import { ResolveRequest } from '@aitube/clapper-services'
import {
  builtinProviderCredentialsHuggingface,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function generateVoice(request: ResolveRequest): Promise<string> {
  if (!request.settings.voiceGenerationWorkflow.data) {
    throw new Error(
      `HuggingFace.generateVoice: cannot generate without a valid voiceGenerationWorkflow`
    )
  }

  if (!request.prompts.voice.positive) {
    throw new Error(
      `HuggingFace.generateVoice: cannot generate without a valid voice prompt`
    )
  }

  let apiKey = request.settings.huggingFaceApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "Hugging Face"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsHuggingface
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsHuggingface
    }
  }

  const hf: HfInferenceEndpoint = new HfInference(apiKey)

  const blob: Blob = await hf.textToSpeech({
    model: request.settings.voiceGenerationWorkflow.data,
    inputs: request.prompts.voice.positive,
  })

  console.log('output from Hugging Face Inference API:', blob)

  throw new Error(`finish me`)
}
