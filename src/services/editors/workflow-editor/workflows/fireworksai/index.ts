import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'
import {
  genericHeight1024,
  genericTextPrompt,
  genericWidth1024,
} from '../common/defaultValues'

export const fireworksaiWorkflows: ClapWorkflow[] = [
  {
    id: 'fireworksai://stability/sd3',
    label: 'SD3',
    description: '',
    tags: [],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FIREWORKSAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'stability/sd3',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericTextPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericTextPrompt.defaultValue,
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FIREWORKSAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'accounts/stability/models/sd3-turbo',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericTextPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericTextPrompt.defaultValue,
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FIREWORKSAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fireworks/stable-diffusion-xl-1024-v1-0',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericTextPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericTextPrompt.defaultValue,
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FIREWORKSAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'accounts/fireworks/models/playground-v2-5-1024px-aesthetic',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericTextPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericTextPrompt.defaultValue,
      width: genericWidth1024.defaultValue,
      height: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
]
