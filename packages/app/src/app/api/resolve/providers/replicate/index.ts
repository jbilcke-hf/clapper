import Replicate from 'replicate'

import { ClapMediaOrientation, ClapSegmentCategory } from '@aitube/clap'
import { ResolveRequest } from '@aitube/clapper-services'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'
import { getWorkflowLora } from '@/services/editors/workflow-editor/workflows/common/loras/getWorkflowLora'
import { sampleDrivingVideo } from '@/lib/core/constants'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.replicateApiKey) {
    throw new Error(`Missing API key for "Replicate.com"`)
  }
  const replicate = new Replicate({ auth: request.settings.replicateApiKey })

  const segment = request.segment

  if (request.segment.category == ClapSegmentCategory.STORYBOARD) {
    const { workflowValues } = getWorkflowInputValues(
      request.settings.imageGenerationWorkflow
    )

    const aspectRatio =
      request.meta.orientation === ClapMediaOrientation.SQUARE
        ? '1:1'
        : request.meta.orientation === ClapMediaOrientation.PORTRAIT
          ? '9:16'
          : '16:9'

    let params: object = {
      prompt: request.prompts.image.positive,
      width: request.meta.width,
      height: request.meta.height,
      aspect_ratio: aspectRatio,
      disable_safety_checker: !request.settings.censorNotForAllAudiencesContent,
    }

    if (
      request.settings.imageGenerationWorkflow.data === 'fofr/pulid-lightning'
    ) {
      params = {
        ...params,
        face_image: request.prompts.image.identity,
      }
    } else if (
      request.settings.imageGenerationWorkflow.data === 'lucataco/flux-dev-lora'
    ) {
      // note: this isn't the right place to do this, because maybe the LoRAs are dynamic
      const loraModel = getWorkflowLora(
        request.settings.imageGenerationWorkflow
      )

      if (!loraModel) {
        throw new Error(`this model cannot be used without a valid LoRA`)
      }

      params = {
        // for some reason this model doesn't support arbitrary width and height,
        // at least not at the time of writing..
        aspect_ratio: aspectRatio,

        hf_lora: workflowValues['hf_lora'] || '',

        prompt: [loraModel?.trigger, request.prompts.image.positive]
          .filter((x) => x)
          .join(' '),

        disable_safety_checker:
          !request.settings.censorNotForAllAudiencesContent,
      }
    } else if (
      request.settings.imageGenerationWorkflow.data === 'zsxkib/pulid'
    ) {
      params = {
        ...params,
        main_face_image: request.prompts.image.identity,
      }
    }

    const response = (await replicate.run(
      request.settings.imageGenerationWorkflow.data as any,
      { input: params }
    )) as any

    segment.assetUrl = `${response[0] || ''}`
  } else if (request.segment.category === ClapSegmentCategory.DIALOGUE) {
    const response = (await replicate.run(
      request.settings.voiceGenerationWorkflow.data as any,
      {
        input: {
          text: request.prompts.voice.positive,
          audio: request.prompts.voice.identity,
          disable_safety_checker:
            !request.settings.censorNotForAllAudiencesContent,
        },
      }
    )) as any
    segment.assetUrl = `${response[0] || ''}`
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    const model = request.settings.videoGenerationWorkflow.data as any

    if (model.startsWith('fofr/live-portrait')) {
      const response = (await replicate.run(
        request.settings.videoGenerationWorkflow.data as any,
        {
          input: {
            // TODO use the workflows fields to do this
            face_image: request.prompts.video.image,

            // what we do here is that we generate an "idle" video
            // now, the current driving video is just a dummy one I made for testing
            // we can replace it by something better, that would reflect the current
            // pacing of the scene (news anchor, peaceful dialogue, intense, aggressive etc)
            driving_video: sampleDrivingVideo,

            // Select every nth frame from the driving video. Set to 1 to use all frames.
            // default: 1
            video_select_every_n_frames: 1,

            // Size of the output image
            // min: 64, max: 2048
            // default: 512
            live_portrait_dsize: 512,

            // Scaling factor for the face
            // min: 1, max: 4
            // default: 2.3
            live_portrait_scale: 2.3,

            // Enable stitching
            // default: true
            live_portrait_stitching: true,

            // Use relative positioning
            // default: true
            live_portrait_relative: true,

            // there are a lot of other params, check them here:
            // https://replicate.com/fofr/live-portrait

            disable_safety_checker:
              !request.settings.censorNotForAllAudiencesContent,
          },
        }
      )) as any
      segment.assetUrl = `${response[0] || ''}`
    } else {
      const response = (await replicate.run(
        request.settings.videoGenerationWorkflow.data as any,
        {
          input: {
            image: request.prompts.video.image,
            disable_safety_checker:
              !request.settings.censorNotForAllAudiencesContent,
          },
        }
      )) as any
      segment.assetUrl = `${response[0] || ''}`
    }
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Replicate". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
