import Replicate from 'replicate'
import { ClapSegmentCategory } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'

export async function runFaceSwap(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.replicateApiKey) {
    throw new Error(`Missing API key for "Replicate.com"`)
  }

  const replicate = new Replicate({ auth: request.settings.replicateApiKey })

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

    try {
      // console.log(`requested model:`, request.settings.imageFaceswapWorkflow.data)
      const response = (await replicate.run(
        request.settings.imageFaceswapWorkflow.data as any,
        {
          input: {
            input_image: segment.assetUrl,
            swap_image: request.prompts.image.identity,
            disable_safety_checker:
              !request.settings.censorNotForAllAudiencesContent,
          },
        }
      )) as any

      // note how it is
      const imageResult = `${response || ''}`

      if (!imageResult) {
        throw new Error(`the generated image is empty`)
      }

      segment.assetUrl = imageResult
    } catch (err) {
      console.error(`failed to run a face-swap using Replicate.com:`, err)
    }
  } else {
    throw new Error(
      `Clapper doesn't support face swapping for the "${segment.category}" category using Replicate.com yet`
    )
  }

  return segment
}
