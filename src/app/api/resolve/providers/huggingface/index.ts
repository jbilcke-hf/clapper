import { HfInference, HfInferenceEndpoint } from "@huggingface/inference"

import { ResolveRequest } from "@/types"
import { ClapSegment, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"
import { blobToBase64DataUri } from "@/lib/utils/blobToBase64DataUri"
import { getResolveRequestPrompts } from "@/lib/utils/getResolveRequestPrompts"
import { decodeOutput } from "@/lib/utils/decodeOutput"

export async function resolveSegment(request: ResolveRequest): Promise<ClapSegment> {

  if (!request.settings.huggingFaceApiKey) {
    throw new Error(`Missing API key for "Hugging Face"`)
  }
  
  console.log(`key: ${request.settings.huggingFaceApiKey}`)
  const hf: HfInferenceEndpoint = new HfInference(request.settings.huggingFaceApiKey)

  if (request.segment.category !== ClapSegmentCategory.STORYBOARD) {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Hugging Face". Please open a pull request with (working code) to solve this!`)
  }
  
  const segment: ClapSegment = { ...request.segment }

  const prompts = getResolveRequestPrompts(request)
  
  try {
    const blob: Blob = await hf.textToImage({
      model: request.settings.huggingFaceModelForImage,
      inputs: prompts.positivePrompt
    })

    segment.assetUrl = await decodeOutput(blob)
    console.log(`successfully called Hugging Face`)
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
  } catch (err) {
    console.error(`failed to call Hugging Face: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}