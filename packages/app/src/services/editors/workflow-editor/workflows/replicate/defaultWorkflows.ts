import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'

import {
  genericBaseImageUrl,
  genericDrivingVideo,
  genericFaceImage,
  genericHeight1024,
  genericHeight2048,
  genericImage,
  genericImageUrl,
  genericLora,
  genericPrompt,
  genericSwapImage,
  genericSwapImageUrl,
  genericTargetImage,
  genericVideo,
  genericWidth1024,
  genericWidth2048,
} from '../common/defaultValues'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
export const defaultWorkflows: ClapWorkflow[] = [
  {
    id: 'replicate://fofr/live-portrait',
    label: 'Live Portrait by @fofr',
    description: '',
    tags: ['live portrait'],
    author: '@fofr',
    thumbnailUrl: '',
    nonCommercial: true,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    provider: ClapWorkflowProvider.REPLICATE,
    data: 'fofr/live-portrait:067dd98cc3e5cb396c4a9efb4bba3eec6c4a9d271211325c477518fc6485e146',
    schema: '',
    inputFields: [genericFaceImage, genericDrivingVideo],
    inputValues: {
      [genericFaceImage.id]: genericFaceImage.defaultValue,
      [genericDrivingVideo.id]: genericDrivingVideo.defaultValue,

      // there are a lot of other params, check them here:
      // https://replicate.com/fofr/live-portrait
    },
  },
  {
    id: 'replicate://cdingram/face-swap',
    label: 'Face Swap by @cdingram',
    description: '',
    tags: ['face-swap'],
    author: '@cdingram',
    thumbnailUrl: '',
    nonCommercial: true,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.IMAGE_FACESWAP,
    provider: ClapWorkflowProvider.REPLICATE,
    data: 'cdingram/face-swap:d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111',
    schema: '',
    inputFields: [
      {
        ...genericTargetImage,
        id: 'input_image',
      },
      genericSwapImage,
    ],
    inputValues: {
      input_image: genericTargetImage.defaultValue,
      [genericSwapImage.id]: genericSwapImage.defaultValue,
    },
  },
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
