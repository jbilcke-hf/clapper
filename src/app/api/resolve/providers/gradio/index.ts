import { ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { ResolveRequest } from "@/types"
import { callGradioApi } from "@/lib/hf/callGradioApi"

export async function resolveSegment(request: ResolveRequest): Promise<ClapSegment> {

  const segment = request.segment

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
    segment.assetUrl = await callGradioApi({
      url: request.settings.gradioApiUrlForImage,
      inputs: request.prompts.image,
    })
  } if (request.segment.category === ClapSegmentCategory.DIALOGUE) {
    segment.assetUrl = await callGradioApi({
      url: request.settings.gradioApiUrlForVoice,
      inputs: request.prompts.voice,
    })
  } if (request.segment.category === ClapSegmentCategory.VIDEO) {
    segment.assetUrl = await callGradioApi({
      url: request.settings.gradioApiUrlForVideo,
      inputs: request.prompts.video,
    })
  } else {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Gradio". Please open a pull request with (working code) to solve this!`)
  }
  
  return segment
}