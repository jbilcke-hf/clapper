import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'

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
        `Clapper doesn't support ${request.segment.category} generation for provider "ComfyDeploy"`
      )
  }
}

async function pollForCompletion(
  runId: string,
  apiKey: string
): Promise<any> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))

    const response = await fetch(
      `https://www.comfydeploy.com/api/run/${runId}`,
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(
        `ComfyDeploy API request failed with status ${response.status} ${response.statusText}: ${errorText}`
      )
    }

    const status = await response.json()

    if (status.status === 'success' || status.status === 'completed') {
      return status
    }

    if (status.status === 'error' || status.status === 'failed') {
      throw new Error(
        `ComfyDeploy workflow run failed: ${status.error || status.status}`
      )
    }
  }

  throw new Error(
    `ComfyDeploy workflow timed out after ${MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS / 1000}s`
  )
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyDeployApiKey) {
    throw new Error(`Missing API key for "ComfyDeploy"`)
  }

  const workflow = getWorkflowForCategory(request)
  const inputFields = workflow.inputFields || []

  // Find prompt field with fallback matching
  const promptFields = [
    inputFields.find((f) => f.id === 'prompt'),
    inputFields.find((f) => f.id.includes('prompt')),
    inputFields.find((f) => f.type === 'string'),
  ].filter((x) => typeof x !== 'undefined')

  const promptField = promptFields[0]

  // Find negative prompt field with fallback matching (if supported)
  const negativePromptFields = [
    inputFields.find((f) => f.id === 'negative_prompt'),
    inputFields.find((f) => f.id.includes('negative')),
  ].filter((x) => typeof x !== 'undefined')

  const negativePromptField = negativePromptFields[0]

  // Select prompts based on segment category
  let positivePrompt: string | undefined
  let negativePrompt: string | undefined

  switch (request.segment.category) {
    case ClapSegmentCategory.DIALOGUE:
      positivePrompt = request.prompts.voice?.positive
      negativePrompt = request.prompts.voice?.negative
      break
    case ClapSegmentCategory.SOUND:
      positivePrompt = request.prompts.audio?.positive
      negativePrompt = request.prompts.audio?.negative
      break
    case ClapSegmentCategory.MUSIC:
      positivePrompt = request.prompts.music?.positive
      negativePrompt = request.prompts.music?.negative
      break
    default:
      // Fallback to image prompts for visual categories or unknown types
      positivePrompt = request.prompts.image?.positive
      negativePrompt = request.prompts.image?.negative
      break
  }

  // Build input overrides for the workflow
  const { workflowDefaultValues = {}, workflowValues = {} } =
    getWorkflowInputValues(workflow)
  const inputs: Record<string, any> = {
    ...workflowDefaultValues,
    ...workflowValues,
  }

  if (promptField && typeof positivePrompt === 'string') {
    inputs[promptField.id] = positivePrompt
  }

  if (negativePromptField && typeof negativePrompt === 'string') {
    inputs[negativePromptField.id] = negativePrompt
  }

  // Submit workflow run
  const rawResponse = await fetch(
    'https://www.comfydeploy.com/api/run',
    {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${request.settings.comfyDeployApiKey}`,
      },
      body: JSON.stringify({
        deployment_id: workflow.id,
        inputs,
      }),
      method: 'POST',
    }
  )

  const submitResponse = await rawResponse.json()

  if (submitResponse.error) {
    throw new Error(submitResponse.error)
  }

  const runId = submitResponse.run_id
  if (!runId) {
    throw new Error('ComfyDeploy did not return a run ID')
  }

  // Poll until completion
  const completedRun = await pollForCompletion(
    runId,
    request.settings.comfyDeployApiKey
  )

  const segment: TimelineSegment = { ...request.segment }

  // Extract output URL from the completed run
  const outputs = completedRun.outputs || completedRun.output || []
  const outputFiles = Array.isArray(outputs)
    ? outputs
    : Object.values(outputs).flat()

  if (outputFiles.length === 0) {
    throw new Error('ComfyDeploy workflow completed but produced no output')
  }

  // Get first output - could be an object with url or a direct URL string
  const firstOutput = outputFiles[0]
  const outputUrl = typeof firstOutput === 'string'
    ? firstOutput
    : firstOutput?.url || firstOutput?.images?.[0]?.url

  if (!outputUrl) {
    throw new Error('ComfyDeploy workflow output has no URL')
  }

  segment.assetUrl = outputUrl
  segment.assetSourceType = getClapAssetSourceType(outputUrl)

  return segment
}
