import { ClapSegment, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"

import { ResolveRequest } from "@aitube/clapper-services"
import { getComfyWorkflow } from "../comfy/getComfyWorkflow"
import { runWorkflow } from "./runWorkflow"

export async function resolveSegment(request: ResolveRequest): Promise<ClapSegment> {
  if (!request.settings.replicateApiKey) {
    throw new Error(`Missing API key for "Replicate.com"`)
  }
  const workflow = getComfyWorkflow(request)

  const segment: ClapSegment = { ...request.segment }

  try {
    segment.assetUrl = await runWorkflow({
      apiKey: request.settings.replicateApiKey,
      workflow,
    })
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
  } catch (err) {
    console.error(`failed to call Replicate: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
    // request.segment.status = ClapSegmentStatus.ERROR
  }

  return segment
}