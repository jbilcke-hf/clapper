
import { ResolveRequest, StabilityAiImageSize } from "@/types"
import { ClapMediaOrientation, ClapSegment, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"
import { decodeOutput } from '@/lib/utils/decodeOutput'
import { getResolveRequestPrompts } from '@/lib/utils/getResolveRequestPrompts'
import { performRequest } from "./performRequest"

export async function resolveSegment(request: ResolveRequest): Promise<ClapSegment> {
  if (!request.settings.stabilityAiApiKey) {
    throw new Error(`Missing API key for "Stability.ai"`)
  }


  const segment: ClapSegment = { ...request.segment }

  let content = ''

  const prompts = getResolveRequestPrompts(request)

  try {

    // for doc see: 
    // https://fal.ai/models/fal-ai/fast-sdxl/api
    
    if (request.segment.category === ClapSegmentCategory.STORYBOARD) {

            
      if (!prompts.positivePrompt) {
        console.error(`resolveSegment: cannot resolve a storyboard with an empty prompt`)
        return segment
      }

      const imageSize: StabilityAiImageSize =
        request.meta.orientation === ClapMediaOrientation.SQUARE
          ? StabilityAiImageSize.SQUARE
          : request.meta.orientation === ClapMediaOrientation.PORTRAIT
          ? StabilityAiImageSize.PORTRAIT_9_16
          : StabilityAiImageSize.LANDSCAPE_16_9

      const assetUrl = await performRequest({
        modelName: request.settings.imageGenerationModel,

        // what's cool about the ultra model is its capacity to take in
        // very large prompts, up to 10000 characters apparently?

        // To control the weight of a given word use the format (word:weight),
        // where word is the word you'd like to control the weight of and weight
        // is a value between 0 and 1.
        // For example: The sky was a crisp (blue:0.3) and (green:0.8) would
        // convey a sky that was blue and green, but more green than blue.
        positivePrompt: prompts.positivePrompt,
        negativePrompt: prompts.negativePrompt,
        
        imageSize,

        apiKey: request.settings.stabilityAiApiKey
      })

      content = assetUrl
    } else {
      throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Stability.ai". Please open a pull request with (working code) to solve this!`)
    }

    segment.assetUrl = await decodeOutput(content)
    // console.log(`segment.assetUrl = ${segment.assetUrl.slice(0, 80)}..`)
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
  } catch (err) {
    console.error(`failed to call Stability.ai: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}