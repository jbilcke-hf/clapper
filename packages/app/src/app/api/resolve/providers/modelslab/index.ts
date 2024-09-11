import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import {
  builtinProviderCredentialsModelslab,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.modelsLabApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "ModelsLab.com"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsModelslab
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsModelslab
    }
  }

  if (request.segment.category !== ClapSegmentCategory.IMAGE) {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "ModelsLab". Please open a pull request with (working code) to solve this!`
    )
  }

  const segment: TimelineSegment = request.segment

  try {
    throw new Error(`Not Implemented!`)
  } catch (err) {
    console.error(`failed to call ModelsLab: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}
