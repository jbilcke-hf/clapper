import { HfInference, HfInferenceEndpoint } from "@huggingface/inference"

import { RenderRequest } from "@/types"
import { ClapSegment, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"
import { blobToBase64DataUri } from "@/lib/utils/blobToBase64DataUri"

export async function renderSegment(request: RenderRequest): Promise<ClapSegment> {

  const hf: HfInferenceEndpoint = new HfInference(request.settings.huggingFaceApiKey)

  if (request.segment.category !== ClapSegmentCategory.STORYBOARD) {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Hugging Face". Please open a pull request with (working code) to solve this!`)
  }
  
  const segment: ClapSegment = { ...request.segment }

  try {
    const blob: Blob = await hf.textToImage({
      model: request.settings.huggingFaceModelForImage,
      inputs: getVideoPrompt(
        request.segments,
        request.entities
      )
    })

    segment.assetUrl = await blobToBase64DataUri(blob)
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
  } catch (err) {
    console.error(`failed to call Replicate: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}