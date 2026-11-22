import { ClapSegmentStatus, getClapAssetSourceType } from '@aitube/clap'
import { ResolveRequest } from '@aitube/clapper-services'
import { TimelineSegment } from '@aitube/timeline'

import {
  builtinProviderCredentialsReplicate,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'
import { buildPopulatedComfyUiWorkflow } from '../comfyui/createPromptBuilder'
import { resolveClapWorkflowForSegment } from '../comfyui'
import { runWorkflow } from './runWorkflow'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.replicateApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "Replicate.com"`)
      } else {
        apiKey = builtinProviderCredentialsReplicate
      }
    } else {
      apiKey = builtinProviderCredentialsReplicate
    }
  }

  const clapWorkflow = resolveClapWorkflowForSegment(request)
  const { workflowJson } = buildPopulatedComfyUiWorkflow(clapWorkflow, request)

  const segment: TimelineSegment = { ...request.segment }

  try {
    const rawResult = await runWorkflow({
      apiKey,
      workflow: JSON.stringify(workflowJson),
    })
    const outputUrl = Array.isArray(rawResult) ? rawResult[0] : rawResult
    segment.assetUrl = String(outputUrl || '')
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = segment.assetUrl
      ? ClapSegmentStatus.COMPLETED
      : ClapSegmentStatus.TO_GENERATE
  } catch (err) {
    console.error(`failed to call Replicate ComfyUI workflow`)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}
