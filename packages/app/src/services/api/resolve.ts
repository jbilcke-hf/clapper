'use client'

import {
  ClapMeta,
  ClapSegmentCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
  newSegment,
} from '@aitube/clap'
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
import { getDefaultResolveRequestPrompts } from '../resolver/getDefaultResolveRequestPrompts'

export async function resolve(
  req: Partial<ResolveRequest>
): Promise<TimelineSegment> {
  const { getRequestSettings }: SettingsStore = useSettings.getState()
  const timeline: TimelineStore = useTimeline.getState()

  const meta = timeline.getClapMeta()

  const defaultTimelineSegment: TimelineSegment =
    await clapSegmentToTimelineSegment(
      newSegment({
        category: ClapSegmentCategory.IMAGE,
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

    // jbilcke-hf: I don't think we need all of those fields
    // for our request, especially since some are a bit large
    // and probably slow-down all our requests eg. the story prompt, thumbnail..
    meta,
    prompts: getDefaultResolveRequestPrompts(req.prompts),
  }

  if (
    request.settings.imageGenerationWorkflow.provider ===
      ClapWorkflowProvider.ANTHROPIC &&
    request.settings.imageGenerationWorkflow.engine ===
      ClapWorkflowEngine.REST_API
  ) {
    console.log(
      `The request looks weird, as if your codebase just got re-generated using NextJS hot reload?`
    )
    return segment
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
