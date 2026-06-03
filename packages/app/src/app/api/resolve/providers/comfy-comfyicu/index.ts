import { ResolveRequest } from '@aitube/clapper-services'
import { ClapAssetSource } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'

import { buildComfyUiWorkflowPrompt } from '../comfyui/buildWorkflowPrompt'
import {
  extractCloudOutputUrl,
  getGenerationWorkflowForSegment,
  getRunId,
  isTerminalFailureStatus,
  isTerminalSuccessStatus,
  readCloudAssetAsDataUri,
  sleep,
} from '../comfy-cloud'
import { ComfyIcuApiResponseWorkflowStatus } from './types'

const COMFY_ICU_API_URL = 'https://comfy.icu/api/v1'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyIcuApiKey) {
    throw new Error(`Missing API key for "Comfy.icu"`)
  }

  const segment: TimelineSegment = { ...request.segment }
  const workflow = getGenerationWorkflowForSegment(request)
  const workflowId = workflow.id.split('://').pop() || ''

  if (!workflowId) {
    throw new Error(`The ComfyICU workflow ID is missing`)
  }

  const prompt = buildComfyUiWorkflowPrompt({
    request,
    clapWorkflow: workflow,
  })

  const queued = await queueComfyIcuRun({
    apiKey: request.settings.comfyIcuApiKey,
    workflowId,
    prompt,
  })
  const runId = getRunId(queued)

  if (!runId) {
    throw new Error(
      `ComfyICU did not return a run id: ${JSON.stringify(queued)}`
    )
  }

  const result = await waitForComfyIcuRun({
    apiKey: request.settings.comfyIcuApiKey,
    workflowId,
    runId,
  })
  const outputUrl = extractCloudOutputUrl(result)

  if (!outputUrl) {
    throw new Error(`ComfyICU run ${runId} finished without an output URL`)
  }

  segment.assetUrl = await readCloudAssetAsDataUri(outputUrl)
  segment.assetSourceType = ClapAssetSource.DATA

  return segment
}

async function queueComfyIcuRun({
  apiKey,
  workflowId,
  prompt,
}: {
  apiKey: string
  workflowId: string
  prompt: Record<string, unknown>
}): Promise<any> {
  const response = await fetch(
    `${COMFY_ICU_API_URL}/workflows/${workflowId}/runs`,
    {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        prompt,
      }),
      method: 'POST',
    }
  )

  if (!response.ok) {
    throw new Error(
      `ComfyICU queue failed (${response.status}): ${await response.text()}`
    )
  }

  return response.json()
}

async function waitForComfyIcuRun({
  apiKey,
  workflowId,
  runId,
}: {
  apiKey: string
  workflowId: string
  runId: string
}): Promise<ComfyIcuApiResponseWorkflowStatus> {
  const timeoutAt = Date.now() + 1000 * 60 * 60

  while (Date.now() < timeoutAt) {
    const response = await fetch(
      `${COMFY_ICU_API_URL}/workflows/${workflowId}/runs/${runId}`,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `ComfyICU status failed (${response.status}): ${await response.text()}`
      )
    }

    const result = (await response.json()) as ComfyIcuApiResponseWorkflowStatus
    const status = result.status || ''

    if (isTerminalFailureStatus(status)) {
      throw new Error(`ComfyICU run ${runId} failed: ${JSON.stringify(result)}`)
    }

    if (isTerminalSuccessStatus(status) || extractCloudOutputUrl(result)) {
      return result
    }

    await sleep(2000)
  }

  throw new Error(`Timed out waiting for ComfyICU run ${runId}`)
}
