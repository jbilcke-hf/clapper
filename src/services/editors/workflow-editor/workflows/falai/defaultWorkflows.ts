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

/*

TODO: add those as well

"fal-ai/photomaker",
"fal-ai/pulid",
"fal-ai/image-to-image",
"fal-ai/omni-zero",

*/

export const defaultWorkflows: ClapWorkflow[] = [
  {
    id: 'falai://fal-ai/flux-pro',
    label: 'FLUX.1 [pro]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-pro',
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
    id: 'falai://fal-ai/flux-schnell',
    label: 'FLUX.1 [schnell]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-schnell',
    inputFields: [genericTextPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      prompt: genericTextPrompt.defaultValue,
      width: genericWidth2048.defaultValue,
      height: genericHeight2048.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/flux-dev',
    label: 'FLUX.1 [dev]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-dev',
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
    id: 'falai://fal-ai/fast-sdxl',
    label: 'Fast SDXL',
    description: '',
    tags: ['SD3'],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/fast-sdxl',
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
    id: 'falai://fal-ai/stable-diffusion-v3-medium',
    label: 'Stable Diffusion 3 (Medium)',
    description: '',
    tags: ['SD3'],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/stable-diffusion-v3-medium',
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
