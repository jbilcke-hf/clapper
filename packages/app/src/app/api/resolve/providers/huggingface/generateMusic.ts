import { InferenceClient } from '@huggingface/inference'

import { ResolveRequest } from '@aitube/clapper-services'
import {
  builtinProviderCredentialsHuggingface,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function generateMusic(request: ResolveRequest): Promise<string> {
  if (!request.settings.musicGenerationWorkflow.data) {
    throw new Error(
      `HuggingFace.generateMusic: cannot generate without a valid musicGenerationWorkflow`
    )
  }

  if (!request.prompts.music.positive) {
    throw new Error(
      `HuggingFace.generateMusic: cannot generate without a valid music prompt`
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

  const hf = new InferenceClient(apiKey)
  /*
  hf.textToMusic doesn't exist yet!

  const blob: Blob = await hf.textToMusic({
    model: request.settings.musicGenerationWorkflow.data,
    inputs: request.prompts.music.positive,
  })

  console.log('output from Hugging Face Inference API:', blob)
  */

  throw new Error(`finish me`)
}
