// a list of FLUX.1 LoRA models that can be used with various providers

import { LoraBaseModel, Lora } from '../types'

export const defaultLoraModels: Lora[] = [
  {
    id: 'lora://hf.co/models/alvdansen/flux-koda',
    label: 'Koda',
    baseModel: LoraBaseModel.FLUX,
    description:
      "Koda captures the nostalgic essence of early 1990s photography, evoking memories of disposable cameras and carefree travels. It specializes in creating images with a distinct vintage quality, characterized by slightly washed-out colors, soft focus, and the occasional light leak or film grain. The model excels at producing slice-of-life scenes that feel spontaneous and candid, as if plucked from a family photo album or a backpacker's travel diary.",

    thumbnailUrl:
      'https://hf.co/alvdansen/flux-koda/resolve/main/images/ComfyUI_00566_%20(2).png',

    projectUrl: 'https://hf.co/alvdansen/flux-koda',

    author: '@alvdansen',

    // trigger (usually some kind of unique string sequence, eg TOK)
    trigger: 'flmft style',

    extensions:
      'kodachrome, blurry, realistic, still life, depth of field, scenery, no humans, monochrome, greyscale, traditional media, horizon, looking at viewer, light particles, shadow',

    repoOrUrl: 'alvdansen/flux-koda',

    fileName: 'araminta_k_flux_koda.safetensors',
  },
  {
    id: 'lora://hf.co/models/veryVANYA/ps1-style-flux',
    label: 'PS1 Style',
    baseModel: LoraBaseModel.FLUX,
    description: `late 90s/early 2000s ps1/n64 console graphics.

5000 steps

trained on 15 gpt4o captioned and adjusted ps1/n64 game screenshots using https://github.com/ostris/ai-toolkit/tree/main`,

    thumbnailUrl:
      'https://huggingface.co/veryVANYA/ps1-style-flux/resolve/main/24440109.jpeg',

    projectUrl: 'https://hf.co/veryVANYA/ps1-style-flux',
    author: '@veryVANYA',

    // trigger (usually some kind of unique string sequence, eg TOK)
    trigger: 'ps1',

    extensions: 'ps1 game screenshot',

    repoOrUrl: 'veryVANYA/ps1-style-flux',

    fileName: 'ps1_style_flux_v1.safetensors',
  },
  /*
  {
    id: 'lora://hf.co/models/jbilcke-hf/experimental-model-1',
    label: 'Experimental Model 1',
    baseModel: LoraBaseModel.FLUX,
    description: 'A model for internal testing',

    thumbnailUrl: '',

    projectUrl: 'clapper.app',

    author: '@jbilcke-hf',

    // trigger (usually some kind of unique string sequence, eg TOK)
    trigger: 'TKE1',

    extensions:
      'movie screencap from <YEAR>, in <color|black & white>, with film grain.',

    repoOrUrl: 'jbilcke-hf/experimental-model-1',
  },
  */
]
