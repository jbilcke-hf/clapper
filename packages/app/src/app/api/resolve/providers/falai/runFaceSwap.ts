import * as fal from '@fal-ai/serverless-client'
import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import { FalAiImageResponse } from './types'
import { ClapSegmentCategory } from '@aitube/clap'

export async function runFaceSwap(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.falAiApiKey) {
    throw new Error(`Missing API key for "Fal.ai"`)
  }

  fal.config({
    credentials: request.settings.falAiApiKey,
  })

  const segment: TimelineSegment = request.segment

  if (segment.category === ClapSegmentCategory.IMAGE) {
    const imageFaceswapWorkflowModel =
      request.settings.imageFaceswapWorkflow.data || ''

    if (!imageFaceswapWorkflowModel) {
      throw new Error(
        `cannot run the face swap without an imageFaceswapWorkflowModel`
      )
    }
    if (!segment.assetUrl) {
      throw new Error(`cannot run the face swap without an assetUrl`)
    }
    if (!request.prompts.image.identity) {
      throw new Error(`cannot run the face swap without an identity image`)
    }

    if (imageFaceswapWorkflowModel) {
      try {
        const faceSwapResult = (await fal.run(imageFaceswapWorkflowModel, {
          input: {
            base_image_url: segment.assetUrl,
            swap_image_url: request.prompts.image.identity,

            sync_mode: true,
            num_images: 1,
            enable_safety_checker:
              request.settings.censorNotForAllAudiencesContent,
          },
        })) as FalAiImageResponse

        const imageResult = faceSwapResult.image?.url || ''

        if (!imageResult) {
          throw new Error(`the generated image is empty`)
        }

        if (request.settings.censorNotForAllAudiencesContent) {
          if (
            Array.isArray(faceSwapResult.has_nsfw_concepts) &&
            faceSwapResult.has_nsfw_concepts.includes(true)
          ) {
            throw new Error(
              `The generated content has been filtered according to your safety settings`
            )
          }
        }

        segment.assetUrl = imageResult
      } catch (err) {
        console.error(`failed to run a face-swap using Fal.ai:`, err)
      }
    }
  } else {
    throw new Error(
      `Clapper doesn't support face swapping for the "${segment.category}" category using Fal.ai yet`
    )
  }

  return segment
}
