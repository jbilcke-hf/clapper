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
  const { inputFields, inputValues } = getInputsFromComfyUiWorkflow(
    workflowString,
    category
  )
  switch (category) {
    case ClapWorkflowCategory.VIDEO_GENERATION: {
      return {
        id: 'comfyui://settings.comfyWorkflowForVideo',
        label: 'Custom Video Workflow',
        description: 'Custom ComfyUI workflow to generate videos',
        tags: ['custom', 'video generation'],
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
    }
    case ClapWorkflowCategory.VOICE_GENERATION: {
      return {
        id: 'comfyui://settings.comfyWorkflowForVoice',
        label: 'Custom Voice Workflow',
        description: 'Custom ComfyUI workflow to generate voice',
        tags: ['custom', 'voice generation'],
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
    }
    case ClapWorkflowCategory.SOUND_GENERATION: {
      return {
        id: 'comfyui://settings.comfyWorkflowForSound',
        label: 'Custom Sound Workflow',
        description: 'Custom ComfyUI workflow to generate sound',
        tags: ['custom', 'sound generation'],
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
    }
    case ClapWorkflowCategory.MUSIC_GENERATION: {
      return {
        id: 'comfyui://settings.comfyWorkflowForMusic',
        label: 'Custom Music Workflow',
        description: 'Custom ComfyUI workflow to generate music',
        tags: ['custom', 'music generation'],
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
    }
    case ClapWorkflowCategory.IMAGE_GENERATION:
    default: {
      return {
        id: 'comfyui://settings.comfyWorkflowForImage',
        label: 'Custom Image Workflow',
        description: 'Custom ComfyUI workflow to generate images',
        tags: ['custom', 'image generation'],
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
    }
  }
}
