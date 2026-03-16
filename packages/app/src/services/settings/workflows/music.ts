import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

export const defaultWorkflowForMusic: ClapWorkflow = {
  id: 'comfyui://settings.comfyWorkflowForMusic',
  label: 'Custom Music Workflow',
  description: 'Custom ComfyUI workflow to generate music',
  tags: ['custom', 'music generation'],
  author: 'You',
  thumbnailUrl: '',
  nonCommercial: false,
  engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
  provider: ClapWorkflowProvider.COMFYUI,
  category: ClapWorkflowCategory.MUSIC_GENERATION,
  data: '{}',
  schema: '',
  inputFields: [],
  inputValues: {},
}
