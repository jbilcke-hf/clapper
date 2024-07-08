import * as fal from '@fal-ai/serverless-client'
import { TimelineSegment } from '@aitube/timeline'
import { FalAiImageSize, ResolveRequest } from "@aitube/clapper-services"
import { ClapMediaOrientation, ClapSegmentCategory } from "@aitube/clap"
import { FalAiAudioResponse, FalAiImageResponse, FalAiSpeechResponse, FalAiVideoResponse } from './types'


export async function resolveSegment(request: ResolveRequest): Promise<TimelineSegment> {
  if (!request.settings.falAiApiKey) {
    throw new Error(`Missing API key for "Fal.ai"`)
  }

  fal.config({
    credentials: request.settings.falAiApiKey
  })

  const segment: TimelineSegment = request.segment


  // for doc see: 
  // https://fal.ai/models/fal-ai/fast-sdxl/api
  
  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {

          
    if (!request.prompts.image.positive) {
      console.error(`resolveSegment: cannot resolve a storyboard with an empty prompt`)
      return segment
    }

    const imageSize =
      request.meta.orientation === ClapMediaOrientation.SQUARE
        ? FalAiImageSize.SQUARE_HD
        : request.meta.orientation === ClapMediaOrientation.PORTRAIT
        ? FalAiImageSize.PORTRAIT_16_9
        : FalAiImageSize.LANDSCAPE_16_9

    let result: FalAiImageResponse | undefined = undefined

    if (request.settings.imageGenerationModel === "fal-ai/pulid") {
      if (!request.prompts.image.identity) {
        // throw new Error(`you selected model ${request.settings.falAiModelForImage}, but no character was found, so skipping`)
        // console.log(`warning: user selected model ${request.settings.falAiModelForImage}, but no character was found. Falling back to fal-ai/fast-sdxl`)
        
        // dirty fix to fallback to a non-face model
        request.settings.imageGenerationModel = "fal-ai/fast-sdxl"
      }
    }

    if (request.settings.imageGenerationModel === "fal-ai/pulid") {
      result = await fal.run(request.settings.imageGenerationModel, {
        input: {
          reference_images: [{
            image_url: request.prompts.image.identity
          }],
          image_size: imageSize,
          num_images: 1,
          sync_mode: true,
          enable_safety_checker: request.settings.censorNotForAllAudiencesContent
        },
      }) as FalAiImageResponse
  
    } else {
      result = await fal.run(request.settings.imageGenerationModel, {
        input: {
          prompt: request.prompts.image.positive,
          image_size: imageSize,
          sync_mode: true,
          num_inference_steps:
            request.settings.imageGenerationModel === "fal-ai/stable-diffusion-v3-medium"
              ? 40
              : 25,
          num_images: 1,
          enable_safety_checker: request.settings.censorNotForAllAudiencesContent
        },
      }) as FalAiImageResponse
    }

  
    if (request.settings.censorNotForAllAudiencesContent) {
      if (result.has_nsfw_concepts.includes(true)) {
        throw new Error(`The generated content has been filtered according to your safety settings`)
      }
    }

    segment.assetUrl = result.images[0]?.url || ""
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {

    // console.log(`request.settings.falAiModelForVideo = `, request.settings.falAiModelForVideo)
    if (request.settings.videoGenerationModel !== "fal-ai/stable-video") {
      throw new Error(`only "fal-ai/stable-video" is supported by Clapper for the moment`)
    }

    const storyboard = request.segments.find(s => s.category === ClapSegmentCategory.STORYBOARD)
    if (!storyboard) {
      throw new Error(`cannot generate a video without a storyboard (the concept of Clapper is to use storyboards)`)
    }
    const result = await fal.run(request.settings.videoGenerationModel, {
      input: {
        image_url: storyboard.assetUrl,
   
        motion_bucket_id: 55,

        // The conditoning augmentation determines the amount of noise that 
        // will be added to the conditioning frame. The higher the number,
        // the more noise there will be, and the less the video will look
        // like the initial image. Increase it for more motion.
        // Default value: 0.02
        cond_aug: 0.02,

        sync_mode: true,
        enable_safety_checker: request.settings.censorNotForAllAudiencesContent
      },
    }) as FalAiVideoResponse

    if (request.settings.censorNotForAllAudiencesContent) {
      if (result.has_nsfw_concepts.includes(true)) {
        throw new Error(`The generated content has been filtered according to your safety settings`)
      }
    }

    segment.assetUrl = result?.video?.url || ""
  } else if (
    request.segment.category === ClapSegmentCategory.SOUND
    ||
    request.segment.category === ClapSegmentCategory.MUSIC
  ) {
    const result = await fal.run(request.settings.soundGenerationModel, {
      input: {
        // note how we use the *segment* prompt for music or sound
        prompt: request.segment.prompt,

        sync_mode: true,
        enable_safety_checker: request.settings.censorNotForAllAudiencesContent
      },
    }) as FalAiAudioResponse

    segment.assetUrl = result?.audio_file?.url || ""
  } else if (
    request.segment.category === ClapSegmentCategory.DIALOGUE
  ) {
    const result = await fal.run(request.settings.voiceGenerationModel, {
      input: {
        text: request.segment.prompt,

        // todo use the entty audio id, if available
        audio_url: "https://cdn.themetavoice.xyz/speakers/bria.mp3",

        sync_mode: true,
        enable_safety_checker: request.settings.censorNotForAllAudiencesContent
      },
    }) as FalAiSpeechResponse

    segment.assetUrl = result?.audio_url?.url || ""
  } else {
    throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Fal.ai". Please open a pull request with (working code) to solve this!`)
  }

  return segment
}