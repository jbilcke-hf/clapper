import {
  ClapWorkflow,
  ClapWorkflowEngine,
  ClapWorkflowCategory,
  ClapWorkflowProvider,
} from '@aitube/clap'
import {
  genericHeight2048,
  genericPrompt,
  genericWidth2048,
} from '../common/defaultValues'

export const huggingfaceWorkflows: ClapWorkflow[] = [
  {
    id: 'huggingface://models/black-forest-labs/FLUX.1-schnell',
    label: 'FLUX.1 [schnell]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'black-forest-labs/FLUX.1-schnell',
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'black-forest-labs/FLUX.1-dev',
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
    id: 'huggingface://models/jbilcke-hf/flux-dev-panorama-lora-2',
    label: 'FLUX.1-[dev] Panorama Lora (v2)',
    description: 'Generate 360° panoramas using Flux (non-commercial use)',
    tags: ['flux', '360°', 'panorama'],
    author: '@jbilcke-hf',
    // TODO add specific field about licensing?
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'jbilcke-hf/flux-dev-panorama-lora-2',
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'coqui/XTTS-v2',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'myshell-ai/OpenVoiceV2',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'myshell-ai/OpenVoice',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'WhisperSpeech/WhisperSpeech',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'metavoiceio/metavoice-1B-v0.1',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'parler-tts/parler_tts_mini_v0.1',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'parler-tts/parler-tts-mini-expresso',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.ASSISTANT,
    data: 'HuggingFaceH4/zephyr-7b-beta',
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.ASSISTANT,
    data: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
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
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.HUGGINGFACE,
    category: ClapWorkflowCategory.MUSIC_GENERATION,
    data: 'cvssp/audioldm2-music',
    // Inputs of the workflow (this is used to build an UI for the automatically)
    inputFields: [
      genericPrompt,
    ],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  */
]
