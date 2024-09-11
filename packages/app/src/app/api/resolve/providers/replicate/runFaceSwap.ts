// import Replicate from 'replicate'
// fix for the error:
// ../../node_modules/replicate/lib/util.js
// Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
const Replicate = require('replicate')

import { ClapSegmentCategory } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'
import {
  builtinProviderCredentialsReplicate,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function runFaceSwap(
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
