import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

import { genericPrompt } from '../common/defaultValues'
import { text_to_image_demo_workflow } from '../common/comfyui/text_to_image_demo_workflow'

// some predefined workflows (later we will add some option to customize this)
export const comfyuiWorkflows: ClapWorkflow[] = [
  {
    id: 'comfyui://text_to_image_demo_workflow',
    label: "WIP DEMO (DOESN'T WORK)",
    description: '',
    tags: [],
    author: '',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
    provider: ClapWorkflowProvider.COMFYUI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: JSON.stringify(text_to_image_demo_workflow),
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
  /*
  {
    id: 'comfyui://flux_plus_ultimatesd_upscale',
    label: 'FLUX.1 + Ultimate SD Upscale',
    description: '',
    tags: ['comfyui', 'flux'],
    author: '',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
    provider: ClapWorkflowProvider.COMFYUI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    
    // TODO: we need to properly map the inputs to the schema
    data: JSON.stringify( TODO! we need to find the API schema ),
    inputFields: [genericPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,
    },
  },
  */
]
