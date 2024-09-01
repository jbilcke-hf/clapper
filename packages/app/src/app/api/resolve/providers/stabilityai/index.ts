import { ClapSegmentCategory } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { generateImage } from './generateImage'
import { generateVideo } from './generateVideo'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.stabilityAiApiKey) {
    throw new Error(`Missing API key for "Stability.ai"`)
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
