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
  generationWorkflow?: ClapWorkflow
  generationProvider?: ClapWorkflowProvider
  generationEngine?: ClapWorkflowEngine
  faceswapWorkflow?: ClapWorkflow
  faceswapProvider?: ClapWorkflowProvider
  faceswapEngine?: ClapWorkflowEngine
  lipsyncWorkflow?: ClapWorkflow
  lipsyncProvider?: ClapWorkflowProvider
  lipsyncEngine?: ClapWorkflowEngine
} {
  const generationWorkflow: ClapWorkflow | undefined =
    segment.category === ClapSegmentCategory.IMAGE
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

  const generationProvider: ClapWorkflowProvider | undefined =
    generationWorkflow?.provider || undefined

  const generationEngine: ClapWorkflowEngine | undefined =
    generationWorkflow?.engine || undefined

  const faceswapWorkflow: ClapWorkflow | undefined =
    segment.category === ClapSegmentCategory.IMAGE
      ? settings.imageFaceswapWorkflow
      : segment.category === ClapSegmentCategory.VIDEO
        ? settings.videoFaceswapWorkflow
        : undefined

  const faceswapProvider: ClapWorkflowProvider | undefined =
    faceswapWorkflow?.provider || undefined

  const faceswapEngine: ClapWorkflowEngine | undefined =
    faceswapWorkflow?.engine || undefined

  const lipsyncWorkflow: ClapWorkflow | undefined =
    segment.category === ClapSegmentCategory.VIDEO
      ? settings.videoLipsyncWorkflow
      : undefined

  const lipsyncProvider: ClapWorkflowProvider | undefined =
    lipsyncWorkflow?.provider || undefined

  const lipsyncEngine: ClapWorkflowEngine | undefined =
    lipsyncWorkflow?.engine || undefined

  return {
    generationWorkflow,
    generationProvider,
    generationEngine,
    faceswapWorkflow,
    faceswapProvider,
    faceswapEngine,
    lipsyncWorkflow,
    lipsyncProvider,
    lipsyncEngine,
  }
}
