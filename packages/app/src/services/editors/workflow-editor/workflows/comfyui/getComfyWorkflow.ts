import { ClapSegmentCategory } from '@aitube/clap'
import { useSettings } from '@/services'

export function getComfyWorkflow(category: ClapSegmentCategory) {
  const settings = useSettings.getState()

  let comfyWorkflow

  if (category === ClapSegmentCategory.IMAGE) {
    comfyWorkflow = settings.comfyClapWorkflowForImage
  } else if (category === ClapSegmentCategory.VIDEO) {
    comfyWorkflow = settings.comfyClapWorkflowForVideo
  } else if (category === ClapSegmentCategory.DIALOGUE) {
    comfyWorkflow = settings.comfyWorkflowForVoice
  } else if (category === ClapSegmentCategory.SOUND) {
    comfyWorkflow = settings.comfyWorkflowForSound
  } else if (category === ClapSegmentCategory.MUSIC) {
    comfyWorkflow = settings.comfyWorkflowForMusic
  }

  return typeof comfyWorkflow === 'string'
    ? comfyWorkflow
    : JSON.stringify(comfyWorkflow || {})
}
