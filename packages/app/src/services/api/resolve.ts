'use client'

import {
  clapSegmentToTimelineSegment,
  TimelineSegment,
  TimelineStore,
  useTimeline,
} from '@aitube/timeline'
import {
  ResolveRequest,
  ResolveRequestPrompts,
  SettingsStore,
} from '@aitube/clapper-services'
import { useSettings } from '../settings'
import { ClapSegmentCategory, newSegment } from '@aitube/clap'
import { getDefaultResolveRequestPrompts } from '../resolver/getDefaultResolveRequestPrompts'

export async function resolve(
  req: Partial<ResolveRequest>
): Promise<TimelineSegment> {
  const { getRequestSettings }: SettingsStore = useSettings.getState()
  const { meta }: TimelineStore = useTimeline.getState()

  const defaultTimelineSegment: TimelineSegment =
    await clapSegmentToTimelineSegment(
      newSegment({
        category: ClapSegmentCategory.STORYBOARD,
      })
    )

  const segment: TimelineSegment = {
    ...defaultTimelineSegment,
    ...req.segment,

    // we omit things that cannot be serialized
    scene: undefined,
    audioBuffer: undefined,
    textures: {},
  }

  const request: ResolveRequest = {
    settings: getRequestSettings(),
    segment,

    segments: Array.isArray(req.segments)
      ? req.segments.map((s) => ({
          ...s,

          // we omit things that cannot be serialized
          scene: undefined,
          audioBuffer: undefined,
          textures: {},
        }))
      : [],

    entities: req.entities ? req.entities : {},
    speakingCharactersIds: Array.isArray(req.speakingCharactersIds)
      ? req.speakingCharactersIds
      : [],
    generalCharactersIds: Array.isArray(req.generalCharactersIds)
      ? req.generalCharactersIds
      : [],
    mainCharacterId: req.mainCharacterId || undefined,
    mainCharacterEntity: req.mainCharacterEntity || undefined,
    meta,
    prompts: getDefaultResolveRequestPrompts(req.prompts),
  }

  const res = await fetch('/api/resolve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  const newSegmentData = (await res.json()) as TimelineSegment

  return newSegmentData
}
