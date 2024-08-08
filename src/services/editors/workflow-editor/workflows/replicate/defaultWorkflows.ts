import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'

import {
  genericHeight1024,
  genericHeight2048,
  genericTextPrompt,
  genericWidth1024,
  genericWidth2048,
} from '../common/defaultValues'

export const defaultWorkflows: ClapWorkflow[] = [
  {
    id: 'replicate://black-forest-labs/flux-pro',
    label: 'FLUX.1 [pro]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    provider: ClapWorkflowProvider.REPLICATE,
    data: 'black-forest-labs/flux-pro',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericTextPrompt,
      genericWidth2048,
      genericHeight2048,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericTextPrompt.defaultValue,
      width: genericWidth2048.defaultValue,
      height: genericHeight2048.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'replicate://black-forest-labs/flux-schnell',
    label: 'FLUX.1 [schnell]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'black-forest-labs/flux-schnell',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [genericTextPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      prompt: genericTextPrompt.defaultValue,
      width: genericWidth2048.defaultValue,
      height: genericHeight2048.defaultValue,
    },
  },
  {
    id: 'replicate://black-forest-labs/flux-dev',
    label: 'FLUX.1 [dev]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'black-forest-labs/flux-dev',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericTextPrompt,
      genericWidth2048,
      genericHeight2048,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericTextPrompt.defaultValue,
      width: genericWidth2048.defaultValue,
      height: genericHeight2048.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'replicate://stability-ai/sdxl',
    label: 'SDXL',
    description: '',
    tags: ['SDXL'],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'stability-ai/fast-sdxl',
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
