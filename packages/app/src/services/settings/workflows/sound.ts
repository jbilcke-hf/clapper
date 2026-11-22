import { ClapWorkflowCategory } from '@aitube/clap'

import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'

export const defaultComfyWorkflowForSoundJson = JSON.stringify({
  '1': {
    inputs: {
      ckpt_name: 'stable_audio_open_1.0.safetensors',
    },
    class_type: 'CheckpointLoaderSimple',
    _meta: {
      title: 'Load Stable Audio Checkpoint',
    },
  },
  '2': {
    inputs: {
      text: 'cinematic sound effect, foley, high quality audio',
      clip: ['1', 1],
    },
    class_type: 'CLIPTextEncode',
    _meta: {
      title: 'CLIP Text Encode (Positive)',
    },
  },
  '3': {
    inputs: {
      text: 'low quality, noise, distortion, clipping',
      clip: ['1', 1],
    },
    class_type: 'CLIPTextEncode',
    _meta: {
      title: 'CLIP Text Encode (Negative)',
    },
  },
  '4': {
    inputs: {
      seconds: 5.0,
      batch_size: 1,
    },
    class_type: 'EmptyLatentAudio',
    _meta: {
      title: 'Empty Latent Audio',
    },
  },
  '5': {
    inputs: {
      seed: 156680208700286,
      steps: 25,
      cfg: 6.0,
      sampler_name: 'dpmpp_3m_sde',
      scheduler: 'exponential',
      denoise: 1,
      model: ['1', 0],
      positive: ['2', 0],
      negative: ['3', 0],
      latent_image: ['4', 0],
    },
    class_type: 'KSampler',
    _meta: {
      title: 'KSampler',
    },
  },
  '6': {
    inputs: {
      samples: ['5', 0],
      vae: ['1', 2],
    },
    class_type: 'VAEDecodeAudio',
    _meta: {
      title: 'VAE Decode Audio',
    },
  },
  '7': {
    inputs: {
      filename_prefix: 'ComfyUI_Sound',
      audio: ['6', 0],
    },
    class_type: 'SaveAudio',
    _meta: {
      title: 'Save Audio',
    },
  },
})

export const defaultWorkflowForSound = convertComfyUiWorkflowApiToClapWorkflow(
  defaultComfyWorkflowForSoundJson,
  ClapWorkflowCategory.SOUND_GENERATION
)
