import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { ClapSegmentCategory, generateSeed } from '@aitube/clap'

import { getWorkflowInputValues } from '../getWorkflowInputValues'
import { callCreateImage } from './callCreateImage'
import {
  builtinProviderCredentialsLetzai,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.letzAiApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "LetzAi"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsLetzai
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsLetzai
    }
  }

  const segment: TimelineSegment = request.segment

  let model = request.settings.imageGenerationWorkflow.data || ''

  if (request.segment.category === ClapSegmentCategory.IMAGE) {
    model = request.settings.imageGenerationWorkflow.data || ''

    if (!request.prompts.image.positive) {
      console.error(
        `resolveSegment: cannot resolve a storyboard with an empty prompt`
      )
      return segment
    }

    const { workflowDefaultValues, workflowValues } = getWorkflowInputValues(
      request.settings.imageGenerationWorkflow
    )

    const result = await callCreateImage(apiKey, {
      prompt: request.prompts.image.positive,
      negativePrompt: request.prompts.image.negative,
      // model: string;
      width:
        request.meta.width ||
        workflowValues.width ||
        workflowDefaultValues.width,
      height:
        request.meta.width ||
        workflowValues.height ||
        workflowDefaultValues.height,
      // steps: number;
      // guidance: number;
      seed: generateSeed(),
      // scheduler: string;
      // outputFormat: string;
    })

    if (request.settings.censorNotForAllAudiencesContent) {
      if (result.nsfw) {
        throw new Error(
          `The generated content has been filtered according to your safety settings`
        )
      }
    }

    if (!result.output) {
      throw new Error(`Failed to generate at least one video`)
    }

    segment.assetUrl = `${result.output || ''}`
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Fal.ai". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
