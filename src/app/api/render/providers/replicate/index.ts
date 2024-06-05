import Replicate from 'replicate'

import { RenderRequest } from "@/types"
import { ClapSegment, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"
import { fetchContentToBase64 } from '@/lib/utils/fetchContentToBase64'

export async function renderSegment(request: RenderRequest): Promise<ClapSegment> {

  const replicate = new Replicate({ auth: request.settings.huggingFaceApiKey })

  if (request.segment.category !== ClapSegmentCategory.STORYBOARD) {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Replicate". Please open a pull request with (working code) to solve this!`)
  }
  
  const segment: ClapSegment = { ...request.segment }

  try {

    const output = await replicate.run(
      request.settings.replicateModelForImage as any, {
      input: {
        prompt: getVideoPrompt(
          request.segments,
          request.entities
        )
      }
    })

    console.log(`Replicate replied: `, output)

    segment.assetUrl = await fetchContentToBase64(`${output}`)
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
  } catch (err) {
    console.error(`failed to call Replicate: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}