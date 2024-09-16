// import Replicate from 'replicate'
// fix for the error:
// ../../node_modules/replicate/lib/util.js
// Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
const Replicate = require('replicate')

import { ClapImageRatio, ClapSegmentCategory } from '@aitube/clap'
import { ResolveRequest } from '@aitube/clapper-services'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'
import { getWorkflowLora } from '@/services/editors/workflow-editor/workflows/common/loras/getWorkflowLora'
import { sampleDrivingVideo, sampleFace } from '@/lib/core/constants'
import {
  builtinProviderCredentialsReplicate,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.replicateApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "Replicate.com"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsReplicate
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsReplicate
    }
  }

  const replicate = new Replicate({ auth: apiKey })

  const segment = request.segment

  if (request.segment.category == ClapSegmentCategory.IMAGE) {
    const model: string = request.settings.imageGenerationWorkflow.data as any

    const { workflowValues } = getWorkflowInputValues(
      request.settings.imageGenerationWorkflow
    )

    const aspectRatio =
      request.meta.orientation === ClapImageRatio.SQUARE
        ? '1:1'
        : request.meta.orientation === ClapImageRatio.PORTRAIT
          ? '9:16'
          : '16:9'

    let params: object = {
      // apply the default values from the workflow
      ...workflowValues,

      // apply the custom values from the request
      prompt: request.prompts.image.positive,
      width: request.meta.width,
      height: request.meta.height,
      aspect_ratio: aspectRatio,

      // always enforce this
      disable_safety_checker: !request.settings.censorNotForAllAudiencesContent,
    }

    if (model.startsWith('zsxkib/flux-pulid')) {
      // see https://replicate.com/zsxkib/flux-pulid

      params = {
        ...params,

        // TODO add seed control (generate it or pass as param)
        // seed: generateSeed()

        main_face_image: request.prompts.image.identity || sampleFace,
        negative_prompt: request.prompts.image.negative,
        num_steps: workflowValues.num_steps,
        start_step: workflowValues.start_step,
        guidance_scale: workflowValues.guidance_scale,

        // with this approach we should be able to always use 'zsxkib/flux-pulid'
        // regardless of the presence of an image identity or not
        id_weight: request.prompts.image.identity
          ? workflowValues.id_weight
          : 0,

        true_cfg: workflowValues.true_cfg,
      }
    } else if (
      model.startsWith('fofr/pulid-lightning') &&
      request.prompts.image.identity
    ) {
      params = {
        ...params,
        face_image: request.prompts.image.identity,
      }
    } else if (model.startsWith('lucataco/flux-dev-lora')) {
      // note: this isn't the right place to do this, because maybe the LoRAs are dynamic
      const loraModel = getWorkflowLora(
        request.settings.imageGenerationWorkflow
      )

      if (!loraModel) {
        throw new Error(`this model cannot be used without a valid LoRA`)
      }

      // for some reason this model doesn't support arbitrary width and height,
      // at least not at the time of writing.. so we re-create the whole params object
      params = {
        aspect_ratio: aspectRatio,

        hf_lora: workflowValues['hf_lora'] || '',

        prompt: [loraModel?.trigger, request.prompts.image.positive]
          .filter((x) => x)
          .join(' '),

        disable_safety_checker:
          !request.settings.censorNotForAllAudiencesContent,
      }
    } else if (
      model.startsWith('zsxkib/pulid') &&
      request.prompts.image.identity
    ) {
      params = {
        ...params,
        main_face_image: request.prompts.image.identity,
      }
    }

    // console.log(`calling Replicate model ${model} with data:`, params)
    const response = (await replicate.run(model, { input: params })) as any

    segment.assetUrl = `${response[0] || ''}`
  } else if (request.segment.category === ClapSegmentCategory.DIALOGUE) {
    const model = request.settings.voiceGenerationWorkflow.data as any

    const { workflowValues } = getWorkflowInputValues(
      request.settings.voiceGenerationWorkflow
    )

    let params: object = {
      // apply the default values from the workflow
      ...workflowValues,

      // always enforce this
      disable_safety_checker: !request.settings.censorNotForAllAudiencesContent,
    }

    if (request.prompts.voice.positive && request.prompts.voice.identity) {
      const response = (await replicate.run(model, {
        input: {
          text: request.prompts.voice.positive,
          audio: request.prompts.voice.identity,
        },
      })) as any
      segment.assetUrl = `${response[0] || ''}`
    } else {
      console.log(`cannot generate a dialogue without a voice identity`)
    }
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    const model = request.settings.videoGenerationWorkflow.data as any

    const { workflowValues } = getWorkflowInputValues(
      request.settings.videoGenerationWorkflow
    )

    const aspectRatio =
      request.meta.orientation === ClapImageRatio.SQUARE
        ? '1:1'
        : request.meta.orientation === ClapImageRatio.PORTRAIT
          ? '9:16'
          : '16:9'

    let params: object = {
      // apply the default values from the workflow
      ...workflowValues,

      // apply the custom values from the request
      width: request.meta.width,
      height: request.meta.height,
      aspect_ratio: aspectRatio,

      // always enforce this
      disable_safety_checker: !request.settings.censorNotForAllAudiencesContent,
    }

    if (model.startsWith('fofr/live-portrait') && request.prompts.video.image) {
      const response = (await replicate.run(model, {
        input: {
          ...params,
          face_image: request.prompts.video.image,

          // todo use our driving video allocation (see in /experiments/)
          driving_video: sampleDrivingVideo,
        },
      })) as any
      segment.assetUrl = `${response[0] || ''}`
    } else if (
      model.startsWith('cuuupid/cogvideox-5b') &&
      request.prompts.image.positive
    ) {
      const response = (await replicate.run(model, {
        input: {
          ...params,

          prompt: request.prompts.image.positive,

          // there are a lot of other params, check them here:
          // https://replicate.com/cuuupid/cogvideox-5b
        },
      })) as any
      segment.assetUrl = `${response[0] || ''}`
    } else if (request.prompts.video.image) {
      const response = (await replicate.run(model, {
        input: {
          ...params,
          image: request.prompts.video.image,
        },
      })) as any
      segment.assetUrl = `${response[0] || ''}`
    }
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Replicate". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
