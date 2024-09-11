import { ResolveRequest } from '@aitube/clapper-services'
import {
  ClapCompletionMode,
  ClapSegmentCategory,
  ClapSegmentStatus,
  getClapAssetSourceType,
  newClap,
} from '@aitube/clap'
import { TimelineSegment } from '@aitube/timeline'
import {
  editClapMusic,
  editClapSounds,
  editClapStoryboards,
  editClapVideos,
} from '@aitube/client'

import { getWorkflowInputValues } from '../getWorkflowInputValues'
import {
  builtinProviderCredentialsAitube,
  clapperApiKeyToUseBuiltinCredentials,
} from '@/app/api/globalSettings'

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  let apiKey = request.settings.aiTubeApiKey

  if (!apiKey) {
    if (clapperApiKeyToUseBuiltinCredentials) {
      if (
        request.settings.clapperApiKey !== clapperApiKeyToUseBuiltinCredentials
      ) {
        throw new Error(`Missing API key for "AiTube"`)
      } else {
        // user has a valid Clapper API key, so they are allowed to use the built-in credentials
        apiKey = builtinProviderCredentialsAitube
      }
    } else {
      // no Clapper API key is defined, so we give free access to the built-in credentials
      apiKey = builtinProviderCredentialsAitube
    }
  }

  // TODO: the request should directly contain theCclap,
  // it would make sense since the Clap is already a container
  // format
  const clap = newClap({
    meta: {},
    entities: Object.values(request.entities),
    segments: request.segments,
  })

  if (request.segment.category === ClapSegmentCategory.IMAGE) {
    const resolvedClap = await editClapStoryboards({
      clap,
      completionMode: ClapCompletionMode.PARTIAL,
      turbo: true,
      token: apiKey,
    })

    const storyboardImages = resolvedClap.segments.filter(
      (s) => s.category === ClapSegmentCategory.IMAGE
    )

    const storyboardImage = storyboardImages.at(0)

    if (!storyboardImage) {
      throw new Error(`failed to generate a storyboard image`)
    }

    return {
      ...request.segment,
      ...(storyboardImage as TimelineSegment),
    }
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    const resolvedClap = await editClapVideos({
      clap,
      completionMode: ClapCompletionMode.PARTIAL,
      turbo: true,
      token: apiKey,
    })

    const videos = resolvedClap.segments.filter(
      (s) => s.category === ClapSegmentCategory.VIDEO
    )

    const video = videos.at(0)

    if (!video) {
      throw new Error(`failed to generate a video`)
    }

    return {
      ...request.segment,
      ...(video as TimelineSegment),
    }
  } else if (request.segment.category === ClapSegmentCategory.SOUND) {
    const resolvedClap = await editClapSounds({
      clap,
      completionMode: ClapCompletionMode.PARTIAL,
      turbo: true,
      token: apiKey,
    })

    const sounds = resolvedClap.segments.filter(
      (s) => s.category === ClapSegmentCategory.SOUND
    )

    const sound = sounds.at(0)

    if (!sound) {
      throw new Error(`failed to generate a sound`)
    }

    return {
      ...request.segment,
      ...(sound as TimelineSegment),
    }
  } else if (request.segment.category === ClapSegmentCategory.MUSIC) {
    const resolvedClap = await editClapMusic({
      clap,
      completionMode: ClapCompletionMode.PARTIAL,
      turbo: true,
      token: apiKey,
    })

    const musics = resolvedClap.segments.filter(
      (s) => s.category === ClapSegmentCategory.MUSIC
    )

    const music = musics.at(0)

    if (!music) {
      throw new Error(`failed to generate a music`)
    }

    return {
      ...request.segment,
      ...(music as TimelineSegment),
    }
  } else {
    throw new Error(
      `Clapper doesn't support ${request.segment.category} generation for provider "AiTube". Please open a pull request with (working code) to solve this!`
    )
  }
}
