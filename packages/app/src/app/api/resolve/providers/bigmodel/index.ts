import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { ClapSegmentCategory } from '@aitube/clap'

import { callCogVideoX } from './callCogVideoX'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.bigModelApiKey) {
    throw new Error(`Missing API key for "BigModel.cn"`)
  }

  const segment: TimelineSegment = request.segment

  let model = request.settings.imageGenerationWorkflow.data || ''

  if (request.segment.category === ClapSegmentCategory.VIDEO) {
    model = request.settings.videoGenerationWorkflow.data || ''

    /*
    note 
    if (!request.prompts.image.positive) {
      console.error(
        `resolveSegment: cannot resolve a storyboard with an empty prompt`
      )
      return segment
    }
    */

    if (!request.prompts.video.image) {
      throw new Error(
        `cannot generate a video without a storyboard (the concept of Clapper is to use storyboards)`
      )
    }

    // https://bigmodel.cn/dev/api#cogvideox
    const result = await callCogVideoX(request.settings.bigModelApiKey, {
      // FIXME: typings
      model: request.settings.videoGenerationWorkflow as any,
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
