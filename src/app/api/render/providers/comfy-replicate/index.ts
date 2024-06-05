import { ClapSegment, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"

import { RenderRequest } from "@/types"
import { getComfyWorkflow } from "../comfy/getComfyWorkflow"
import { runWorkflow } from "./runWorkflow"

export async function renderSegment(request: RenderRequest): Promise<ClapSegment> {

  const workflow = getComfyWorkflow(request)

  // TODO support Hugging Face as well
  // const await runWithHuggingFace({
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