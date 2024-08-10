import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import {
  genericHeight2048,
  genericPrompt,
  genericWidth2048,
} from '../common/defaultValues'

export const comfyicuWorkflows: ClapWorkflow[] = [
  /*

  Unfortunately Comfy.icu doesn't support:
  - programmatic run of a new arbitrary workflow (like on Replicate)
  - OR (as a fallback) programmatic execution of an existing workflow created by someone else
  - OR (as a fallback) programmatic creation of a fork/duplicate of a workflow created by someone else
  - OR (as a fallback) programmatic creation of a new arbitrary workflow

  so basically.. we can do nothing with it for Clapper 🤷
  

  {
    id: 'comfyicu://SGeMzu2XVDPvQNU-7jhIv',
    label: 'FLUX.1 [schnell]',
    description: '',
    tags: ['flux'],
    author: 'BFL (https://BlackForestLabs.ai)',
    thumbnailUrl: '',
    engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
    provider: ClapWorkflowProvider.COMFYICU,
    category: ClapWorkflowCategory.IMAGE_GENERATION,

    // note: ComfyICU uses "API Workflows", which are simplified ComfyUI workflows

    data: '{"5":{"inputs":{"width":1024,"height":1024,"batch_size":1},"class_type":"EmptyLatentImage"},"6":{"inputs":{"clip":["11",0],"text":"detailed cinematic dof render of an old dusty detailed CRT monitor on a wooden desk in a dim room with items around, messy dirty room. On the screen are the letters "FLUX Schnell" glowing softly. High detail hard surface render"},"class_type":"CLIPTextEncode"},"8":{"inputs":{"vae":["10",0],"samples":["13",0]},"class_type":"VAEDecode"},"9":{"inputs":{"images":["8",0],"filename_prefix":"ComfyUI"},"class_type":"SaveImage"},"10":{"inputs":{"vae_name":"flux1-ae.safetensors"},"class_type":"VAELoader"},"11":{"inputs":{"type":"flux","clip_name1":"t5xxl_fp16.safetensors","clip_name2":"clip_l.safetensors"},"class_type":"DualCLIPLoader"},"12":{"inputs":{"unet_name":"flux1-schnell.safetensors","weight_dtype":"default"},"class_type":"UNETLoader"},"13":{"inputs":{"noise":["25",0],"guider":["22",0],"sigmas":["17",0],"sampler":["16",0],"latent_image":["5",0]},"class_type":"SamplerCustomAdvanced"},"16":{"inputs":{"sampler_name":"euler"},"class_type":"KSamplerSelect"},"17":{"inputs":{"model":["12",0],"steps":4,"denoise":1,"scheduler":"simple"},"class_type":"BasicScheduler"},"22":{"inputs":{"model":["12",0],"conditioning":["6",0]},"class_type":"BasicGuider"},"25":{"inputs":{"noise_seed":24016052484185},"class_type":"RandomNoise"}}',
    inputFields: [genericPrompt, genericWidth2048, genericHeight2048],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth2048.id]: genericWidth2048.defaultValue,
      [genericHeight2048.id]: genericHeight2048.defaultValue,
    },
  },

  */
]
