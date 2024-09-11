import {
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
} from '@aitube/clap'

import { ResolveRequest } from '@aitube/clapper-services'

import { runWorkflow } from './runWorkflow'
import { TimelineSegment } from '@aitube/timeline'
import {
  builtinProviderCredentialsReplicate,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
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

  const segment: TimelineSegment = request.segment

  if (request.segment.category === ClapSegmentCategory.IMAGE) {
    const inputFields =
      request.settings.imageGenerationWorkflow.inputFields || []

    // since this is a random "wild" workflow, it is possible
    // that the field name is a bit different
    // we try to look into the workflow input fields
    // to find the best match
    const promptFields = [
      inputFields.find((f) => f.id === 'prompt'), // exactMatch,
      inputFields.find((f) => f.id.includes('prompt')), // similarName,
      inputFields.find((f) => f.type === 'string'), // similarType
    ].filter((x) => typeof x !== 'undefined')

    const promptField = promptFields[0]
    if (!promptField) {
      throw new Error(
        `this workflow doesn't seem to have a parameter called "prompt"`
      )
    }

    console.log(`TODO: inject parameters into the final request object`)
    const workflow = `{}` // <- the final workflow sent to Replicate

    try {
      segment.assetUrl = await runWorkflow({
        apiKey,
        workflow,
      })
      segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
    } catch (err) {
      console.error(`failed to call Replicate: `, err)
      segment.assetUrl = ''
      segment.assetSourceType = getClapAssetSourceType(segment.assetUrl)
      segment.status = ClapSegmentStatus.TO_GENERATE
      // request.segment.status = ClapSegmentStatus.ERROR
    }
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    // TODO do the same for video
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Comfy.icu". Please open a pull request with (working code) to solve this!`
    )
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "Comfy.icu". Please open a pull request with (working code) to solve this!`
    )
  }

  return segment
}
