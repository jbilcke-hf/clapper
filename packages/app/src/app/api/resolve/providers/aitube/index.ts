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

export async function resolveSegment(
  request: ResolveRequest
): Promise<TimelineSegment> {
  if (!request.settings.aiTubeApiKey) {
    throw new Error(`Missing API key for "AiTube"`)
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
      token: '<TODO>',
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
      token: '<TODO>',
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
      token: '<TODO>',
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
      token: '<TODO>',
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
