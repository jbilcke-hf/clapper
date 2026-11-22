import { ResolveRequest } from '@aitube/clapper-services'
import { ClapSegmentStatus, getClapAssetSourceType } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'

import { buildPopulatedComfyUiWorkflow } from '../comfyui/createPromptBuilder'
import { resolveClapWorkflowForSegment } from '../comfyui'
import {
  ComfyIcuApiRequestRunWorkflow,
  ComfyIcuApiResponseWorkflowStatus,
} from './types'

export async function pollComfyIcuRun({
  workflowId,
  runId,
  apiKey,
  pollIntervalMs = 1000,
  maxPollAttempts = 120,
}: {
  workflowId: string
  runId: string
  apiKey: string
  pollIntervalMs?: number
  maxPollAttempts?: number
}): Promise<ComfyIcuApiResponseWorkflowStatus> {
  for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
    const statusResponse = await fetch(
      `https://comfy.icu/api/v1/workflows/${encodeURIComponent(workflowId)}/runs/${encodeURIComponent(runId)}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!statusResponse.ok) {
      throw new Error(
        `Comfy.icu status poll failed with status ${statusResponse.status}`
      )
    }

    const statusData =
      (await statusResponse.json()) as ComfyIcuApiResponseWorkflowStatus
    const normalizedStatus = (statusData.status || '').toUpperCase()

    if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'SUCCESS') {
      return statusData
    }

    if (
      normalizedStatus === 'ERROR' ||
      normalizedStatus === 'FAILED' ||
      normalizedStatus === 'CANCELLED'
    ) {
      throw new Error(
        statusData.message ||
          statusData.error ||
          `Comfy.icu workflow run ${runId} failed with status ${statusData.status}`
      )
    }

    if (attempt < maxPollAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    }
  }

  throw new Error(`Timed out waiting for Comfy.icu run ${runId}`)
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyIcuApiKey) {
    throw new Error(`Missing API key for "Comfy.icu"`)
  }

  const clapWorkflow = resolveClapWorkflowForSegment(request)
  const workflowId = clapWorkflow.id.split('://').pop() || ''

  if (!workflowId) {
    throw new Error(`The ComfyICU workflow ID is missing`)
  }

  const { workflowJson } = buildPopulatedComfyUiWorkflow(clapWorkflow, request)

  const payload: ComfyIcuApiRequestRunWorkflow = {
    workflow_id: workflowId,
    prompt: workflowJson,
    files: {},
    ...(request.settings.comfyIcuAccelerator
      ? { accelerator: request.settings.comfyIcuAccelerator }
      : {}),
  }

  const rawResponse = await fetch(
    `https://comfy.icu/api/v1/workflows/${encodeURIComponent(workflowId)}/runs`,
    {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${request.settings.comfyIcuApiKey}`,
      },
      body: JSON.stringify(payload),
      method: 'POST',
    }
  )

  if (!rawResponse.ok) {
    throw new Error(
      `Comfy.icu run submission failed with HTTP ${rawResponse.status}`
    )
  }

  const response =
    (await rawResponse.json()) as ComfyIcuApiResponseWorkflowStatus

  const initialStatus = (response.status || '').toUpperCase()
  if (initialStatus === 'ERROR' || initialStatus === 'FAILED') {
    throw new Error(
      response.message || response.error || 'Comfy.icu workflow execution error'
    )
  }

  let completedRun = response
  if (initialStatus !== 'COMPLETED' && initialStatus !== 'SUCCESS') {
    if (!response.id) {
      throw new Error('Comfy.icu response did not include a run ID')
    }
    completedRun = await pollComfyIcuRun({
      workflowId,
      runId: response.id,
      apiKey: request.settings.comfyIcuApiKey,
    })
  }

  const outputs = completedRun.output || completedRun.outputs || []
  const outputUrl = outputs[0]?.url

  if (!outputUrl) {
    throw new Error('Comfy.icu workflow completed without an output asset URL')
  }

  const segment: TimelineSegment = {
    ...request.segment,
    assetUrl: outputUrl,
    assetSourceType: getClapAssetSourceType(outputUrl),
    status: ClapSegmentStatus.COMPLETED,
  }

  return segment
}
