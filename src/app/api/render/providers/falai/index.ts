import * as fal from '@fal-ai/serverless-client'

import { RenderRequest } from "@/types"
import { ClapSegment, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"
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

  try {

    const result = await fal.subscribe(request.settings.falAiModelForImage, {
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

    // {
    //   "images": [
    //     {
    //       "url": "",
    //       "content_type": "image/jpeg"
    //     }
    //   ],
    //   "prompt": ""
    // }

    console.log(`response from Fal.ai:`, result)

    // TODO: this might be also in videos, since we are gonna generate videos as well
    const content = result.images[0]?.url || ""

    segment.assetUrl = await fetchContentToBase64(content)
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
  } catch (err) {
    console.error(`failed to call Fal.ai: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}