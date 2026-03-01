import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapAssetSource,
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'

const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 200 // ~10 minutes max

/**
 * Get the workflow and prompt for a given segment category
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
        `Unsupported segment category "${request.segment.category}" for ComfyDeploy provider`
      )
  }
}

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyDeployApiKey) {
    throw new Error(`Missing API key for "ComfyDeploy"`)
  }

  const segment: TimelineSegment = { ...request.segment }

  const { workflow, prompt } = getWorkflowAndPrompt(request)
  const inputFields = workflow.inputFields || []

  // Find the best prompt field
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

  // Build input values with the prompt injected
  const inputValues = {
    ...getWorkflowInputValues(workflow),
    [promptField.id]: prompt,
  }

  // Submit the workflow run via ComfyDeploy API
  const deploymentId = workflow.id.split('://').pop() || workflow.data

  const rawResponse = await fetch(
    'https://www.comfydeploy.com/api/run',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.settings.comfyDeployApiKey}`,
      },
      body: JSON.stringify({
        deployment_id: deploymentId,
        inputs: inputValues,
      }),
      method: 'POST',
    }
  )

  const response = await rawResponse.json()

  if (!response.run_id) {
    throw new Error(
      `ComfyDeploy failed to start run: ${JSON.stringify(response)}`
    )
  }

  const runId = response.run_id

  console.log(`ComfyDeploy run submitted: ${runId}, polling for result...`)

  // Poll for completion
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const statusResponse = await fetch(
      `https://www.comfydeploy.com/api/run/${runId}`,
      {
        headers: {
          Authorization: `Bearer ${request.settings.comfyDeployApiKey}`,
        },
        method: 'GET',
      }
    )

    const status = await statusResponse.json()

    if (status.status === 'failed' || status.status === 'error') {
      throw new Error(`ComfyDeploy workflow failed: ${JSON.stringify(status)}`)
    }

    if (status.status === 'success' || status.status === 'completed') {
      // Extract output
      const outputs = status.outputs || status.output || []
      const outputUrl =
        typeof outputs === 'string'
          ? outputs
          : Array.isArray(outputs) && outputs.length > 0
            ? outputs[0].url || outputs[0]
            : null

      if (!outputUrl) {
        throw new Error(`ComfyDeploy completed but produced no output URL`)
      }

      segment.assetUrl = outputUrl
      segment.assetSourceType = getClapAssetSourceType(outputUrl)
      segment.status = ClapSegmentStatus.COMPLETED
      return segment
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }

  throw new Error(
    `ComfyDeploy workflow timed out after ${(POLL_INTERVAL_MS * MAX_POLL_ATTEMPTS) / 1000} seconds`
  )
}
