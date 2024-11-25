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
  genericVideoUrl,
  genericWidth1024,
  genericWidth2048,
  genericMotionBucketId,
  genericConditioningAugmentation,
  genericUpscalingFactor,
  genericOverlappingTiles,
  genericInferenceSteps,
  genericImageUrl,
  genericLora,
  genericLoras,
  genericReferenceImages,
  genericBaseImageUrl,
  genericSwapImageUrl,
} from '../common/defaultValues'
import { sampleDrivingVideo, sampleVoice } from '@/lib/core/constants'

/*

TODO: add those as well

"fal-ai/photomaker",
"fal-ai/image-to-image",
"fal-ai/omni-zero",

*/

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
export const defaultWorkflows: ClapWorkflow[] = [
  {
    id: 'falai://fal-ai/kling-video/v1/standard/text-to-video',
    label: 'Kling 1.0',
    description: '',
    tags: ['video generation'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: true,

    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'fal-ai/kling-video/v1/standard/text-to-video',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/runway-gen3/turbo/image-to-video',
    label: 'RunwayML Gen 3',
    description: '',
    tags: ['video generation'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: true,

    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'fal-ai/runway-gen3/turbo/image-to-video',
    schema: '',
    inputFields: [genericPrompt, genericImageUrl],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericImageUrl.id]: genericImageUrl.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/cogvideox-5b',
    label: 'CogVideoX-5b',
    description: '',
    tags: ['video generation'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: true,

    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'fal-ai/face-swap',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/face-swap',
    label: 'Face Swap',
    description: '',
    tags: ['image'],
    author: '',
    thumbnailUrl: '',

    // they are using Roop, no? is it why it's for "research only"?
    // https://fal.ai/models/fal-ai/face-swap
    nonCommercial: true,

    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_FACESWAP,
    data: 'fal-ai/face-swap',
    schema: '',
    inputFields: [genericBaseImageUrl, genericSwapImageUrl],
    inputValues: {
      [genericBaseImageUrl.id]: genericBaseImageUrl.defaultValue,
      [genericSwapImageUrl.id]: genericSwapImageUrl.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/pulid',
    label: 'PuLID (with Flux Schnell fallback)',
    description: '',
    tags: ['image'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/pulid',
    schema: '',
    inputFields: [genericPrompt, genericReferenceImages],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericReferenceImages.id]: genericReferenceImages.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/stable-video',
    label: 'Stable Video Diffusion',
    description: '',
    tags: ['video'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'fal-ai/stable-video',
    schema: '',
    inputFields: [
      genericImageUrl,
      genericSeed,
      genericMotionBucketId,
      {
        ...genericConditioningAugmentation,
        id: 'cond_aug',
      },
    ],
    inputValues: {
      [genericImageUrl.id]: genericImageUrl.defaultValue,
      [genericMotionBucketId.id]: 55,
      cond_aug: 0.02,
    },
  },
  {
    id: 'falai://fal-ai/recraft-v3',
    label: 'Recraft v3',
    description: '',
    tags: ['Flux'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/recraft-v3',
    schema: '',
    inputFields: [
      genericPrompt,
      genericWidth2048,
      genericHeight2048,
      //genericInferenceSteps,
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,
      //[genericInferenceSteps.id]: genericInferenceSteps.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/flux-pro/v1.1-ultra',
    label: 'Flux Pro Ultra (v1.1)',
    description: '',
    tags: ['Flux'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-pro/v1.1-ultra',
    schema: '',
    inputFields: [
      genericPrompt,
      genericWidth2048,
      genericHeight2048,
      //genericInferenceSteps,
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,
      //[genericInferenceSteps.id]: genericInferenceSteps.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/flux-general',
    label: 'Flux.1-[DEV] LoRA',
    description: '',
    tags: ['Flux', 'LoRA'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-general',
    schema: '',
    inputFields: [
      genericPrompt,
      genericWidth2048,
      genericHeight2048,
      genericInferenceSteps,
      genericLoras,
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,
      [genericInferenceSteps.id]: genericInferenceSteps.defaultValue,
      genericLoras: genericInferenceSteps.defaultValue,
      // support LoRA for this model is a bit tricky, as the parameter must be in JSON
      // (this is an array of LoraWeight objects, see: https://fal.ai/models/fal-ai/flux-general/playground)
    },
  },
  {
    id: 'falai://fal-ai/flux-realism',
    label: 'Flux Realism LoRA',
    description: '',
    tags: ['flux', 'LoRA', 'realism'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-realism',
    schema: '',
    /**
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
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
    id: 'falai://fal-ai/flux-pro/v1.1',
    label: 'FLUX1.1 [pro]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-pro/v1.1',
    schema: '',
    /**
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
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
  /*
  let's not keep old obsolete models

  {
    id: 'falai://fal-ai/flux-pro/new',
    label: 'FLUX [pro]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-pro/new',
    schema: '',
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
    id: 'falai://fal-ai/flux-pro',
    label: 'FLUX [pro] (obsolete)',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux-pro',
    schema: '',
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
  */
  {
    id: 'falai://fal-ai/flux/schnell',
    label: 'FLUX.1 [schnell]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux/schnell',
    schema: '',
    inputFields: [genericPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth2048.defaultValue,
      height: genericHeight2048.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/flux/dev',
    label: 'FLUX.1 [dev]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/flux/dev',
    schema: '',
    /**
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/fast-sdxl',
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
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth1024.id]: genericWidth1024.defaultValue,
      [genericHeight1024.id]: genericHeight1024.defaultValue,

      // TODO: add guidance scale and number of steps
    },
  },
  {
    id: 'falai://fal-ai/stable-diffusion-v3-medium',
    label: 'SD3 (Medium)',
    description: '',
    tags: ['SD3'],
    author: 'Stability AI',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'fal-ai/stable-diffusion-v3-medium',
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.IMAGE_UPSCALING,
    data: 'fal-ai/aura-sr',
    schema: '',
    inputFields: [
      genericImageUrl,
      genericUpscalingFactor,
      genericOverlappingTiles,
    ],
    inputValues: {
      [genericImageUrl.id]: genericImageUrl.defaultValue,
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'fal-ai/metavoice-v1',
    schema: '',
    inputFields: [genericPrompt, { ...genericAudio, id: 'audio_url' }],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      audio_url: sampleVoice,
    },
  },
  {
    id: 'falai://fal-ai/stable-audio',
    label: 'Stable Audio',
    description: '',
    tags: ['audio', 'sound'],
    author: 'Stability AI',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.SOUND_GENERATION,
    data: 'fal-ai/stable-audio',
    schema: '',
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
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.MUSIC_GENERATION,
    data: 'fal-ai/stable-audio',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
  {
    id: 'falai://fal-ai/live-portrait',
    label: 'Live Portrait',
    description: 'For research only',
    tags: ['live portrait'],
    author: 'https://github.com/KwaiVGI/LivePortrait',
    thumbnailUrl:
      'https://github.com/KwaiVGI/LivePortrait/raw/main/assets/docs/showcase2.gif',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.FALAI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'fal-ai/live-portrait',
    schema: '',
    inputFields: [genericImageUrl, genericVideoUrl],
    inputValues: {
      [genericImageUrl.id]: genericImageUrl.defaultValue,
      [genericVideoUrl.id]: sampleDrivingVideo,
    },
  },
]
