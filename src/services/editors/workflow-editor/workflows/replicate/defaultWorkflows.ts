import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'

import {
  genericHeight1024,
  genericHeight2048,
  genericImage,
  genericPrompt,
  genericVideo,
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
      genericPrompt,
      genericWidth2048,
      genericHeight2048,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
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
    inputFields: [genericPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      prompt: genericPrompt.defaultValue,
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
      genericPrompt,
      genericWidth2048,
      genericHeight2048,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
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
    id: 'replicate://chenxwh/openvoice',
    label: 'OpenVoice V2',
    description: '',
    tags: ['OpenVoice'],
    author: '@chenxwh',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'chenxwh/openvoice',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'replicate://lucataco/real-esrgan-video',
    label: 'Real-ESRGAN',
    description: '',
    tags: ['video', 'upscaling'],
    author: '',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.VIDEO_UPSCALING,
    data: 'lucataco/real-esrgan-video',
    inputFields: [
      {
        ...genericVideo,
        id: 'video_path',
      },
    ],
    inputValues: {
      video_path: genericVideo.defaultValue,
    },
  },
  {
    id: 'replicate://nightmareai/real-esrgan',
    label: 'Real-ESRGAN',
    description: '',
    tags: ['image', 'upscaling'],
    author: '',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.IMAGE_UPSCALING,
    data: 'nightmareai/real-esrgan',
    inputFields: [genericImage],
    inputValues: {
      prompt: genericImage.defaultValue,
    },
  },
]
