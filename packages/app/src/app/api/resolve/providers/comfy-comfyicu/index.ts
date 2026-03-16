import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import {
  ComfyIcuApiRequestRunWorkflow,
  ComfyIcuApiResponseWorkflowStatus,
} from './types'

const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 200

function getWorkflowForCategory(request: ResolveRequest) {
  switch (request.segment.category) {
    case ClapSegmentCategory.IMAGE:
      return request.settings.imageGenerationWorkflow
    case ClapSegmentCategory.VIDEO:
      return request.settings.videoGenerationWorkflow
    case ClapSegmentCategory.DIALOGUE:
      return request.settings.voiceGenerationWorkflow
    case ClapSegmentCategory.SOUND:
      return request.settings.soundGenerationWorkflow
    case ClapSegmentCategory.MUSIC:
      return request.settings.musicGenerationWorkflow
    default:
      throw new Error(
        `Clapper doesn't support ${request.segment.category} generation for provider "Comfy.icu"`
      )
  }
}

async function pollForCompletion(
  runId: string,
  workflowId: string,
  apiKey: string
): Promise<ComfyIcuApiResponseWorkflowStatus> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))

    const response = await fetch(
      `https://comfy.icu/api/v1/workflows/${workflowId}/runs/${runId}`,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      let errorBody = ''
      try {
        errorBody = await response.text()
      } catch {
        // ignore errors while reading the error body
      }
      throw new Error(
        `ComfyICU status poll failed with HTTP ${response.status} ${response.statusText}: ${errorBody}`
      )
    }

    const status: ComfyIcuApiResponseWorkflowStatus = await response.json()

    if (status.status === 'completed' || status.status === 'success') {
      return status
    }

    if (status.status === 'error' || status.status === 'failed') {
      throw new Error(`ComfyICU workflow run failed: ${status.status}`)
    }
  }

  throw new Error(
    `ComfyICU workflow timed out after ${MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS / 1000}s`
  )
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyIcuApiKey) {
    throw new Error(`Missing API key for "Comfy.icu"`)
  }

  const workflow = getWorkflowForCategory(request)
  const workflowId = workflow.id.split('://').pop() || ''

  if (!workflowId) {
    throw new Error(`The ComfyICU workflow ID is missing`)
  }

  const inputFields = workflow.inputFields || []

  // Find prompt field with fallback matching
  const promptFields = [
    inputFields.find((f) => f.id === 'prompt'),
    inputFields.find((f) => f.id.includes('prompt')),
    inputFields.find((f) => f.type === 'string'),
  ].filter((x) => typeof x !== 'undefined')

  const promptField = promptFields[0]

  // Inject prompt into the workflow data
  let workflowData = workflow.data
  if (promptField) {
    // Choose the appropriate positive prompt based on the segment category,
    // falling back to the image prompt if more specific prompts are unavailable.
    let positivePrompt = request.prompts.image.positive
    switch (request.segment.category) {
      case ClapSegmentCategory.DIALOGUE:
        if (request.prompts.voice && request.prompts.voice.positive) {
          positivePrompt = request.prompts.voice.positive
        }
        break
      case ClapSegmentCategory.SOUND:
        if (request.prompts.audio && request.prompts.audio.positive) {
          positivePrompt = request.prompts.audio.positive
        }
        break
      case ClapSegmentCategory.MUSIC:
        if (request.prompts.music && request.prompts.music.positive) {
          positivePrompt = request.prompts.music.positive
        }
        break
      default:
        // Keep the image prompt as the default for other categories.
        break
    }
    try {
      const parsedData = JSON.parse(workflowData)
      // Walk through nodes and inject prompt value
      for (const nodeId in parsedData) {
        const node = parsedData[nodeId]
        if (node.inputs && promptField.id in node.inputs) {
          node.inputs[promptField.id] = positivePrompt
        }
      }
      workflowData = JSON.stringify(parsedData)
    } catch {
      // If parsing fails, use original data
    }
  }

  const payload: ComfyIcuApiRequestRunWorkflow = {
    workflow_id: workflowId,
    prompt: workflowData,
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

  const submitResponse = await rawResponse.json()

  if (submitResponse.status === 'error') {
    throw new Error(submitResponse.message)
  }

  const runId = submitResponse.id
  if (!runId) {
    throw new Error('ComfyICU did not return a run ID')
  }

  // Poll until completion
  const completedRun = await pollForCompletion(
    runId,
    workflowId,
    request.settings.comfyIcuApiKey
  )

  const segment: TimelineSegment = { ...request.segment }

  if (!completedRun.output || completedRun.output.length === 0) {
    throw new Error('ComfyICU workflow completed but produced no output')
  }

  // Use the first output file URL
  const outputUrl = completedRun.output[0].url
  segment.assetUrl = outputUrl
  segment.assetSourceType = getClapAssetSourceType(outputUrl)

  return segment
}
