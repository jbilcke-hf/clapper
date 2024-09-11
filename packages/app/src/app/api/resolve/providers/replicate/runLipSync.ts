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

export async function runLipSync(
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

  const firstDialogue = request.segments.find(
    (s) => s.category === ClapSegmentCategory.DIALOGUE
  )
  const firstDialogueAudio = firstDialogue?.assetUrl

  if (segment.category === ClapSegmentCategory.VIDEO) {
    const videoLipsyncWorkflowModel =
      request.settings.videoLipsyncWorkflow.data || ''

    if (!videoLipsyncWorkflowModel) {
      throw new Error(
        `cannot run the lip sync without a videoLipsyncWorkflowModel`
      )
    }
    if (!segment.assetUrl) {
      throw new Error(`cannot run the lip sync without a video`)
    }

    if (!firstDialogueAudio) {
      throw new Error(`cannot run the lip sync without a dialogue speech`)
    }

    try {

      // console.log(`requested model:`, request.settings.videoLipsyncWorkflow.data)
      const response = (await replicate.run(
        request.settings.videoLipsyncWorkflow.data as any,
        {
          input: 
           // TODO @julian: I'm not a fan of those hard-coded if/else
           // we should read the params from the workflow parameters instead
           request.settings.videoLipsyncWorkflow.id === 'replicate://douwantech/musetalk'
            ? {
            video_input: segment.assetUrl,
            audio_input: firstDialogueAudio,

            disable_safety_checker:
              !request.settings.censorNotForAllAudiencesContent,
            } : {
            // note: this is actually a VIDEO (they call it face, but it's a face video)
            face: segment.assetUrl,
            input_audio: firstDialogueAudio,

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
      console.error(`failed to run a lip sync using Replicate.com:`, err)
    }
  } else {
    throw new Error(
      `Clapper doesn't support lip sync for the "${segment.category}" category using Replicate.com yet`
    )
  }

  return segment
}
