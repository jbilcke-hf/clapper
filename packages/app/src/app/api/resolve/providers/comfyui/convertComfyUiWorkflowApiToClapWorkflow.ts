import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

import { getInputsFromComfyUiWorkflow } from './getInputsFromComfyUiWorkflow'

const categoryMeta: Record<string, { id: string; label: string; description: string; tags: string[] }> = {
  [ClapWorkflowCategory.VIDEO_GENERATION]: {
    id: 'comfyui://settings.comfyWorkflowForVideo',
    label: 'Custom Video Workflow',
    description: 'Custom ComfyUI workflow to generate videos',
    tags: ['custom', 'video generation'],
  },
  [ClapWorkflowCategory.VOICE_GENERATION]: {
    id: 'comfyui://settings.comfyWorkflowForVoice',
    label: 'Custom Voice Workflow',
    description: 'Custom ComfyUI workflow to generate voice',
    tags: ['custom', 'voice generation'],
  },
  [ClapWorkflowCategory.SOUND_GENERATION]: {
    id: 'comfyui://settings.comfyWorkflowForSound',
    label: 'Custom Sound Workflow',
    description: 'Custom ComfyUI workflow to generate sound effects',
    tags: ['custom', 'sound generation'],
  },
  [ClapWorkflowCategory.MUSIC_GENERATION]: {
    id: 'comfyui://settings.comfyWorkflowForMusic',
    label: 'Custom Music Workflow',
    description: 'Custom ComfyUI workflow to generate music',
    tags: ['custom', 'music generation'],
  },
}

const defaultMeta = {
  id: 'comfyui://settings.comfyWorkflowForImage',
  label: 'Custom Image Workflow',
  description: 'Custom ComfyUI workflow to generate images',
  tags: ['custom', 'image generation'],
}

export function convertComfyUiWorkflowApiToClapWorkflow(
  workflowString: string,
  category: ClapWorkflowCategory = ClapWorkflowCategory.IMAGE_GENERATION
): ClapWorkflow {
  try {
    const { inputFields, inputValues } = getInputsFromComfyUiWorkflow(
      workflowString,
      category
    )
    const meta = categoryMeta[category] || defaultMeta

    return {
      id: meta.id,
      label: meta.label,
      description: meta.description,
      tags: meta.tags,
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
