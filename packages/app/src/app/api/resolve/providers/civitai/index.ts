import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { Civitai } from 'civitai'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.civitaiApiKey) {
    throw new Error(`Missing API key for "Civitai"`)
  }

  const civitai = new Civitai({
    auth: request.settings.civitaiApiKey,
  })

  const segment: TimelineSegment = request.segment

  throw new Error(
    `Clapper doesn't support ${request.segment.category} generation for provider "Civitai". Please open a pull request with (working code) to solve this!`
  )

  return segment
}
