import { ResolveRequest } from '@aitube/clapper-services'
import { callGradioApi } from '@/lib/hf/callGradioApi'
import {
  builtinProviderCredentialsHuggingface,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function generateVideo(request: ResolveRequest): Promise<string> {
  if (!request.settings.videoGenerationWorkflow.data) {
    throw new Error(
      `HuggingFace.generateVideo: cannot generate without a valid videoGenerationWorkflow.data`
    )
  }

  if (!request.prompts.video.image) {
    throw new Error(
      `HuggingFace.generateVideo: cannot generate without a valid input image prompt`
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

  // TODO pass a type to the template function
  const assetUrl = await callGradioApi<string>({
    url: request.settings.videoGenerationWorkflow.data,
    inputs: request.prompts.video,
    apiKey,
  })

  return assetUrl
}
