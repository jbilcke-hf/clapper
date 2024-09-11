import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { ClapImageRatio, ClapSegmentCategory } from '@aitube/clap'

import { getWorkflowInputValues } from '../getWorkflowInputValues'
import { createImage } from './midjourney/createImage'
import { createAndFetchDreamMachineVideo } from './lumalabs/createAndFetchDreamMachineVideo'
import { createAndFetchKlingVideo } from './kling/createAndFetchKlingVideo'
import {
  builtinProviderCredentialsPiapi,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.piApiApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "PiApi"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsPiapi
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsPiapi
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

    const width =
      request.meta.width || workflowValues.width || workflowDefaultValues.width

    const height =
      request.meta.width ||
      workflowValues.height ||
      workflowDefaultValues.height

    const aspectRatio =
      width > height ? '16:9' : height > width ? '9:16' : '1:1'

    const result = await createImage(apiKey, {
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
    const workflow = request.settings.videoGenerationWorkflow

    model = workflow.data || ''

    if (!request.prompts.video.image) {
      console.error(
        `resolveSegment: cannot generate video without a storyboard image`
      )
      return segment
    }

    const { workflowDefaultValues, workflowValues } = getWorkflowInputValues(
      request.settings.videoGenerationWorkflow
    )

    if (workflow.id === 'piapi://kling/v1/video') {
      // can only be 16:9,9:16,1:1
      const aspectRatio =
        request.meta.orientation === ClapImageRatio.SQUARE
          ? '1:1'
          : request.meta.orientation === ClapImageRatio.PORTRAIT
            ? '9:16'
            : '16:9'

      const result = await createAndFetchKlingVideo(apiKey, {
        prompt: request.prompts.image.positive,
        negative_prompt: request.prompts.image.negative,

        // a number between 0 to 1, the lower the more creative
        // creativity?: number

        // can only be 5 or 10, defaults to 5
        duration: 5,

        aspect_ratio: aspectRatio,

        // PAID KLING PLAN NEEDED. Default to false, visit Kling AI official product to get the definition of professional mode
        // professional_mode?: boolean

        // initial frame of the video, DO NOT pass this param if you just want text-to-video
        image_url: request.prompts.video.image,

        // PAID KLING PLAN NEEDED. End frame of the video, DO NOT pass this param if you just want text-to-video
        // tail_image_url?: string

        // camera control of the video, effective in text-to-image ONLY. TRY it on Kling official website before using this param
        // camera?: {
        //   type?: string
        //   horizontal?: number
        //   vertical?: number
        //   zoom?: number
        //   tilt?: number
        //   pan?: number
        //   roll?: number
        // }
      })

      const work = result.data.works[0]

      if (!work) {
        throw new Error(`Failed to generate at least one video`)
      }

      if (!work.resource) {
        throw new Error(`the generated resource seems empty`)
      }

      segment.assetUrl = `${work.resource || ''}`
    } else if (workflow.id === 'piapi://luma/v1/video') {
      const result = await createAndFetchDreamMachineVideo(apiKey, {
        prompt: request.prompts.image.positive,
        expand_prompt: false,
        image_url: request.prompts.video.image,

        // nice feature! we should use it :)
        // image_end_url?: string;
      })

      if (!result.data.generation.video) {
        throw new Error(`Failed to generate at least one video`)
      }

      segment.assetUrl = `${result.data.generation.video || ''}`
    } else {
      throw new Error(
        `Clapper doesn't support workflow "${workflow.id}" for provider "PiApi". Please open a pull request with (working code) to solve this!`
      )
    }
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "PiApi". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
