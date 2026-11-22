import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

import { genericImage, genericPrompt } from '../common/defaultValues'
import { text_to_image_demo_workflow } from '../common/comfyui/text_to_image_demo_workflow'
import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/convertComfyUiWorkflowApiToClapWorkflow'
import { ComfyUiWorkflowPreset } from '@/app/api/resolve/providers/comfyui/types'
import { defaultWorkflowForImages } from '@/services/settings/workflows/image'
import { defaultWorkflowForVideos } from '@/services/settings/workflows/video'
import {
  defaultComfyWorkflowForVoiceJson,
  defaultWorkflowForVoice,
} from '@/services/settings/workflows/voice'
import {
  defaultComfyWorkflowForSoundJson,
  defaultWorkflowForSound,
} from '@/services/settings/workflows/sound'
import {
  defaultComfyWorkflowForMusicJson,
  defaultWorkflowForMusic,
} from '@/services/settings/workflows/music'

export const fluxSchnellWorkflowJson = JSON.stringify({
  '5': {
    inputs: { width: 1024, height: 1024, batch_size: 1 },
    class_type: 'EmptyLatentImage',
    _meta: { title: 'Empty Latent Image' },
  },
  '6': {
    inputs: {
      clip: ['11', 0],
      text: 'cinematic film still, intricate details, dramatic lighting',
    },
    class_type: 'CLIPTextEncode',
    _meta: { title: 'CLIP Text Encode (Positive Prompt)' },
  },
  '8': {
    inputs: { vae: ['10', 0], samples: ['13', 0] },
    class_type: 'VAEDecode',
    _meta: { title: 'VAE Decode' },
  },
  '9': {
    inputs: { images: ['8', 0], filename_prefix: 'ComfyUI_Flux' },
    class_type: 'SaveImage',
    _meta: { title: 'Save Image' },
  },
  '10': {
    inputs: { vae_name: 'flux1-ae.safetensors' },
    class_type: 'VAELoader',
    _meta: { title: 'Load VAE' },
  },
  '11': {
    inputs: {
      type: 'flux',
      clip_name1: 't5xxl_fp16.safetensors',
      clip_name2: 'clip_l.safetensors',
    },
    class_type: 'DualCLIPLoader',
    _meta: { title: 'DualCLIPLoader' },
  },
  '12': {
    inputs: {
      unet_name: 'flux1-schnell.safetensors',
      weight_dtype: 'default',
    },
    class_type: 'UNETLoader',
    _meta: { title: 'Load Diffusion Model' },
  },
  '13': {
    inputs: {
      noise: ['25', 0],
      guider: ['22', 0],
      sigmas: ['17', 0],
      sampler: ['16', 0],
      latent_image: ['5', 0],
    },
    class_type: 'SamplerCustomAdvanced',
    _meta: { title: 'SamplerCustomAdvanced' },
  },
  '16': {
    inputs: { sampler_name: 'euler' },
    class_type: 'KSamplerSelect',
    _meta: { title: 'KSamplerSelect' },
  },
  '17': {
    inputs: { model: ['12', 0], steps: 4, denoise: 1, scheduler: 'simple' },
    class_type: 'BasicScheduler',
    _meta: { title: 'BasicScheduler' },
  },
  '22': {
    inputs: { model: ['12', 0], conditioning: ['6', 0] },
    class_type: 'BasicGuider',
    _meta: { title: 'BasicGuider' },
  },
  '25': {
    inputs: { noise_seed: 24016052484185 },
    class_type: 'RandomNoise',
    _meta: { title: 'RandomNoise' },
  },
})

