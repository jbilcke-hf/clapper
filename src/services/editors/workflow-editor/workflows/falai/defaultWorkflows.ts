import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'

import {
  genericAudio,
  genericHeight1024,
  genericHeight2048,
  genericImage,
  genericInput,
  genericSeed,
  genericPrompt,
  genericVideo,
  genericWidth1024,
  genericWidth2048,
  genericMotionBucketId,
  genericConditioningAugmentation,
  genericUpscalingFactor,
  genericOverlappingTiles,
  genericInferenceSteps,
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
    id: 'falai://fal-ai/stable-video',
    label: 'Stable Video Diffusion',
    description: '',
    tags: ['video'],
    author: '',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'fal-ai/stable-video',
    inputFields: [
      {
        ...genericImage,
        id: 'image_url',
      },
      genericSeed,
      genericMotionBucketId,
      {
        ...genericConditioningAugmentation,
        id: 'cond_aug',
      },
    ],
    inputValues: {
      image_url: genericImage.defaultValue,
      [genericMotionBucketId.id]: 55,
      cond_aug: 0.02,
    },
  },
  {
    id: 'falai://fal-ai/flux-realism',
    label: 'Flux Realism LoRA',
    description: '',
    tags: ['flux', 'LoRA', 'realism'],
    author: '',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-realism',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [
      genericPrompt,
      genericWidth2048,
      genericHeight2048,
      genericInferenceSteps,
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,
      [genericInferenceSteps.id]: genericInferenceSteps.defaultValue,
    },
  },
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
      genericPrompt,
      genericWidth2048,
      genericHeight2048,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,

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
    inputFields: [genericPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      prompt: genericPrompt.defaultValue,
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
      genericPrompt,
      genericWidth2048,
      genericHeight2048,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,

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
      genericPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth1024.id]: genericWidth1024.defaultValue,
      [genericHeight1024.id]: genericHeight1024.defaultValue,

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
      genericPrompt,
      genericWidth1024,
      genericHeight1024,

      // TODO: add guidance scale and number of steps
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth1024.id]: genericWidth1024.defaultValue,
      [genericHeight1024.id]: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'falai://fal-ai/aura-sr',
    label: 'MetaVoice V1',
    description: '',
    tags: ['upscaling'],
    author: 'AuraSR',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_UPSCALING,
    data: 'fal-ai/aura-sr',
    inputFields: [
      {
        ...genericImage,
        id: 'image_url',
      },
      genericUpscalingFactor,
      genericOverlappingTiles,
    ],
    inputValues: {
      image_url: genericImage.defaultValue,
      [genericUpscalingFactor.id]: genericUpscalingFactor.defaultValue,
      [genericOverlappingTiles.id]: genericOverlappingTiles.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/metavoice-v1',
    label: 'MetaVoice V1',
    description: '',
    tags: ['TTS'],
    author: 'MetaVoice (themetavoice.xyz)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'fal-ai/metavoice-v1',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [genericPrompt, { ...genericAudio, id: 'audio_url' }],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,

      // TODO: this should be our own voice instead
      // PS: are you implementing this task? please do a search in the code for speakers/bria.mp3
      audio_url: 'https://cdn.themetavoice.xyz/speakers/bria.mp3',
    },
  },
  {
    id: 'falai://fal-ai/stable-audio',
    label: 'Stable Audio',
    description: '',
    tags: ['audio', 'sound'],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.SOUND_GENERATION,
    data: 'fal-ai/stable-audio',
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/stable-audio',
    label: 'Stable Audio',
    description: '',
    tags: ['audio', 'music'],
    author: 'Stability AI',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.MUSIC_GENERATION,
    data: 'fal-ai/stable-audio',
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
]
