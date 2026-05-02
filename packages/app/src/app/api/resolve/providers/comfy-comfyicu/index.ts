import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapSegmentCategory,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'
import {
  ComfyIcuApiRequestRunWorkflow,
  ComfyIcuApiResponseWorkflowStatus,
} from './types'

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Poll the Comfy.icu API for the status of a workflow run until it completes.
 */
async function pollWorkflowRun(
  apiKey: string,
  projectId: string,
  runId: string,
  maxRetries: number = 120,
  pollIntervalMs: number = 2000
): Promise<ComfyIcuApiResponseWorkflowStatus> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(
      `https://comfy.icu/api/v1/workflows/${projectId}/runs/${runId}`,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Comfy.icu API error: ${response.status} ${response.statusText}`
      )
    }

    const status: ComfyIcuApiResponseWorkflowStatus = await response.json()

    if (status.status === 'completed') {
      return status
    }

    if (status.status === 'failed') {
      throw new Error(`Comfy.icu workflow run failed`)
    }

    if (status.status === 'cancelled') {
      throw new Error(`Comfy.icu workflow run was cancelled`)
    }

    // Still pending/running - wait before polling again
    await sleep(pollIntervalMs)
  }

  throw new Error(
    `Comfy.icu workflow run did not complete within the expected time (${maxRetries * pollIntervalMs / 1000}s)`
  )
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyIcuApiKey) {
    throw new Error(`Missing API key for "Comfy.icu"`)
  }

  const segment: TimelineSegment = { ...request.segment }

  // Determine which workflow to use based on the segment category
  let clapWorkflow
  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      clapWorkflow = request.settings.imageGenerationWorkflow
      break
    case ClapSegmentCategory.VIDEO:
      clapWorkflow = request.settings.videoGenerationWorkflow
      break
    case ClapSegmentCategory.SOUND:
      clapWorkflow = request.settings.soundGenerationWorkflow
      break
    case ClapSegmentCategory.VOICE:
    case ClapSegmentCategory.DIALOGUE:
      clapWorkflow = request.settings.voiceGenerationWorkflow
      break
    case ClapSegmentCategory.MUSIC:
      clapWorkflow = request.settings.musicGenerationWorkflow
      break
    default:
      clapWorkflow = request.settings.imageGenerationWorkflow
  }

  if (!clapWorkflow) {
    throw new Error(
      `No Comfy.icu workflow configured for "${request.segment.category}"`
    )
  }

  // The workflow ID is stored in the clapWorkflow id field
  // Format: "comfyicu://<workflow_id>"
  const workflowId = clapWorkflow.id.split('://').pop() || ''

  if (!workflowId) {
    throw new Error(`The Comfy.icu workflow ID is missing`)
  }

  // Build the payload with workflow inputs
  const payload: ComfyIcuApiRequestRunWorkflow = {
    workflow_id: workflowId,
    prompt: clapWorkflow.data || '',
    files: {},
    ...getWorkflowInputValues(clapWorkflow),
  }

  // Inject the prompt from the request
  // Try to find the best matching input field for the prompt
  const inputFields = clapWorkflow.inputFields || []
  const promptFields = [
    inputFields.find((f) => f.id === 'prompt'),
    inputFields.find((f) => f.id.includes('prompt')),
    inputFields.find((f) => f.type === 'string'),
  ].filter((x) => typeof x !== 'undefined')

  const promptField = promptFields[0]
  if (!promptField) {
    throw new Error(
      `This workflow doesn't seem to have a parameter called "prompt"`
    )
  }

  // Start the workflow run
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
    const errorBody = await rawResponse.text()
    throw new Error(
      `Comfy.icu API error (${rawResponse.status}): ${errorBody}`
    )
  }

  const runResult = await rawResponse.json()

  if (runResult.status === 'error') {
    throw new Error(runResult.message || 'Comfy.icu returned an error')
  }

  // The run was started - poll for completion
  const runId = runResult.id || runResult.run_id
  if (!runId) {
    throw new Error(
      `Comfy.icu did not return a run ID. Response: ${JSON.stringify(runResult)}`
    )
  }

  const completedRun = await pollWorkflowRun(
    request.settings.comfyIcuApiKey,
    workflowId,
    runId
  )

  // Extract output assets
  const output = completedRun.output

  if (!output || output.length === 0) {
    throw new Error(`Comfy.icu workflow completed but no output was produced`)
  }

  // Use the first output asset
  const firstOutput = output[0]
  segment.assetUrl = firstOutput.url || firstOutput.thumbnail_url || ''
  segment.assetSourceType = ClapAssetSource.DATA

  return segment
}