export const animateDiffVideoWorkflowJson = JSON.stringify({
  '1': {
    inputs: { ckpt_name: 'v1-5-pruned-emaonly.ckpt' },
    class_type: 'CheckpointLoaderSimple',
    _meta: { title: 'Load Checkpoint' },
  },
  '2': {
    inputs: {
      model_name: 'mm_sd_v15_v2.ckpt',
      beta_schedule: 'sqrt_linear (AnimateDiff)',
      model: ['1', 0],
    },
    class_type: 'ADE_AnimateDiffLoaderWithContext',
    _meta: { title: 'AnimateDiff Loader' },
  },
  '3': {
    inputs: {
      text: 'cinematic camera pan, high quality animation',
      clip: ['1', 1],
    },
    class_type: 'CLIPTextEncode',
    _meta: { title: 'CLIP Text Encode (Positive)' },
  },
  '4': {
    inputs: {
      text: 'blurry, watermark, static, distorted',
      clip: ['1', 1],
    },
    class_type: 'CLIPTextEncode',
    _meta: { title: 'CLIP Text Encode (Negative)' },
  },
  '5': {
    inputs: { width: 512, height: 512, batch_size: 16 },
    class_type: 'EmptyLatentImage',
    _meta: { title: 'Empty Latent Batch' },
  },
  '6': {
    inputs: {
      seed: 156680208700286,
      steps: 20,
      cfg: 7.5,
      sampler_name: 'euler',
      scheduler: 'normal',
      denoise: 1,
      model: ['2', 0],
      positive: ['3', 0],
      negative: ['4', 0],
      latent_image: ['5', 0],
    },
    class_type: 'KSampler',
    _meta: { title: 'KSampler' },
  },
  '7': {
    inputs: { samples: ['6', 0], vae: ['1', 2] },
    class_type: 'VAEDecode',
    _meta: { title: 'VAE Decode' },
  },
  '8': {
    inputs: {
      frame_rate: 8,
      loop_count: 0,
      filename_prefix: 'ComfyUI_AnimateDiff',
      format: 'video/h264-mp4',
      pix_fmt: 'yuv420p',
      crf: 19,
      save_metadata: false,
      pingpong: false,
      save_output: true,
      images: ['7', 0],
    },
    class_type: 'VHS_VideoCombine',
    _meta: { title: 'Video Combine' },
  },
})

export const comfyuiWorkflowPresets: ComfyUiWorkflowPreset[] = [
  {
    id: 'comfyui://preset/sdxl-flash-t2i',
    label: 'SDXL Flash (Text-to-Image)',
    description: 'Fast 10-step SDXL Flash text-to-image generation pipeline',
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    author: 'ComfyUI Community',
    tags: ['sdxl', 'flash', 'image'],
    data: defaultWorkflowForImages.data,
  },
  {
    id: 'comfyui://preset/flux-schnell-t2i',
    label: 'FLUX.1 Schnell (Text-to-Image)',
    description: '4-step FLUX.1 Schnell text-to-image workflow with DualCLIP',
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    author: 'Black Forest Labs / ComfyUI',
    tags: ['flux', 'schnell', 'image'],
    data: fluxSchnellWorkflowJson,
  },
  {
    id: 'comfyui://preset/sd15-standard-t2i',
    label: 'SD 1.5 Standard (Text-to-Image)',
    description: 'Classic Stable Diffusion 1.5 KSampler workflow',
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    author: 'ComfyUI',
    tags: ['sd15', 'image'],
    data: JSON.stringify(text_to_image_demo_workflow),
  },
  {
    id: 'comfyui://preset/svd-img2vid',
    label: 'Stable Video Diffusion (Image-to-Video)',
    description:
      'SVD image-to-video conditioning with Base64 image input and VHS Video Combine',
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    author: 'ComfyUI Community',
    tags: ['svd', 'img2vid', 'video'],
    data: defaultWorkflowForVideos.data,
  },
  {
    id: 'comfyui://preset/animatediff-t2v',
    label: 'AnimateDiff (Text-to-Video)',
    description: 'AnimateDiff 16-frame motion module video generation pipeline',
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    author: 'ComfyUI Community',
    tags: ['animatediff', 'txt2vid', 'video'],
    data: animateDiffVideoWorkflowJson,
  },
  {
    id: 'comfyui://preset/xtts-voice',
    label: 'XTTS v2 Voice Synthesis',
    description: 'Neural text-to-speech voice synthesis workflow',
    category: ClapWorkflowCategory.VOICE_GENERATION,
    author: 'ComfyUI Community',
    tags: ['xtts', 'tts', 'voice'],
    data: defaultComfyWorkflowForVoiceJson,
  },
  {
    id: 'comfyui://preset/stable-audio-sfx',
    label: 'Stable Audio Open (Sound FX)',
    description: 'Text-to-sound-effects workflow using Stable Audio Open 1.0',
    category: ClapWorkflowCategory.SOUND_GENERATION,
    author: 'Stability AI / ComfyUI',
    tags: ['stable-audio', 'sfx', 'sound'],
    data: defaultComfyWorkflowForSoundJson,
  },
  {
    id: 'comfyui://preset/stable-audio-music',
    label: 'Stable Audio Open (Music)',
    description: 'Text-to-music stereo soundtrack generation workflow',
    category: ClapWorkflowCategory.MUSIC_GENERATION,
    author: 'Stability AI / ComfyUI',
    tags: ['stable-audio', 'music'],
    data: defaultComfyWorkflowForMusicJson,
  },
]

