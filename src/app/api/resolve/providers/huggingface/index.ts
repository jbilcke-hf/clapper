import { HfInference, HfInferenceEndpoint } from "@huggingface/inference"

import { ResolveRequest } from "@/types"
import { ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { generateImage } from "./generateImage"
import { generateVoice } from "./generateVoice"
import { generateVideo } from "./generateVideo"

export async function resolveSegment(request: ResolveRequest): Promise<ClapSegment> {

  if (!request.settings.huggingFaceApiKey) {
    throw new Error(`Missing API key for "Hugging Face"`)
  }

  const segment = request.segment

  const hf: HfInferenceEndpoint = new HfInference(request.settings.huggingFaceApiKey)

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
    segment.assetUrl = await generateImage(request)
  } if (request.segment.category === ClapSegmentCategory.DIALOGUE) {
    segment.assetUrl = await generateVoice(request)
  }  if (request.segment.category === ClapSegmentCategory.VIDEO) {
    segment.assetUrl = await generateVideo(request)
  } else {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Hugging Face" with model (or space) "${request.settings.huggingFaceModelForVideo}". Please open a pull request with (working code) to solve this!`)
  }
  return segment
}