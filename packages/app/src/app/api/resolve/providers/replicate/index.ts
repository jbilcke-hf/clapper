import Replicate from 'replicate'

import { ClapMediaOrientation, ClapSegmentCategory } from '@aitube/clap'
import { ResolveRequest } from '@aitube/clapper-services'
import { TimelineSegment } from '@aitube/timeline'
import { getWorkflowInputValues } from '../getWorkflowInputValues'
import { defaultLoraModels } from '@/services/editors/workflow-editor/workflows/common/loras'
import { getWorkflowLora } from '@/services/editors/workflow-editor/workflows/common/loras/getWorkflowLora'

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

    let params: object = {
      prompt: request.prompts.image.positive,
      width: request.meta.width,
      height: request.meta.height,
      disable_safety_checker: !request.settings.censorNotForAllAudiencesContent,
    }

    const aspectRatio =
    request.meta.orientation === ClapMediaOrientation.SQUARE
      ? "1:1"
      : request.meta.orientation === ClapMediaOrientation.PORTRAIT
        ? "9:16"
        : "16:9"

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
      const loraModel = getWorkflowLora(request.settings.imageGenerationWorkflow)

      params = {
        // for some reason this model doesn't support arbitrary width and height,
        // at least not at the time of writing..
        aspect_ratio: aspectRatio,

        hf_lora: workflowValues['hf_lora'] || '',

        prompt: [
          loraModel?.trigger,
          request.prompts.image.positive
        ].filter(x => x).join(' '),

        disable_safety_checker: !request.settings.censorNotForAllAudiencesContent,
      }
  
    } else if (
      request.settings.imageGenerationWorkflow.data === 'zsxkib/pulid'
    ) {
      params = {
        ...params,
        main_face_image: request.prompts.image.identity,
      }
    }

    /*
    console.log("debug:", {
      model: request.settings.imageGenerationWorkflow.data,
      params,
    })
      */
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
          disable_safety_checker: !request.settings.censorNotForAllAudiencesContent,
        },
      }
    )) as any
    segment.assetUrl = `${response[0] || ''}`
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    const response = (await replicate.run(
      request.settings.videoGenerationWorkflow.data as any,
      {
        input: {
          image: request.prompts.video.image,
          disable_safety_checker: !request.settings.censorNotForAllAudiencesContent,
        },
      }
    )) as any
    segment.assetUrl = `${response[0] || ''}`
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Replicate". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
