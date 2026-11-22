import { ResolveRequest } from '@aitube/clapper-services'
import { ClapSegmentStatus, getClapAssetSourceType } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'

import { buildPopulatedComfyUiWorkflow } from '../comfyui/createPromptBuilder'
import { resolveClapWorkflowForSegment } from '../comfyui'

export type ComfyDeployRunOutputItem = {
  url?: string
  filename?: string
  data?: {
    images?: { url?: string; filename?: string }[]
    videos?: { url?: string; filename?: string }[]
    gifs?: { url?: string; filename?: string }[]
    audio?: { url?: string; filename?: string }[]
    files?: { url?: string; filename?: string }[]
  }
}

export type ComfyDeployRunStatusResponse = {
  run_id?: string
  id?: string
  status?: string
  outputs?: ComfyDeployRunOutputItem[]
  output?: { url?: string }[]
  error?: string
  message?: string
}

function extractComfyDeployOutputUrl(
  statusData: ComfyDeployRunStatusResponse
): string | undefined {
  if (Array.isArray(statusData.output) && statusData.output[0]?.url) {
    return statusData.output[0].url
  }

  if (Array.isArray(statusData.outputs)) {
    for (const item of statusData.outputs) {
      if (item?.url) return item.url
      const data = item?.data
      if (data) {
        const candidates = [
          ...(data.videos || []),
          ...(data.gifs || []),
          ...(data.audio || []),
          ...(data.images || []),
          ...(data.files || []),
        ]
        const found = candidates.find(
          (c) => typeof c?.url === 'string' && c.url
        )
        if (found?.url) return found.url
      }
    }
  }

  return undefined
}

export async function pollComfyDeployRun({
  runId,
  apiKey,
  pollIntervalMs = 1000,
  maxPollAttempts = 120,
}: {
  runId: string
  apiKey: string
  pollIntervalMs?: number
  maxPollAttempts?: number
}): Promise<ComfyDeployRunStatusResponse> {
  for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
    const res = await fetch(
      `https://api.comfydeploy.com/api/run?run_id=${encodeURIComponent(runId)}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!res.ok) {
      throw new Error(`ComfyDeploy status poll failed with HTTP ${res.status}`)
    }

    const statusData = (await res.json()) as ComfyDeployRunStatusResponse
    const status = (statusData.status || '').toLowerCase()

    if (status === 'success' || status === 'completed') {
      return statusData
    }

    if (
      status === 'failed' ||
      status === 'error' ||
      status === 'cancelled' ||
      status === 'canceled'
    ) {
      throw new Error(
        statusData.message ||
          statusData.error ||
          `ComfyDeploy run ${runId} failed with status ${statusData.status}`
      )
    }

    if (attempt < maxPollAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    }
  }

  throw new Error(`Timed out waiting for ComfyDeploy run ${runId}`)
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyDeployApiKey) {
    throw new Error(`Missing API key for "ComfyDeploy"`)
  }

  const clapWorkflow = resolveClapWorkflowForSegment(request)
  const deploymentId = clapWorkflow.id.split('://').pop() || ''

  const { workflowJson } = buildPopulatedComfyUiWorkflow(clapWorkflow, request)

  const submitRes = await fetch(`https://api.comfydeploy.com/api/run`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${request.settings.comfyDeployApiKey}`,
    },
    body: JSON.stringify({
      deployment_id: deploymentId,
      workflow_api: workflowJson,
      inputs: {
        prompt:
          request.prompts?.image?.positive ||
          request.prompts?.voice?.positive ||
          request.prompts?.audio?.positive ||
          request.prompts?.music?.positive ||
          request.segment.prompt ||
          '',
        negative_prompt: request.prompts?.image?.negative || '',
        width: request.meta?.width || 1024,
        height: request.meta?.height || 576,
      },
    }),
  })

  if (!submitRes.ok) {
    throw new Error(
      `ComfyDeploy run submission failed with HTTP ${submitRes.status}`
    )
  }

  const initialData = (await submitRes.json()) as ComfyDeployRunStatusResponse
  const initialStatus = (initialData.status || '').toLowerCase()

  if (initialStatus === 'failed' || initialStatus === 'error') {
    throw new Error(
      initialData.message ||
        initialData.error ||
        'ComfyDeploy workflow execution error'
    )
  }

  let completedData = initialData
  if (initialStatus !== 'success' && initialStatus !== 'completed') {
    const runId = initialData.run_id || initialData.id
    if (!runId) {
      throw new Error('ComfyDeploy response did not include a run_id')
    }
    completedData = await pollComfyDeployRun({
      runId,
      apiKey: request.settings.comfyDeployApiKey,
    })
  }

  const outputUrl = extractComfyDeployOutputUrl(completedData)
  if (!outputUrl) {
    throw new Error('ComfyDeploy run completed without an output asset URL')
  }

  const segment: TimelineSegment = {
    ...request.segment,
    assetUrl: outputUrl,
    assetSourceType: getClapAssetSourceType(outputUrl),
    status: ClapSegmentStatus.COMPLETED,
  }

  return segment
}
