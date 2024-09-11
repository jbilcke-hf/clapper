import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import {
  builtinProviderCredentialsHotshot,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.hotshotApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "Hotshot"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsHotshot
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsHotshot
    }
  }
  const segment: TimelineSegment = request.segment

  // TODO: implement the Hotshot API
  // (current status: waiting to hear back)

  // createHotshotVideo(...)

  throw new Error(
    `Clapper doesn't support ${request.segment.category} generation for provider "Hotshot". Please open a pull request with (working code) to solve this!`
  )

  return segment
}