export function getComfyUiWorkflowPresetsForCategory(
  category: ClapWorkflowCategory
): ComfyUiWorkflowPreset[] {
  return comfyuiWorkflowPresets.filter((p) => p.category === category)
}

export const comfyuiWorkflows: ClapWorkflow[] = comfyuiWorkflowPresets.map(
  (preset) => {
    const converted = convertComfyUiWorkflowApiToClapWorkflow(
      preset.data,
      preset.category
    )
    return {
      ...converted,
      id: preset.id,
      label: preset.label,
      description: preset.description,
      tags: preset.tags,
      author: preset.author,
    }
  }
)

function buildDynamicWorkflowFromJson(
  rawJson: string | undefined,
  fallbackWorkflow: ClapWorkflow,
  category: ClapWorkflowCategory
): ClapWorkflow {
  if (rawJson && rawJson.trim() && rawJson.trim() !== '{}') {
    try {
      return convertComfyUiWorkflowApiToClapWorkflow(rawJson, category)
    } catch {}
  }
  return structuredClone(fallbackWorkflow)
}

export async function getDynamicComfyuiWorkflows(): Promise<ClapWorkflow[]> {
  const { useSettings } = await import('@/services/settings')
  const settings = useSettings.getState()

  const voiceWorkflow = buildDynamicWorkflowFromJson(
    settings.comfyWorkflowForVoice,
    defaultWorkflowForVoice,
    ClapWorkflowCategory.VOICE_GENERATION
  )

  const musicWorkflow = buildDynamicWorkflowFromJson(
    settings.comfyWorkflowForMusic,
    defaultWorkflowForMusic,
    ClapWorkflowCategory.MUSIC_GENERATION
  )

  const soundWorkflow = buildDynamicWorkflowFromJson(
    settings.comfyWorkflowForSound,
    defaultWorkflowForSound,
    ClapWorkflowCategory.SOUND_GENERATION
  )

  const workflows: ClapWorkflow[] = [
    {
      id: 'comfyui://settings.comfyWorkflowForImage',
      label: 'Custom Image Workflow',
      description: 'Custom ComfyUI workflow to generate images',
      tags: ['custom', 'image generation'],
      author: 'You',
      thumbnailUrl: '',
      nonCommercial: false,
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.IMAGE_GENERATION,
      data:
        settings.comfyClapWorkflowForImage?.data ||
        defaultWorkflowForImages.data,
      schema: '',
      inputFields: settings.comfyClapWorkflowForImage?.inputFields || [
        genericPrompt,
      ],
      inputValues: settings.comfyClapWorkflowForImage?.inputValues || {
        [genericPrompt.id]: genericPrompt.defaultValue,
      },
    },
    {
      id: 'comfyui://settings.comfyWorkflowForVideo',
      label: 'Custom Video Workflow',
      description: 'Custom ComfyUI workflow to generate videos',
      tags: ['custom', 'video generation'],
      author: 'You',
      thumbnailUrl: '',
      nonCommercial: false,
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.VIDEO_GENERATION,
      data:
        settings.comfyClapWorkflowForVideo?.data ||
        defaultWorkflowForVideos.data,
      schema: '',
      inputFields: settings.comfyClapWorkflowForVideo?.inputFields || [
        genericImage,
      ],
      inputValues: settings.comfyClapWorkflowForVideo?.inputValues || {
        [genericImage.id]: genericImage.defaultValue,
      },
    },
    {
      ...voiceWorkflow,
      id: 'comfyui://settings.comfyWorkflowForVoice',
      label: 'Custom Voice Workflow',
      description: 'Custom ComfyUI workflow to generate voice',
      tags: ['custom', 'voice generation'],
    },
    {
      ...musicWorkflow,
      id: 'comfyui://settings.comfyWorkflowForMusic',
      label: 'Custom Music Workflow',
      description: 'Custom ComfyUI workflow to generate music',
      tags: ['custom', 'music generation'],
    },
    {
      ...soundWorkflow,
      id: 'comfyui://settings.comfyWorkflowForSound',
      label: 'Custom Sound Workflow',
      description: 'Custom ComfyUI workflow to generate sound',
      tags: ['custom', 'sound generation'],
    },
  ]

  return workflows
}
