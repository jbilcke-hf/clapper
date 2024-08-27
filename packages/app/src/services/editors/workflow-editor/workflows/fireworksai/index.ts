import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'
import {
  genericHeight1024,
  genericPrompt,
  genericWidth1024,
} from '../common/defaultValues'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
export const fireworksaiWorkflows: ClapWorkflow[] = [
  {
    id: 'fireworksai://stability/sd3',
    label: 'SD3',
    description: '',
    tags: [],
    author: 'Stability AI',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FIREWORKSAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'stability/sd3',
    schema: '',
    /**
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
     */
    inputFields: [
      genericPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth1024.defaultValue,
      height: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'fireworksai://stability/sd3-turbo',
    label: 'SD3 Turbo',
    description: '',
    tags: [],
    author: 'Stability AI',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FIREWORKSAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'accounts/stability/models/sd3-turbo',
    schema: '',
    /**
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
     */
    inputFields: [
      genericPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth1024.defaultValue,
      height: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'fireworksai://fireworks/stable-diffusion-xl-1024-v1-0',
    label: 'SDXL',
    description: '',
    tags: [],
    author: 'Stability AI',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FIREWORKSAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fireworks/stable-diffusion-xl-1024-v1-0',
    schema: '',
    /**
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
     */
    inputFields: [
      genericPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth1024.defaultValue,
      height: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'fireworksai://fireworksai/playground-v2-5-1024px-aesthetic',
    label: 'Playground 2.5',
    description: '',
    tags: [],
    author: 'Stability AI',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FIREWORKSAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'accounts/fireworks/models/playground-v2-5-1024px-aesthetic',
    schema: '',
    /**
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
     */
    inputFields: [
      genericPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth1024.defaultValue,
      height: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'fireworksai://fireworks/llama-v3-70b-instruct',
    label: 'Llama3 70b (Instruct)',
    description: '',
    tags: [],
    author: 'Meta',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FIREWORKSAI,
    category: ClapWorkflowCategory.ASSISTANT,
    data: 'fireworks/llama-v3-70b-instruct',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
]
