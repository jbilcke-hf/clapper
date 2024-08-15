import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { ClapSegmentCategory } from '@aitube/clap'

import { getWorkflowInputValues } from '../getWorkflowInputValues'
import { createImage } from './midjourney/createImage'
import { createAndFetchDreamMachineVideo } from './lumalabs/createAndFetchDreamMachineVideo'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.piApiApiKey) {
    throw new Error(`Missing API key for "PiApi"`)
  }

  const segment: TimelineSegment = request.segment

  let model = request.settings.imageGenerationWorkflow.data || ''

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
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

    const width =
      request.meta.width || workflowValues.width || workflowDefaultValues.width

    const height =
      request.meta.width ||
      workflowValues.height ||
      workflowDefaultValues.height

    const aspectRatio =
      width > height ? '16:9' : height > width ? '9:16' : '1:1'

    const result = await createImage(request.settings.piApiApiKey, {
      prompt: request.prompts.image.positive,
      aspect_ratio: aspectRatio,
      // skip_prompt_check?: boolean;
      process_mode: 'relax', // | 'fast' | 'turbo';
      // webhook_endpoint?: string;
      // webhook_secret?: string;
      // bot_id?: number;
    })

    if (!result.task_result.image_url) {
      throw new Error(`Failed to generate at least one image`)
    }

    segment.assetUrl = `${result.task_result.image_url || ''}`
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    model = request.settings.videoGenerationWorkflow.data || ''

    if (!request.prompts.video.image) {
      console.error(
        `resolveSegment: cannot generate video without a storyboard`
      )
      return segment
    }

    const { workflowDefaultValues, workflowValues } = getWorkflowInputValues(
      request.settings.videoGenerationWorkflow
    )

    const result = await createAndFetchDreamMachineVideo(
      request.settings.piApiApiKey,
      {
        prompt: request.prompts.image.positive,
        expand_prompt: false,
        image_url: request.prompts.video.image,

        // nice feature! we should use it :)
        // image_end_url?: string;
      }
    )

    result.data.generation.video

    if (!result.data.generation.video) {
      throw new Error(`Failed to generate at least one video`)
    }

    segment.assetUrl = `${result.data.generation.video || ''}`
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Fal.ai". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
