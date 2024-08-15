import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.comfyDeployApiKey) {
    throw new Error(`Missing API key for "ComfyDeploy"`)
  }

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
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
  }

  throw new Error(
    `Clapper doesn't support ${request.segment.category} generation for provider "Comfy.icu". Please open a pull request with (working code) to solve this!`
  )

  const segment: TimelineSegment = { ...request.segment }

  return segment
}
