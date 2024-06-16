import Replicate from 'replicate'

import { ResolveRequest } from "@/types"
import { ClapSegment, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"
import { getResolveRequestPrompts } from '@/lib/utils/getResolveRequestPrompts'
import { decodeOutput } from '@/lib/utils/decodeOutput'

export async function resolveSegment(request: ResolveRequest): Promise<ClapSegment> {
  if (!request.settings.replicateApiKey) {
    throw new Error(`Missing API key for "Replicate.com"`)
  }
  const replicate = new Replicate({ auth: request.settings.replicateApiKey })

  if (request.segment.category !== ClapSegmentCategory.STORYBOARD) {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Replicate". Please open a pull request with (working code) to solve this!`)
  }
  
  const segment: ClapSegment = { ...request.segment }

  const prompts = getResolveRequestPrompts(request)

  try {

    const output = await replicate.run(
      request.settings.replicateModelForImage as any, {
      input: {
        prompt: prompts.positivePrompt
      }
    })

    segment.assetUrl = await decodeOutput(output)
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
  } catch (err) {
    console.error(`failed to call Replicate: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}