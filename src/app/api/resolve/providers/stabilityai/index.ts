import { ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { ResolveRequest } from "@aitube/clapper-services"
import { generateImage } from "./generateImage"

export async function resolveSegment(request: ResolveRequest): Promise<ClapSegment> {
  if (!request.settings.stabilityAiApiKey) {
    throw new Error(`Missing API key for "Stability.ai"`)
  }

  const segment = request.segment

  // for doc see: 
  // https://fal.ai/models/fal-ai/fast-sdxl/api
    
   if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
    segment.assetUrl = await generateImage(request)
  } else {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Stability.ai". Please open a pull request with (working code) to solve this!`)
  }
  return segment
}