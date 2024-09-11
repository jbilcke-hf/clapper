import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { ClapSegmentCategory } from '@aitube/clap'

import { callCogVideoX } from './callCogVideoX'
import {
  builtinProviderCredentialsBigmodel,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.bigModelApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "BigModel.cn"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsBigmodel
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsBigmodel
    }
  }

  const segment: TimelineSegment = request.segment

  let model = request.settings.imageGenerationWorkflow.data || ''

  if (request.segment.category === ClapSegmentCategory.VIDEO) {
    model = request.settings.videoGenerationWorkflow.data || ''

    /*
    note 
    if (!request.prompts.image.positive) {
      console.error(
        `resolveSegment: cannot resolve a storyboard image with an empty prompt`
      )
      return segment
    }
    */

    if (!request.prompts.video.image) {
      throw new Error(`cannot generate a video without a storyboard image`)
    }

    // https://bigmodel.cn/dev/api#cogvideox
    const result = await callCogVideoX(apiKey, {
      model: request.settings.videoGenerationWorkflow.data,
      image_url: request.prompts.video.image,
    })

    const video = result.video_result.at(0)
    if (!video) {
      throw new Error(`Failed to generate at least one video`)
    }

    segment.assetUrl = video.url
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Fal.ai". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
