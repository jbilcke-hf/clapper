import LumaAI from 'lumaai'

import { ClapImageRatio, ClapSegmentCategory } from '@aitube/clap'
import { ResolveRequest } from '@aitube/clapper-services'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'

import {
  builtinProviderCredentialsLumalabs,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.lumaLabsApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "LumaLabs"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsLumalabs
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsLumalabs
    }
  }

  const luma = new LumaAI({
    authToken: apiKey,
  })

  const segment = request.segment

  if (request.segment.category === ClapSegmentCategory.VIDEO) {
    const { workflowValues } = getWorkflowInputValues(
      request.settings.videoGenerationWorkflow
    )

    // Luma accepts:
    //  "1:1" | "9:16" | "16:9" | "4:3" | "3:4" | "21:9" | "9:21" | undefined
    const aspectRatio =
      request.meta.orientation === ClapImageRatio.SQUARE
        ? '1:1'
        : request.meta.orientation === ClapImageRatio.PORTRAIT
          ? '9:16'
          : '16:9'

    let params: LumaAI.GenerationCreateParams = {
      // apply the default values from the workflow
      ...workflowValues,

      aspect_ratio: aspectRatio,
      prompt: request.prompts.image.positive || '',
    }

    // Luma crashes (and spends our money :/) if keyframes is an empty array
    delete params.keyframes

    /*
    DISABLED because Luma doesn't support base64 it seems :/ 

    if (request.prompts.video.image) {
      // If an image prompt is provided, add it to the parameters
      params.keyframes = {
        frame0: {
          type: 'image',
          url: request.prompts.video.image,
        },
      }
    }
    */

    // if we have neither a text prompt or a frame,
    // then there is no point in calling Luma Labs
    if (!request.prompts.image.positive && !request.prompts.video.image) {
      throw new Error('Cannot generate a video without a text or image')
    }

    try {
      // Create the generation
      // console.log('params:', params)
      const generation = await luma.generations.create(params)

      // Poll for completion
      let completedGeneration: LumaAI.Generation | null = null
      while (!completedGeneration) {
        if (!generation.id) {
          throw new Error(`Generation failed: missing generation id`)
        }
        const status = await luma.generations.get(generation.id)
        if (status.state === 'completed') {
          completedGeneration = status
          break
        } else if (status.state === 'failed') {
          throw new Error(`Generation failed: ${status.failure_reason}`)
        }
        // Wait for 5 seconds before polling again
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }

      // Store the URL of the final video
      if (completedGeneration.assets?.video) {
        segment.assetUrl = completedGeneration.assets.video
      } else {
        throw new Error('Generated video URL not found in the response')
      }
    } catch (error) {
      console.error('Error generating video with LumaAI:', error)
      throw error
    }
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "LumaLabs". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
