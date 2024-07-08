import { ResolveRequest } from "@aitube/clapper-services"
import { ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"
import { TimelineSegment } from "@aitube/timeline"

export async function resolveSegment(request: ResolveRequest): Promise<TimelineSegment> {
  if (!request.settings.modelsLabApiKey) {
    throw new Error(`Missing API key for "ModelsLab.com"`)
  }
  if (request.segment.category !== ClapSegmentCategory.STORYBOARD) {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "ModelsLab". Please open a pull request with (working code) to solve this!`)
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