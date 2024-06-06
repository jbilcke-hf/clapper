import * as fal from '@fal-ai/serverless-client'

import { FalAiImageSize, RenderRequest } from "@/types"
import { ClapMediaOrientation, ClapSegment, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"
import { fetchContentToBase64 } from '@/lib/utils/fetchContentToBase64'

export async function renderSegment(request: RenderRequest): Promise<ClapSegment> {
  if (!request.settings.falAiApiKey) {
    throw new Error(`Missing API key for "Fal.ai"`)
  }
  if (request.segment.category !== ClapSegmentCategory.STORYBOARD) {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Fal.ai". Please open a pull request with (working code) to solve this!`)
  }

  fal.config({
    credentials: request.settings.falAiApiKey
  })

  const segment: ClapSegment = { ...request.segment }

  const visualPrompt = getVideoPrompt(
    request.segments,
    request.entities
  )

  const imageSize =
    request.meta.orientation === ClapMediaOrientation.SQUARE
      ? FalAiImageSize.SQUARE_HD
      : request.meta.orientation === ClapMediaOrientation.PORTRAIT
      ? FalAiImageSize.PORTRAIT_16_9
      : FalAiImageSize.LANDSCAPE_16_9

  try {

    // for doc see: 
    // https://fal.ai/models/fal-ai/fast-sdxl/api
    
    const result = await fal.run(request.settings.falAiModelForImage, {
      input: {
        prompt: visualPrompt,
        image_size: imageSize,
        sync_mode: true,
        enable_safety_checker: request.settings.censorNotForAllAudiencesContent
      },
    }) as {
      prompt: string

      timings: { inference: number }
      has_nsfw_concepts: boolean[]
      seed: number
      images: {
        url: string
        width: number
        height: number
        content_type: string
      }[]
    }

    if (request.settings.censorNotForAllAudiencesContent) {
      if (result.has_nsfw_concepts.includes(true)) {
        throw new Error(`The generated content has been filtered according to your safety settings`)
      }
    }
    /*
    const result = await fal.subscrirunbe(request.settings.falAiModelForImage, {
      input: {
        prompt: visualPrompt
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    }) as {
      prompt: string;
      images: { url: string; content_type: string }[]
    }
      */

    // {
    //   "images": [
    //     {
    //       "url": "",
    //       "content_type": "image/jpeg"
    //     }
    //   ],
    //   "prompt": ""
    // }

    // console.log("response from fal.ai:", result.images)
    // TODO: this might be also in videos, since we are gonna generate videos as well
    const content = result.images[0]?.url || ""

    segment.assetUrl = content.startsWith("data:")
      ? content
      : (await fetchContentToBase64(content))

    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
  } catch (err) {
    console.error(`failed to call Fal.ai: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}