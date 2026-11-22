import { ClapWorkflowCategory } from '@aitube/clap'

import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'

export const defaultComfyWorkflowForVoiceJson = JSON.stringify({
  '1': {
    inputs: {
      text: '@clapper/prompt',
      language: 'en',
      speaker_wav: 'default_speaker.wav',
      temperature: 0.65,
      speed: 1.0,
      seed: 42,
    },
    class_type: 'XTTS_VoiceGeneration',
    _meta: {
      title: 'XTTS Voice Generation',
    },
  },
  '2': {
    inputs: {
      filename_prefix: 'ComfyUI_Voice',
      audio: ['1', 0],
    },
    class_type: 'SaveAudio',
    _meta: {
      title: 'Save Audio',
    },
  },
})

export const defaultWorkflowForVoice = convertComfyUiWorkflowApiToClapWorkflow(
  defaultComfyWorkflowForVoiceJson,
  ClapWorkflowCategory.VOICE_GENERATION
)
