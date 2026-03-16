import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

export const defaultWorkflowForVoice: ClapWorkflow = {
  id: 'comfyui://settings.comfyWorkflowForVoice',
  label: 'Custom Voice Workflow',
  description: 'Custom ComfyUI workflow to generate voice',
  tags: ['custom', 'voice generation'],
  author: 'You',
  thumbnailUrl: '',
  nonCommercial: false,
  engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
  provider: ClapWorkflowProvider.COMFYUI,
  category: ClapWorkflowCategory.VOICE_GENERATION,
  data: '{}',
  schema: '',
  inputFields: [],
  inputValues: {},
}
