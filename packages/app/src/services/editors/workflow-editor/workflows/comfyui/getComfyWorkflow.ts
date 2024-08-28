import { ClapSegmentCategory } from '@aitube/clap'
import { useSettings } from '@/services'

export function getComfyWorkflow(category: ClapSegmentCategory) {
  const settings = useSettings.getState()

  let comfyWorkflow

  if (category === ClapSegmentCategory.STORYBOARD) {
    comfyWorkflow = settings.comfyClapWorkflowForImage
  } else if (category === ClapSegmentCategory.VIDEO) {
    comfyWorkflow = settings.comfyClapWorkflowForVideo
  }

  return JSON.stringify(comfyWorkflow || {})
}
