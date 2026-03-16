import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

export const defaultWorkflowForSound: ClapWorkflow = {
  id: 'comfyui://settings.comfyWorkflowForSound',
  label: 'Custom Sound Workflow',
  description: 'Custom ComfyUI workflow to generate sound effects',
  tags: ['custom', 'sound generation'],
  author: 'You',
  thumbnailUrl: '',
  nonCommercial: false,
  engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
  provider: ClapWorkflowProvider.COMFYUI,
  category: ClapWorkflowCategory.SOUND_GENERATION,
  data: '{}',
  schema: '',
  inputFields: [],
  inputValues: {},
}
