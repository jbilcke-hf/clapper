import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
  ClapInputCategory,
} from '@aitube/clap'

import {
  genericAudio,
  genericBaseImageUrl,
  genericDrivingVideo,
  genericFaceImage,
  genericGuidanceScale,
  genericHeight1024,
  genericHeight2048,
  genericIdWeight,
  genericImage,
  genericImageUrl,
  genericInferenceSteps,
  genericLora,
  genericNegativePrompt,
  genericPrompt,
  genericReferenceImages,
  genericSeed,
  genericStartStep,
  genericSwapImage,
  genericSwapImageUrl,
  genericTargetImage,
  genericTrueCFG,
  genericVideo,
  genericWidth1024,
  genericWidth2048,
} from '../common/defaultValues'
import { sampleDrivingVideo } from '@/lib/core/constants'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
export const defaultWorkflows: ClapWorkflow[] = [
  {
    // see https://replicate.com/zsxkib/flux-pulid
    id: 'replicate://zsxkib/flux-pulid',
    label: 'FLUX PuLID by @zsxkib',
    description: '',
    tags: ['flux'],
    author: 'zsxkib (https://replicate.com/zsxkib)',
    thumbnailUrl:
      'https://replicate.delivery/yhqm/62V15z9KebyTaKt3lAXjO00CwnM2TehXq3Heo22ZRhvGwB5mA/output.webp',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.REPLICATE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'zsxkib/flux-pulid:8baa7ef2255075b46f4d91cd238c21d31181b3e6a864463f967960bb0112525b',
    schema: '',
    /**
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
     */
    inputFields: [
      {
        ...genericReferenceImages,
        id: 'main_face_image',
      },
      genericPrompt,
      genericNegativePrompt,
      genericWidth2048,
      genericHeight2048,
      {
        id: 'num_steps',
        label: 'Inference steps',
        description: 'Number of inference steps',
        category: ClapInputCategory.ITERATION_STEPS,
        type: 'number',
        minValue: 1,
        maxValue: 20,
        defaultValue: 20, // <- note the def value override
      },
      genericStartStep,
      genericGuidanceScale,
      genericIdWeight,
      genericSeed,
      genericTrueCFG,
    ],
    inputValues: {
      main_face_image: genericReferenceImages.defaultValue,
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericNegativePrompt.id]: genericNegativePrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,
      num_steps: 20, // <- note the def value override
      [genericStartStep.id]: genericGuidanceScale.defaultValue,
      [genericGuidanceScale.id]: genericGuidanceScale.defaultValue,
      [genericIdWeight.id]: genericIdWeight.defaultValue,
      [genericSeed.id]: genericSeed.defaultValue,
      [genericTrueCFG.id]: genericTrueCFG.defaultValue,
    },
  },
  {
    id: 'replicate://cuuupid/cogvideox-5b',
    label: 'CogVideoX-5b by @cuuupid',
    description: '',
    tags: ['video generation'],
    author: '@cuuupid',
    thumbnailUrl: '',
    nonCommercial: true,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    provider: ClapWorkflowProvider.REPLICATE,
    data: 'cuuupid/cogvideox-5b',
    schema: '',
    // for more info: https://replicate.com/cuuupid/cogvideox-5b
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
  {
    id: 'replicate://douwantech/musetalk',
    label: 'MuseTalk by @douwantech',
    description: '',
    tags: ['lipsync', 'musetalk'],
    author: '@douwantech',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.VIDEO_LIPSYNC,
    provider: ClapWorkflowProvider.REPLICATE,
    data: 'douwantech/musetalk:5501004e78525e4bbd9fa20d1e75ad51fddce5a274bec07b9b16d685e34eeaf8',
    schema: '',
    inputFields: [
      {
        ...genericVideo,
        id: 'video_input',
      },
      {
        ...genericAudio,
        id: 'audio_input',
      },
    ],
    inputValues: {
      video_input: genericVideo.defaultValue,
      audio_input: genericAudio.defaultValue,

      // see https://replicate.com/douwantech/musetalk
      // other params include:
      // bbox_shift (0)
      // fps (25)
    },
  },
  {
    id: 'replicate://chenxwh/video-retalking',
    label: 'Video Retalking by @chenxwh',
    description: '',
    tags: ['lipsync', 'video retalking'],
    author: '@chenxwh',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    category: ClapWorkflowCategory.VIDEO_LIPSYNC,
    provider: ClapWorkflowProvider.REPLICATE,
    data: 'chenxwh/video-retalking:db5a650c807b007dc5f9e5abe27c53e1b62880d1f94d218d27ce7fa802711d67',
    schema: '',
    inputFields: [
      {
        ...genericVideo,
        id: 'face',
      },
      {
        ...genericAudio,
        id: 'input_audio',
      },
    ],
    inputValues: {
      face: genericVideo.defaultValue,
      input_audio: genericAudio.defaultValue,
    },
  },
  {
    // https://replicate.com/fofr/live-portrait

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
    inputFields: [
      genericFaceImage,
      genericDrivingVideo,
      {
        id: 'video_select_every_n_frames',
        label: 'Select every nth frame',
        description:
          'Select every nth frame from the driving video. Set to 1 to use all frames.',
        category: ClapInputCategory.UNKNOWN,
        type: 'number',
        minValue: 1,
        maxValue: Number.MAX_SAFE_INTEGER,
        defaultValue: 1,
      },
      {
        id: 'live_portrait_dsize',
        label: 'Live portrait dsize',
        description: 'Size of the output image',
        category: ClapInputCategory.UNKNOWN,
        type: 'number',
        minValue: 64,
        maxValue: 2048,
        defaultValue: 512,
      },
      {
        id: 'live_portrait_scale',
        label: 'Live portrait live_portrait_scale',
        description: 'Scaling factor for the face',
        category: ClapInputCategory.UNKNOWN,
        type: 'number',
        minValue: 1,
        maxValue: 4,
        defaultValue: 2.3,
      },
      {
        id: 'live_portrait_stitching',
        label: 'Live portrait stitching',
        description: 'Enable stitching',
        category: ClapInputCategory.UNKNOWN,
        type: 'boolean',
        defaultValue: true,
      },
      {
        id: 'live_portrait_relative',
        label: 'Live portrait relative',
        description: 'Use relative positioning',
        category: ClapInputCategory.UNKNOWN,
        type: 'boolean',
        defaultValue: true,
      },
    ],
    inputValues: {
      [genericFaceImage.id]: genericFaceImage.defaultValue,
      [genericDrivingVideo.id]: genericDrivingVideo.defaultValue,
      video_select_every_n_frames: 1,
      live_portrait_dsize: 512,
      live_portrait_scale: 2.3,
      live_portrait_stitching: true,
      live_portrait_relative: true,
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
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
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
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
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
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
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
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
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
     * Inputs of the workflow (this is used to build an UI for the workflow automatically)
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
