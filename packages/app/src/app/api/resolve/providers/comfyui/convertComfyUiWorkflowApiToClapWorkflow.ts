import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

import { getInputsFromComfyUiWorkflow } from './getInputsFromComfyUiWorkflow'

export function convertComfyUiWorkflowApiToClapWorkflow(
  workflowString: string,
  category: ClapWorkflowCategory = ClapWorkflowCategory.IMAGE_GENERATION
): ClapWorkflow {
  try {
    const { inputFields, inputValues } = getInputsFromComfyUiWorkflow(
      workflowString,
      category
    )
    const metadata = getCustomComfyWorkflowMetadata(category)

    return {
      id: metadata.id,
      label: metadata.label,
      description: metadata.description,
      tags: ['custom', metadata.tag],
      author: 'You',
      thumbnailUrl: '',
      nonCommercial: false,
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category,
      data: workflowString,
      schema: '',
      inputFields,
      inputValues,
    }
  } catch (e) {
    throw e
  }
}

function getCustomComfyWorkflowMetadata(category: ClapWorkflowCategory) {
  switch (category) {
    case ClapWorkflowCategory.VIDEO_GENERATION:
      return {
        id: 'comfyui://settings.comfyWorkflowForVideo',
        label: 'Custom Video Workflow',
        description: 'Custom ComfyUI workflow to generate videos',
        tag: 'video generation',
      }
    case ClapWorkflowCategory.VOICE_GENERATION:
      return {
        id: 'comfyui://settings.comfyWorkflowForVoice',
        label: 'Custom Voice Workflow',
        description: 'Custom ComfyUI workflow to generate voice',
        tag: 'voice generation',
      }
    case ClapWorkflowCategory.SOUND_GENERATION:
      return {
        id: 'comfyui://settings.comfyWorkflowForSound',
        label: 'Custom Sound Workflow',
        description: 'Custom ComfyUI workflow to generate sound',
        tag: 'sound generation',
      }
    case ClapWorkflowCategory.MUSIC_GENERATION:
      return {
        id: 'comfyui://settings.comfyWorkflowForMusic',
        label: 'Custom Music Workflow',
        description: 'Custom ComfyUI workflow to generate music',
        tag: 'music generation',
      }
    default:
      return {
        id: 'comfyui://settings.comfyWorkflowForImage',
        label: 'Custom Image Workflow',
        description: 'Custom ComfyUI workflow to generate images',
        tag: 'image generation',
      }
  }
}
