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

export const elevenlabsWorkflows: ClapWorkflow[] = [
  {
    id: 'elevenlabs://v1/text-to-speech',
    label: 'Text-to-Speech V1',
    description: '',
    tags: ['TTS'],
    author: 'ElevenLabs',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.ELEVENLABS,
    category: ClapWorkflowCategory.VOICE_GENERATION,
    data: 'v1/text-to-speech',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [genericPrompt],
    inputValues: {
      prompt: genericPrompt.defaultValue,
    },
  },
  {
    id: 'elevenlabs://v1/sound-generation',
    label: 'Sound Generation V1',
    description: '',
    tags: ['sound'],
    author: 'ElevenLabs',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.ELEVENLABS,
    category: ClapWorkflowCategory.SOUND_GENERATION,
    data: 'v1/sound-generation',
    /**
     * Inputs of the workflow (this is used to build an UI for the automatically)
     */
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
]
