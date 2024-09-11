import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { Civitai } from 'civitai'
import {
  builtinProviderCredentialsCivitai,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.civitaiApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "Civitai"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsCivitai
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsCivitai
    }
  }

  const civitai = new Civitai({
    auth: apiKey,
  })

  const segment: TimelineSegment = request.segment

  throw new Error(
    `Clapper doesn't support ${request.segment.category} generation for provider "Civitai". Please open a pull request with (working code) to solve this!`
  )

  return segment
}
