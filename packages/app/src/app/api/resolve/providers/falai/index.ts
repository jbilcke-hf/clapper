import * as fal from '@fal-ai/serverless-client'
import { TimelineSegment } from '@aitube/timeline'
import { FalAiImageSize, ResolveRequest } from '@aitube/clapper-services'
import { ClapMediaOrientation, ClapSegmentCategory } from '@aitube/clap'
import {
  FalAiAudioResponse,
  FalAiImageResponse,
  FalAiImagesResponse,
  FalAiSpeechResponse,
  FalAiVideoResponse,
} from './types'
import { getWorkflowInputValues } from '../getWorkflowInputValues'
import { sampleDrivingVideo, sampleVoice } from '@/lib/core/constants'
import { getWorkflowLora } from '@/services/editors/workflow-editor/workflows/common/loras/getWorkflowLora'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.falAiApiKey) {
    throw new Error(`Missing API key for "Fal.ai"`)
  }

  fal.config({
    credentials: request.settings.falAiApiKey,
  })

  const segment: TimelineSegment = request.segment

  let model = request.settings.imageGenerationWorkflow.data || ''

  // for doc see:
  // https://fal.ai/models/fal-ai/fast-sdxl/api

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
    model = request.settings.imageGenerationWorkflow.data || ''

    if (!request.prompts.image.positive) {
      console.error(
        `resolveSegment: cannot resolve a storyboard with an empty prompt`
      )
      return segment
    }

    let result: FalAiImagesResponse | undefined = undefined

    let isUsingIntegratedFaceId = false

    if (model === 'fal-ai/pulid') {
      if (!request.prompts.image.identity) {
        // throw new Error(`you selected model ${request.settings.falAiModelForImage}, but no character was found, so skipping`)
        // console.log(`warning: user selected model ${request.settings.falAiModelForImage}, but no character was found. Falling back to fal-ai/flux-pro`)

        // dirty fix to fallback to a non-face model
        model = 'fal-ai/flux/schnell'
      } else {
        isUsingIntegratedFaceId = true
      }
    }

    const { workflowDefaultValues, workflowValues } = getWorkflowInputValues(
      request.settings.imageGenerationWorkflow
    )

    // previous FAL used predefined sizes
    // but I've notived that they started to add support for custom sizes as well
    // so let's use custom sizing now

    const imageSize = {
      width:
        request.meta.width ||
        workflowValues.width ||
        workflowDefaultValues.width,
      height:
        request.meta.height ||
        workflowValues.height ||
        workflowDefaultValues.height,
    }

    // this was the previous system
    /*
      request.meta.orientation === ClapMediaOrientation.SQUARE
        ? FalAiImageSize.SQUARE_HD
        : request.meta.orientation === ClapMediaOrientation.PORTRAIT
          ? FalAiImageSize.PORTRAIT_16_9
          : FalAiImageSize.LANDSCAPE_16_9
    */

    delete workflowDefaultValues.width
    delete workflowDefaultValues.height
    delete workflowValues.width
    delete workflowValues.height

    if (model === 'fal-ai/pulid') {
      result = (await fal.run(model, {
        input: {
          prompt: request.prompts.image.positive,
          reference_images: [
            {
              image_url: request.prompts.image.identity,
            },
          ],
          image_size: imageSize,
          num_images: 1,
          sync_mode: true,
          enable_safety_checker:
            request.settings.censorNotForAllAudiencesContent,
        },
      })) as FalAiImagesResponse
    } else if (model === 'fal-ai/flux-general') {
      // note: this isn't the right place to do this, because maybe the LoRAs are dynamic
      const loraModel = getWorkflowLora(
        request.settings.imageGenerationWorkflow
      )
      if (!loraModel) {
        throw new Error(`this model cannot be used without a valid LoRA`)
      }

      const url = loraModel.repoOrUrl.startsWith('http')
        ? loraModel.repoOrUrl
        : `https://huggingface.co/${loraModel.repoOrUrl}/resolve/main/${
            loraModel.fileName || 'lora_weights.safetensors'
          }?download=true`

      const prompt = [loraModel.trigger, request.prompts.image.positive]
        .filter((x) => x)
        .join(' ')

      result = (await fal.run(model, {
        input: {
          prompt,
          loras: [
            {
              path: url,
              scale: 1.0, // between 0 and 4
            },
          ],
          image_size: imageSize,
          num_images: 1,
          sync_mode: true,
          enable_safety_checker:
            request.settings.censorNotForAllAudiencesContent,
        },
      })) as FalAiImagesResponse
    } else {
      result = (await fal.run(model, {
        input: {
          ...workflowDefaultValues,
          ...workflowValues,

          prompt: request.prompts.image.positive,

          image_size: imageSize,
          sync_mode: true,
          num_images: 1,
          enable_safety_checker:
            request.settings.censorNotForAllAudiencesContent,
        },
      })) as FalAiImagesResponse
    }

    if (request.settings.censorNotForAllAudiencesContent) {
      if (
        Array.isArray(result.has_nsfw_concepts) &&
        result.has_nsfw_concepts.includes(true)
      ) {
        throw new Error(
          `The generated content has been filtered according to your safety settings`
        )
      }
    }

    segment.assetUrl = result.images[0]?.url || ''
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    model = request.settings.videoGenerationWorkflow.data || ''

    // console.log(`request.settings.falAiModelForVideo = `, request.settings.falAiModelForVideo)
    if (model === 'fal-ai/live-portrait') {
      const result = (await fal.run(model, {
        input: {
          image_url: request.prompts.video.image,

          // what we do here is that we generate an "idle" video
          // now, the current driving video is just a dummy one I made for testing
          // we can replace it by something better, that would reflect the current
          // pacing of the scene (news anchor, peaceful dialogue, intense, aggressive etc)
          video_url: sampleDrivingVideo,

          sync_mode: true,
          enable_safety_checker:
            request.settings.censorNotForAllAudiencesContent,
        },
      })) as FalAiVideoResponse

      if (request.settings.censorNotForAllAudiencesContent) {
        if (
          Array.isArray(result.has_nsfw_concepts) &&
          result.has_nsfw_concepts.includes(true)
        ) {
          throw new Error(
            `The generated content has been filtered according to your safety settings`
          )
        }
      }

      console.log('live portrait result:', result)

      segment.assetUrl = result?.video?.url || ''
    } else if (model !== 'fal-ai/stable-video') {
      throw new Error(
        `only "fal-ai/stable-video" is supported by Clapper for the moment`
      )
    }

    if (!request.prompts.video.image) {
      throw new Error(
        `cannot generate a video without a storyboard (the concept of Clapper is to use storyboards)`
      )
    }

    const result = (await fal.run(model, {
      input: {
        ...getWorkflowInputValues(request.settings.videoGenerationWorkflow),

        image_url: request.prompts.video.image,

        sync_mode: true,
        enable_safety_checker: request.settings.censorNotForAllAudiencesContent,
      },
    })) as FalAiVideoResponse

    if (request.settings.censorNotForAllAudiencesContent) {
      if (
        Array.isArray(result.has_nsfw_concepts) &&
        result.has_nsfw_concepts.includes(true)
      ) {
        throw new Error(
          `The generated content has been filtered according to your safety settings`
        )
      }
    }

    segment.assetUrl = result?.video?.url || ''
  } else if (request.segment.category === ClapSegmentCategory.SOUND) {
    model = request.settings.musicGenerationWorkflow.data

    const result = (await fal.run(model, {
      input: {
        ...getWorkflowInputValues(request.settings.soundGenerationWorkflow),

        // note how we use the *segment* prompt for music or sound
        prompt: request.segment.prompt,

        sync_mode: true,
        enable_safety_checker: request.settings.censorNotForAllAudiencesContent,
      },
    })) as FalAiAudioResponse

    segment.assetUrl = result?.audio_file?.url || ''
  } else if (request.segment.category === ClapSegmentCategory.MUSIC) {
    model = request.settings.musicGenerationWorkflow.data

    const result = (await fal.run(model, {
      input: {
        ...getWorkflowInputValues(request.settings.soundGenerationWorkflow),

        // note how we use the *segment* prompt for music or sound
        prompt: request.segment.prompt,

        sync_mode: true,
        enable_safety_checker: request.settings.censorNotForAllAudiencesContent,
      },
    })) as FalAiAudioResponse

    segment.assetUrl = result?.audio_file?.url || ''
  } else if (request.segment.category === ClapSegmentCategory.DIALOGUE) {
    model = request.settings.voiceGenerationWorkflow.data || ''

    let voiceIdentity = request.prompts.voice.identity || sampleVoice

    const result = (await fal.run(model, {
      input: {
        ...getWorkflowInputValues(request.settings.voiceGenerationWorkflow),

        text: request.segment.prompt, // <-- we are using the segment prompt
        audio_url: voiceIdentity,

        sync_mode: true,
        enable_safety_checker: request.settings.censorNotForAllAudiencesContent,
      },
    })) as FalAiSpeechResponse

    segment.assetUrl = result?.audio_url?.url || ''
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Fal.ai". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
