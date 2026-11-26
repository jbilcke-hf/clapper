import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { decodeOutput } from '@/lib/utils/decodeOutput'
import {
  ComfyIcuApiRequestRunWorkflow,
  ComfyIcuApiResponseWorkflowStatus,
} from './types'

export async function pollComfyIcuRun(
  runId: string,
  apiKey: string,
  options: {
    maxTimeoutMs?: number
    pollIntervalMs?: number
  } = {}
): Promise<ComfyIcuApiResponseWorkflowStatus> {
  const maxTimeoutMs = options.maxTimeoutMs ?? 300_000 // 5 minutes default
  const pollIntervalMs = options.pollIntervalMs ?? 2_000
  const startTime = Date.now()

  while (Date.now() - startTime < maxTimeoutMs) {
    const resp = await fetch(`https://comfy.icu/api/v1/runs/${runId}`, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
    })

    if (!resp.ok) {
      throw new Error(
        `Comfy.icu poll failed with status ${resp.status}: ${await resp.text()}`
      )
    }

    const data = (await resp.json()) as ComfyIcuApiResponseWorkflowStatus

    if (data.status === 'COMPLETED') {
      return data
    }

    if (
      data.status === 'FAILED' ||
      data.status === 'CANCELLED' ||
      data.status === 'error'
    ) {
      throw new Error(
        `Comfy.icu run ${runId} terminated with status "${data.status}"`
      )
    }

    await new Promise((r) => setTimeout(r, pollIntervalMs))
  }

  throw new Error(`Comfy.icu run ${runId} timed out after ${maxTimeoutMs}ms`)
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyIcuApiKey) {
    throw new Error(`Missing API key for "Comfy.icu"`)
  }

  const segment: TimelineSegment = { ...request.segment }

  const clapWorkflow = {
    [ClapSegmentCategory.IMAGE]: request.settings.imageGenerationWorkflow,
    [ClapSegmentCategory.VIDEO]: request.settings.videoGenerationWorkflow,
    [ClapSegmentCategory.SOUND]: request.settings.soundGenerationWorkflow,
    [ClapSegmentCategory.VOICE]: request.settings.voiceGenerationWorkflow,
    [ClapSegmentCategory.MUSIC]: request.settings.musicGenerationWorkflow,
    [ClapSegmentCategory.DIALOGUE]: request.settings.voiceGenerationWorkflow,
  }[request.segment.category]

  if (!clapWorkflow || !clapWorkflow.id) {
    throw new Error(
      `The Comfy.icu workflow ID is missing for category "${request.segment.category}"`
    )
  }

  const workflowId = clapWorkflow.id.split('://').pop() || ''
  if (!workflowId) {
    throw new Error(`The Comfy.icu workflow ID could not be parsed`)
  }

  const payload: ComfyIcuApiRequestRunWorkflow = {
    workflow_id: workflowId,
    prompt: clapWorkflow.data,
    files: {},
  }

  const rawResponse = await fetch(
    `https://comfy.icu/api/v1/workflows/${workflowId}/runs`,
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
      `Comfy.icu run submission failed (${rawResponse.status}): ${await rawResponse.text()}`
    )
  }

  const response = await rawResponse.json()
  if (response.status === 'error') {
    throw new Error(response.message || 'Comfy.icu workflow run failed')
  }

  const runId = response.id || response.run_id
  if (!runId) {
    throw new Error(`Comfy.icu did not return a valid run ID`)
  }

  const completedRun = await pollComfyIcuRun(
    runId,
    request.settings.comfyIcuApiKey
  )

  const outputFiles = completedRun.output || []
  const firstOutput = outputFiles[0]
  if (!firstOutput || !firstOutput.url) {
    throw new Error(`Comfy.icu run completed but produced no output files`)
  }

  const assetUrl = await decodeOutput(firstOutput.url)
  segment.assetUrl = assetUrl
  segment.assetSourceType = getClapAssetSourceType(assetUrl)
  segment.status = ClapSegmentStatus.COMPLETED

  return segment
}
