import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'
import {
  genericDuration,
  genericFPS,
  genericHeight1024,
  genericHeight2048,
  genericPrompt,
  genericSeed,
  genericWidth1024,
  genericWidth2048,
} from '../common/defaultValues'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
export const huggingfaceWorkflows: ClapWorkflow[] = [
  {
    // for now let's use a basic system where we use a hard-coded Gradio server
    id: 'huggingface://spaces/jbilcke-hf/fast-rendering-node-for-clapper',
    label: 'Fast rendering node',
    description:
      'A fast but low-quality public rendering node (might be shutdown anytime)',
    tags: ['Wan', 'Wan2.1 1.3B'],
    author: 'Julian Bilcke',
    thumbnailUrl: '',
    nonCommercial: true,
    engine: ClapWorkflowEngine.GRADIO_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'jbilcke-hf/fast-rendering-node-for-clapper',
    schema: '',
    inputFields: [
      genericPrompt,
      genericSeed,
      genericFPS,
      genericWidth1024,
      genericHeight1024,
      genericDuration,
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      seed: genericSeed.defaultValue,
      width: genericWidth1024.defaultValue,
      height: genericHeight1024.defaultValue,
      duration: genericDuration.defaultValue,
    },
  },
  {
    id: 'huggingface://models/black-forest-labs/FLUX.1-schnell',
    label: 'FLUX.1 [schnell]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'black-forest-labs/FLUX.1-schnell',
    schema: '',
    inputFields: [genericPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth2048.defaultValue,
      height: genericHeight2048.defaultValue,
    },
  },
  {
    id: 'huggingface://models/black-forest-labs/FLUX.1-dev',
    label: 'FLUX.1 [dev]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'black-forest-labs/FLUX.1-dev',
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
    id: 'huggingface://models/jbilcke-hf/flux-dev-panorama-lora-2',
    label: 'FLUX.1-[dev] Panorama Lora (v2)',
    description: 'Generate 360° panoramas using Flux (non-commercial use)',
    tags: ['flux', '360°', 'panorama'],
    author: '@jbilcke-hf',
    // TODO add specific field about licensing?
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'jbilcke-hf/flux-dev-panorama-lora-2',
    schema: '',
    inputFields: [genericPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      prompt: genericPrompt.defaultValue,
      width: genericWidth2048.defaultValue,
      height: genericHeight2048.defaultValue,
    },
  },
  {
    id: 'huggingface://models/coqui/XTTS-v2',
    label: 'Coqui XTTS-v2',
    description: '',
    tags: ['TTS'],
    author: 'Coqui',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'coqui/XTTS-v2',
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
    id: 'huggingface://models/myshell-ai/OpenVoiceV2',
    label: 'MyShell.ai OpenVoiceV2',
    description: '',
    tags: ['TTS'],
    author: 'MyShell.ai',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'myshell-ai/OpenVoiceV2',
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
    id: 'huggingface://models/myshell-ai/OpenVoice',
    label: 'MyShell.ai OpenVoice',
    description: '',
    tags: ['TTS'],
    author: 'MyShell.ai',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'myshell-ai/OpenVoice',
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
    id: 'huggingface://models/WhisperSpeech/WhisperSpeech',
    label: 'WhisperSpeech',
    description: '',
    tags: ['TTS'],
    author: 'WhisperSpeech',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'WhisperSpeech/WhisperSpeech',
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
    id: 'huggingface://models/metavoiceio/metavoice-1B-v0.1',
    label: 'MetaVoice 1B v0.1',
    description: '',
    tags: ['TTS'],
    author: 'MetaVoice (themetavoice.xyz)',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'metavoiceio/metavoice-1B-v0.1',
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
    id: 'huggingface://models/parler-tts/parler_tts_mini_v0.1',
    label: 'ParlerTTS Mini v0.1',
    description: '',
    tags: ['TTS'],
    author: 'ParlerTTS',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'parler-tts/parler_tts_mini_v0.1',
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
    id: 'huggingface://models/parler-tts/parler-tts-mini-expresso',
    label: 'ParlerTTS Mini Expresso v0.1',
    description: '',
    tags: ['TTS'],
    author: 'ParlerTTS',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'parler-tts/parler-tts-mini-expresso',
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
    id: 'huggingface://models/HuggingFaceH4/zephyr-7b-beta',
    label: 'Zephyr 7b (beta)',
    description: '',
    tags: ['Zephyr'],
    author: 'Hugging Face H4',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.ASSISTANT,
    data: 'HuggingFaceH4/zephyr-7b-beta',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'huggingface://models/mistralai/Mixtral-8x7B-Instruct-v0.1',
    label: 'Mixtral 8x7b (Instruct 0.1)',
    description: '',
    tags: ['Zephyr'],
    author: 'Mistral AI',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.ASSISTANT,
    data: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  /*
  {
    id: 'huggingface://models/cvssp/audioldm2-music',
    label: 'CVSSP AudioLDM2 Music',
    description: '',
    tags: ['music'],
    author: 'CVSSP',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.MUSIC_GENERATION,
    data: 'cvssp/audioldm2-music',
    schema: '',
    // Inputs of the workflow (this is used to build an UI for the workflow automatically)
    inputFields: [
      genericPrompt,
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  */
]
