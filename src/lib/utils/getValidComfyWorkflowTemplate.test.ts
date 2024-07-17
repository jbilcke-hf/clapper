import { expect, test } from 'vitest'

import { getValidComfyWorkflowTemplate } from './getValidComfyWorkflowTemplate'

const defaultJson = {}
const defaultStr = JSON.stringify(defaultJson, null, 2)

const mockJson = {  "3": {    "inputs": {      "seed": 156680208700286,      "steps": 10,      "cfg": 2.5,      "sampler_name": "dpmpp_2m_sde",      "scheduler": "karras",      "denoise": 1,      "model": [        "4",        0      ],      "positive": [        "6",        0      ],      "negative": [        "7",        0      ],      "latent_image": [        "5",        0      ]    },    "class_type": "KSampler",    "_meta": {      "title": "KSampler"    }  },  "4": {    "inputs": {      "ckpt_name": "SDXL-Flash.safetensors"    },    "class_type": "CheckpointLoaderSimple",    "_meta": {      "title": "Load Checkpoint"    }  },  "5": {    "inputs": {      "width": 1024,      "height": 1024,      "batch_size": 1    },    "class_type": "EmptyLatentImage",    "_meta": {      "title": "Empty Latent Image"    }  },  "6": {    "inputs": {      "text": "beautiful scenery nature glass bottle landscape, purple galaxy bottle,",      "clip": [        "4",        1      ]    },    "class_type": "CLIPTextEncode",    "_meta": {      "title": "CLIP Text Encode (Prompt)"    }  },  "7": {    "inputs": {      "text": "text, watermark",      "clip": [        "4",        1      ]    },    "class_type": "CLIPTextEncode",    "_meta": {      "title": "CLIP Text Encode (Prompt)"    }  },  "8": {    "inputs": {      "samples": [        "3",        0      ],      "vae": [        "4",        2      ]    },    "class_type": "VAEDecode",    "_meta": {      "title": "VAE Decode"    }  },  "9": {    "inputs": {      "filename_prefix": "ComfyUI",      "images": [        "8",        0      ]    },    "class_type": "SaveImage",    "_meta": {      "title": "Save Image"    }  }}
const mockStr = JSON.stringify(mockJson, null, 2)

// getValidComfyWorkflowTemplate takes a string, tries to unpack it as JSON to validate it, then returns a string
test('getValidComfyWorkflowTemplate', () => {
  expect(getValidComfyWorkflowTemplate(null, defaultStr)).toBe(defaultStr)
  expect(getValidComfyWorkflowTemplate(mockStr, defaultStr)).toBe(mockStr)
})

