import {
  ClapSegmentCategory,
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import { RequestSettings } from '@aitube/clapper-services'
import { TimelineSegment } from '@aitube/timeline'

export function getSegmentWorkflowProviderAndEngine({
  segment,
  settings,
}: {
  segment: TimelineSegment
  settings: RequestSettings
}): {
  workflow?: ClapWorkflow
  provider?: ClapWorkflowProvider
  engine?: ClapWorkflowEngine
} {
  const workflow: ClapWorkflow | undefined =
    segment.category === ClapSegmentCategory.STORYBOARD
      ? settings.imageGenerationWorkflow
      : segment.category === ClapSegmentCategory.VIDEO
        ? settings.videoGenerationWorkflow
        : segment.category === ClapSegmentCategory.DIALOGUE
          ? settings.voiceGenerationWorkflow
          : segment.category === ClapSegmentCategory.SOUND
            ? settings.soundGenerationWorkflow
            : segment.category === ClapSegmentCategory.MUSIC
              ? settings.musicGenerationWorkflow
              : undefined

  const provider: ClapWorkflowProvider | undefined =
    workflow?.provider || undefined

  const engine: ClapWorkflowEngine | undefined = workflow?.engine || undefined

  return { workflow, provider, engine }
}
