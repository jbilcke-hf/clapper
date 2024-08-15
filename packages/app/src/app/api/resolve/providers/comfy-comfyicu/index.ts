import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'
import { ComfyIcuApiRequestRunWorkflow } from './types'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyIcuApiKey) {
    throw new Error(`Missing API key for "Comfy.icu"`)
  }

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
    const workflowId =
      request.settings.imageGenerationWorkflow.id.split('://').pop() || ''

    if (!workflowId) {
      throw new Error(`The ComfyICU workflow ID is missing`)
    }

    const inputFields =
      request.settings.imageGenerationWorkflow.inputFields || []

    // since this is a random "wild" workflow, it is possible
    // that the field name is a bit different
    // we try to look into the workflow input fields
    // to find the best match
    const promptFields = [
      inputFields.find((f) => f.id === 'prompt'), // exactMatch,
      inputFields.find((f) => f.id.includes('prompt')), // similarName,
      inputFields.find((f) => f.type === 'string'), // similarType
    ].filter((x) => typeof x !== 'undefined')

    const promptField = promptFields[0]
    if (!promptField) {
      throw new Error(
        `this workflow doesn't seem to have a parameter called "prompt"`
      )
    }

    // TODO: modify the serialized workflow payload
    // to inject our params:
    // ...getWorkflowInputValues(request.settings.imageGenerationWorkflow),
    // [promptField.id]: request.prompts.image.positive,

    const payload: ComfyIcuApiRequestRunWorkflow = {
      workflow_id: workflowId,
      prompt: request.settings.imageGenerationWorkflow.data,
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

    const response = await rawResponse.json()

    if (response.status === 'error') {
      throw new Error(response.message)
    }

    console.log('response:', response)

    // TODO use the RUN ID to regularly check for status
    // see https://comfy.icu/docs/api

    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Comfy.icu". Please open a pull request with (working code) to solve this!`
    )
  }

  const segment: TimelineSegment = { ...request.segment }

  return segment
}
