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
  } catch (e) {
    throw e
  }
}
