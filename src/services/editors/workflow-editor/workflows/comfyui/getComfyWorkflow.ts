import { ClapSegmentCategory } from '@aitube/clap'
import { getVideoPrompt } from '@aitube/engine'

import { ComfyNode, ResolveRequest } from '@aitube/clapper-services'
import { useSettings } from '@/services'

export function getComfyWorkflow(category: ClapSegmentCategory) {
  const settings = useSettings.getState()

  let comfyWorkflow = '{}'

  if (category === ClapSegmentCategory.STORYBOARD) {
    comfyWorkflow = settings.comfyWorkflowForImage
  } else if (category === ClapSegmentCategory.VIDEO) {
    comfyWorkflow = settings.comfyWorkflowForVideo
  }

  return JSON.stringify(comfyWorkflow)
}
