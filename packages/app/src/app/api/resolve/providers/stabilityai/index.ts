import { ClapSegmentCategory } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { generateImage } from './generateImage'
import { generateVideo } from './generateVideo'
import {
  builtinProviderCredentialsStabilityai,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.stabilityAiApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "Stability.ai"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsStabilityai
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsStabilityai
    }
  }

  const segment = request.segment

  if (request.segment.category === ClapSegmentCategory.IMAGE) {
    segment.assetUrl = await generateImage(request)
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    segment.assetUrl = await generateVideo(request)
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Stability.ai". Please open a pull request with (working code) to solve this!`
    )
  }
  return segment
}
