import { HfInference, HfInferenceEndpoint } from '@huggingface/inference'

import { ResolveRequest } from '@aitube/clapper-services'
import { ClapSegmentCategory } from '@aitube/clap'

import { generateImage } from './generateImage'
import { generateVoice } from './generateVoice'
import { generateVideo } from './generateVideo'
import { TimelineSegment } from '@aitube/timeline'
import {
  builtinProviderCredentialsHuggingface,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
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

  const segment = request.segment

  // const hf: HfInferenceEndpoint = new HfInference(apiKey)

  if (request.segment.category === ClapSegmentCategory.IMAGE) {
    segment.assetUrl = await generateImage(request)
  } else if (request.segment.category === ClapSegmentCategory.DIALOGUE) {
    segment.assetUrl = await generateVoice(request)
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    segment.assetUrl = await generateVideo(request)
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Hugging Face". Please open a pull request with (working code) to solve this!`
    )
  }
  return segment
}
