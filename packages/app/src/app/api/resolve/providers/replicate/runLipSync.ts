// import Replicate from 'replicate'
// fix for the error:
// ../../node_modules/replicate/lib/util.js
// Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
const Replicate = require('replicate')

import { ClapSegmentCategory } from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import { ResolveRequest } from '@aitube/clapper-services'

export async function runLipSync(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.replicateApiKey) {
    throw new Error(`Missing API key for "Replicate.com"`)
  }

  const replicate = new Replicate({ auth: request.settings.replicateApiKey })

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
        `cannot run the lip sync without an videoLipsyncWorkflowModel`
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
          input: {
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
