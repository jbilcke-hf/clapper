import * as fal from '@fal-ai/serverless-client'

import { FalAiImageSize, RenderRequest } from "@/types"
import { ClapMediaOrientation, ClapSegment, ClapSegmentCategory, ClapSegmentStatus, getClapAssetSourceType } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"
import { decodeOutput } from '@/lib/utils/decodeOutput'
import { FalAiAudioResponse, FalAiImageResponse, FalAiSpeechResponse, FalAiVideoResponse } from './types'
import { getRenderRequestPrompts } from '@/lib/utils/getRenderRequestPrompts'

export async function renderSegment(request: RenderRequest): Promise<ClapSegment> {
  if (!request.settings.falAiApiKey) {
    throw new Error(`Missing API key for "Fal.ai"`)
  }

  fal.config({
    credentials: request.settings.falAiApiKey
  })

  const segment: ClapSegment = { ...request.segment }

  let content = ''

  const prompts = getRenderRequestPrompts(request)
  
  try {

    // for doc see: 
    // https://fal.ai/models/fal-ai/fast-sdxl/api
    
    if (request.segment.category === ClapSegmentCategory.STORYBOARD) {

      const visualPrompt = getVideoPrompt(
        request.segments,
        request.entities
      )

      const imageSize =
        request.meta.orientation === ClapMediaOrientation.SQUARE
          ? FalAiImageSize.SQUARE_HD
          : request.meta.orientation === ClapMediaOrientation.PORTRAIT
          ? FalAiImageSize.PORTRAIT_16_9
          : FalAiImageSize.LANDSCAPE_16_9

      let result: FalAiImageResponse | undefined = undefined

      if (request.settings.falAiModelForImage === "fal-ai/pulid" && request.mainCharacterEntity?.imageId) {
        result = await fal.run(request.settings.falAiModelForImage, {
          input: {
            prompt: prompts.positivePrompt,
            image_size: imageSize,
            sync_mode: true,
            enable_safety_checker: request.settings.censorNotForAllAudiencesContent
          },
        }) as FalAiImageResponse
    
      } else {
        //throw new Error(`you selected model ${request.settings.falAiModelForImage}, but no character was found, so skipping`)
        console.log(`warning: user selected model ${request.settings.falAiModelForImage}, but no character was found. Falling back to fal-ai/fast-sdxl`)
        
        // dirty fix to fallback to a non-face model
        request.settings.falAiModelForImage = "fal-ai/fast-sdxl"

        result = await fal.run(request.settings.falAiModelForImage, {
          input: {
            prompt: prompts.positivePrompt,
            image_size: imageSize,
            sync_mode: true,
            enable_safety_checker: request.settings.censorNotForAllAudiencesContent
          },
        }) as FalAiImageResponse
      }

   
      if (request.settings.censorNotForAllAudiencesContent) {
        if (result.has_nsfw_concepts.includes(true)) {
          throw new Error(`The generated content has been filtered according to your safety settings`)
        }
      }

      content = result.images[0]?.url
    } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
      if (request.settings.falAiModelForVideo !== "fal-ai/stable-video") {
        throw new Error(`only "fal-ai/stable-video" is supported by Clapper for the moment`)
      }

      const storyboard = request.segments.find(s => s.category === ClapSegmentCategory.STORYBOARD)
      if (!storyboard) {
        throw new Error(`cannot generate a video without a storyboard (the concept of Clapper is to use storyboards)`)
      }
      const result = await fal.run(request.settings.falAiModelForVideo, {
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

      content = result?.video?.url
    } else if (
      request.segment.category === ClapSegmentCategory.SOUND
      ||
      request.segment.category === ClapSegmentCategory.MUSIC
    ) {
      const result = await fal.run(request.settings.falAiModelForSound, {
        input: {
          // note how we use the *segment* prompt for music
          prompt: request.segment.prompt,

          sync_mode: true,
          enable_safety_checker: request.settings.censorNotForAllAudiencesContent
        },
      }) as FalAiAudioResponse

      content = result?.audio_file?.url
    } else if (
      request.segment.category === ClapSegmentCategory.DIALOGUE
    ) {
      const result = await fal.run(request.settings.falAiModelForSpeech, {
        input: {
          text: request.segment.prompt,

          // todo use the entty audio id, if available
          audio_url: "https://cdn.themetavoice.xyz/speakers/bria.mp3",

          sync_mode: true,
          enable_safety_checker: request.settings.censorNotForAllAudiencesContent
        },
      }) as FalAiSpeechResponse

      content = result?.audio_url?.url
    } else {
      throw new Error(`Clapper doesn't support ${request.segment.category} generation for provider "Fal.ai". Please open a pull request with (working code) to solve this!`)
    }

    segment.assetUrl = await decodeOutput(content)
    // console.log(`segment.assetUrl = ${segment.assetUrl.slice(0, 80)}..`)
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
  } catch (err) {
    console.error(`failed to call Fal.ai: `, err)
    segment.assetUrl = ''
    segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    segment.status = ClapSegmentStatus.TO_GENERATE
  }

  return segment
}