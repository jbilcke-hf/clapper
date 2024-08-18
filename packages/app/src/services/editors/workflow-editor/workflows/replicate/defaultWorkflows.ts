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
  genericLora,
  genericPrompt,
  genericVideo,
  genericWidth1024,
  genericWidth2048,
} from '../common/defaultValues'

export const defaultWorkflows: ClapWorkflow[] = [
  {
    id: 'replicate://lucataco/flux-dev-lora',
    label: 'Flux-dev-lora',
    description: '',
    tags: ['flux'],
    author: '@lucataco',
    thumbnailUrl: '',
    nonCommercial: true,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    provider: ClapWorkflowProvider.REPLICATE,
    data: 'lucataco/flux-dev-lora',
    schema: '',
    // data: 'lucataco/flux-dev-lora:94a0c19e55e36f75d657ecf9eada9f16a233b5329fb9cdf8e2b9ecd093e5c97e',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericPrompt,
      genericWidth2048,
      genericHeight2048,
      {
        ...genericLora,
        id: 'hf_lora',
      },
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth2048.defaultValue,
      height: genericHeight2048.defaultValue,
      hf_lora: genericLora.defaultValue,
    },
  },
  {
    id: 'replicate://black-forest-labs/flux-pro',
    label: 'Flux-pro',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    provider: ClapWorkflowProvider.REPLICATE,
    data: 'black-forest-labs/flux-pro',
    schema: '',
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
    label: 'Flux-schnell',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'black-forest-labs/flux-schnell',
    schema: '',
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
    label: 'Flux-dev',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: true,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'black-forest-labs/flux-dev',
    schema: '',
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'stability-ai/fast-sdxl',
    schema: '',
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'chenxwh/openvoice',
    schema: '',
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.VIDEO_UPSCALING,
    data: 'lucataco/real-esrgan-video',
    schema: '',
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.IMAGE_UPSCALING,
    data: 'nightmareai/real-esrgan',
    schema: '',
    inputFields: [genericImage],
    inputValues: {
      prompt: genericImage.defaultValue,
    },
  },
]
