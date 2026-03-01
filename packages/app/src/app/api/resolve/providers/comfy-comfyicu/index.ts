import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'
import {
  ComfyIcuApiRequestRunWorkflow,
  ComfyIcuApiResponseWorkflowStatus,
} from './types'

const COMFY_ICU_API_BASE = 'https://comfy.icu/api/v1'
const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 200 // ~10 minutes max

/**
 * Get the workflow setting and prompt for a given segment category
 */
function getWorkflowAndPrompt(request: ResolveRequest): {
  workflow: typeof request.settings.imageGenerationWorkflow
  prompt: string
} {
  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      return {
        workflow: request.settings.imageGenerationWorkflow,
        prompt: request.prompts.image.positive,
      }
    case ClapSegmentCategory.VIDEO:
      return {
        workflow: request.settings.videoGenerationWorkflow,
        prompt: request.prompts.image.positive,
      }
    case ClapSegmentCategory.VOICE:
      return {
        workflow: request.settings.voiceGenerationWorkflow,
        prompt: request.prompts.voice.positive,
      }
    case ClapSegmentCategory.SOUND:
      return {
        workflow: request.settings.soundGenerationWorkflow,
        prompt: request.prompts.audio.positive,
      }
    case ClapSegmentCategory.MUSIC:
      return {
        workflow: request.settings.musicGenerationWorkflow,
        prompt: request.prompts.music.positive,
      }
    default:
      throw new Error(
        `Unsupported segment category "${request.segment.category}" for Comfy.icu provider`
      )
  }
}

/**
 * Poll the Comfy.icu API for workflow run status until completion
 */
async function pollForResult(
  workflowId: string,
  runId: string,
  apiKey: string
): Promise<ComfyIcuApiResponseWorkflowStatus> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const response = await fetch(
      `${COMFY_ICU_API_BASE}/workflows/${workflowId}/runs/${runId}`,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        method: 'GET',
      }
    )

    const status =
      (await response.json()) as ComfyIcuApiResponseWorkflowStatus

    if (status.status === 'error') {
      throw new Error(`Comfy.icu workflow failed: ${JSON.stringify(status)}`)
    }

    if (status.status === 'completed' || status.status === 'success') {
      return status
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }

  throw new Error(
    `Comfy.icu workflow timed out after ${(POLL_INTERVAL_MS * MAX_POLL_ATTEMPTS) / 1000} seconds`
  )
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyIcuApiKey) {
    throw new Error(`Missing API key for "Comfy.icu"`)
  }

  const segment: TimelineSegment = { ...request.segment }

  const { workflow, prompt } = getWorkflowAndPrompt(request)
  const workflowId = workflow.id.split('://').pop() || ''

  if (!workflowId) {
    throw new Error(
      `The ComfyICU workflow ID is missing. Please configure a workflow in settings.`
    )
  }

  const inputFields = workflow.inputFields || []

  // Try to find a prompt field in the workflow
  const promptFields = [
    inputFields.find((f) => f.id === 'prompt'),
    inputFields.find((f) => f.id.includes('prompt')),
    inputFields.find((f) => f.type === 'string'),
  ].filter((x) => typeof x !== 'undefined')

  const promptField = promptFields[0]

  // Inject prompt into the workflow data
  let workflowData = workflow.data
  if (promptField && prompt) {
    try {
      const parsedData = JSON.parse(workflowData)
      // Walk through nodes to find and replace the prompt value
      for (const nodeId of Object.keys(parsedData)) {
        const node = parsedData[nodeId]
        if (node?.inputs && promptField.id in node.inputs) {
          node.inputs[promptField.id] = prompt
        }
      }
      workflowData = JSON.stringify(parsedData)
    } catch (e) {
      console.warn('Failed to inject prompt into workflow data:', e)
    }
  }

  const payload: ComfyIcuApiRequestRunWorkflow = {
    workflow_id: workflowId,
    prompt: workflowData,
    files: {},
  }

  // Submit the workflow run
  const rawResponse = await fetch(
    `${COMFY_ICU_API_BASE}/workflows/${workflowId}/runs`,
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

  const response = await rawResponse.json()

  if (response.status === 'error') {
    throw new Error(`Comfy.icu submission failed: ${response.message}`)
  }

  const runId = response.id
  if (!runId) {
    throw new Error(`Comfy.icu did not return a run ID`)
  }

  console.log(`Comfy.icu run submitted: ${runId}, polling for result...`)

  // Poll for completion
  const result = await pollForResult(
    workflowId,
    runId,
    request.settings.comfyIcuApiKey
  )

  // Extract the output URL
  if (!result.output || result.output.length === 0) {
    throw new Error(`Comfy.icu workflow completed but produced no output`)
  }

  const outputUrl = result.output[0].url
  if (!outputUrl) {
    throw new Error(`Comfy.icu workflow output has no URL`)
  }

  segment.assetUrl = outputUrl
  segment.assetSourceType = getClapAssetSourceType(outputUrl)
  segment.status = ClapSegmentStatus.COMPLETED

  return segment
}
