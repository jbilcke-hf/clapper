import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.hotshotApiKey) {
    throw new Error(`Missing API key for "Hotshot"`)
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
