import { ClapSegmentStatus, getClapAssetSourceType } from '@aitube/clap'

import { ResolveRequest } from '@aitube/clapper-services'
import { getComfyWorkflow } from '../comfy/getComfyWorkflow'
import { runWorkflow } from './runWorkflow'
import { TimelineSegment } from '@aitube/timeline'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.replicateApiKey) {
    throw new Error(`Missing API key for "Replicate.com"`)
  }
  const workflow = getComfyWorkflow(request)

  const segment: TimelineSegment = request.segment

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
