import { GlifWorkflow } from '../specialized/glif/types'

export const glifs: GlifWorkflow[] = [
  {
    id: 'clz0abcl70000lqaglpuocakq',
    name: 'Any Image Animator',
    imageUrl: null,
    description: 'Based on @angrypenguin AnimateDiff LCM',
    createdAt: '2024-07-24T20:15:53.467Z',
    updatedAt: '2024-07-25T19:46:59.431Z',
    publishedAt: '2024-07-25T16:22:10.029Z',
    output:
      'https://res.cloudinary.com/dkpfhyd71-comfy/image/upload/v1721925035/glif-comfy/b38bd8b3-2ced-4ab5-86da-6f1b14211e82.webp',
    outputType: 'IMAGE',
    forkedFromId: 'clyzh5p3e0000fol0z19xo2fe',
    featuredAt: null,
    userId: 'clvcyis0h000aowumdmmdij5l',
    completedSpellRunCount: 37,
    averageDuration: 88506,
    user: {
      id: 'clvcyis0h000aowumdmmdij5l',
      name: 'Anibaaal',
      image:
        'https://lh3.googleusercontent.com/a/ACg8ocKi97yHdJFp8o6gXOWiWSN6eepnpR4XBHbQaT3MJGmJfymnrjIqfg=s96-c',
      username: 'Anibaaal',
    },
    _count: {
      likes: 1,
      comments: 0,
    },
    spheres: [],
    data: {
      nodes: [
        {
          name: 'image',
          type: 'ImageInputBlock',
          params: {
            label: null,
            value: null,
            source: 'upload',
          },
        },
        {
          name: 'add-prompt',
          type: 'TextInputBlock',
          params: {
            label:
              'Additional details (e.g. character name, specific style) (optional)',
            value: ' ',
          },
        },
        {
          name: 'creativity',
          type: 'MultipickBlock',
          params: {
            label: 'Creativity (Lower keeps more the original image)',
            value: 'Low',
            options: ['Very low', 'Low', 'Medium', 'High', 'Very high', 'Max'],
            randomize: false,
          },
        },
        {
          name: 'format',
          type: 'MultipickBlock',
          params: {
            label: 'Format',
            value: 'MP4 Video (High quality - High res)',
            options: [
              'MP4 Video (High quality - High res)',
              'Animated GIF (Low quality - Low res)',
              'Animated WebP (High quality - High res. Not supported everywhere)',
            ],
            randomize: false,
          },
        },
        {
          name: 'cfg',
          type: 'CombinerBlock',
          params: {
            value: '1.5',
          },
        },
        {
          name: 'vision',
          type: 'GlifBlock',
          params: {
            id: 'clu9u812w0000egv40lzjg0gi',
            inputValues: [
              'What is a concise and precise prompt for this image applying deep knowledge of visual arts?',
              '{image}',
              '300',
            ],
          },
        },
        {
          name: 'design',
          type: 'GPTBlock',
          params: {
            model: 'gpt-4',
            prompt:
              'You are a creative AI designed to generate detailed image and animation prompts based on an image description. For each image, provide the following details in JSON format:\n- An image prompt detailing the entity\'s appearance and surroundings\n- An animation prompt fitting for the image\n\nExample image description: "A cartoon image of a dog is depicted, with muscles visible on its chest. The background features mountains, a building, and a sun in the sky. The overall color scheme is orange and red, with a pinkish hue to the dog."\n\nYour output should follow this JSON template:\n\n{\n    "image_prompt": "A cartoon image of a muscular dog with visible chest muscles. The dog has a pinkish hue. The background features majestic mountains, a building, and a bright sun in the sky. The overall color scheme is dominated by vibrant shades of orange and red.",\n    "animation_prompt": "The muscular dog flexes its chest muscles proudly. The sun shines brightly in the sky, casting warm hues over the scene. The mountains in the background appear to slowly move past, giving a sense of depth, while the building stands firmly. The dog occasionally wags its tail and barks."\n}\n\nProvide the JSON output for the following image description: "{add-prompt}. {vision}"\n',
            jsonMode: false,
            maxTokens: 1000,
            temperature: 1,
            systemPrompt: 'You are a helpful assistant.',
          },
        },
        {
          name: 'set-format',
          type: 'GPTBlock',
          params: {
            model: 'gpt-4o-mini',
            prompt:
              'Follow this:\n\nFor input = MP4 Video (High quality - High res), output = \n{"format": "video/h264-mp4", "crf": "25", "size": "1"}\nFor input = Animated GIF (Low quality - Low res), output = \n{"format": "image/gif", "crf": "300", "size": "0.3125"}\nFor input = Animated WebP (High quality - High res. Not supported everywhere), output = \n{"format": "image/webp", "crf": "100", "size": "1"}\n\nNo intro, just go for input = {format}, output = \n',
            jsonMode: false,
            maxTokens: 100,
            temperature: 0.5,
            systemPrompt: 'You are a helpful assistant.',
          },
        },
        {
          name: 'set-creativity',
          type: 'GPTBlock',
          params: {
            model: 'gpt-4o-mini',
            prompt:
              'Follow this:\n\nFor input = Very low, output =   {"min": "70", "max": "80"}\nFor input = Low, output = {"min": "35", "max": "45"}\nFor input = Medium, output =  {"min": "20", "max": "30"}\nFor input = High, output =   {"min": "10", "max": "20"}\nFor input = Very high, output =   {"min": "3", "max": "13"}\nFor input = Max, output =   {"min": "0", "max": "10"}\n\nNo intro, just go for input = {creativity}, output = \n',
            jsonMode: false,
            maxTokens: 100,
            temperature: 0.5,
            systemPrompt: 'You are a helpful assistant.',
          },
        },
        {
          name: 'prompts',
          type: 'JSONBlock',
          params: {
            paths: {
              image: {
                path: 'image_prompt',
                fallback: null,
              },
              animation: {
                path: 'animation_prompt',
                fallback: null,
              },
            },
            value: '{design}',
          },
        },
        {
          name: 'settings',
          type: 'JSONBlock',
          params: {
            paths: {
              crf: {
                path: 'output.crf',
                fallback: null,
              },
              max: {
                path: 'creativity.max',
                fallback: null,
              },
              min: {
                path: 'creativity.min',
                fallback: null,
              },
              size: {
                path: 'output.size',
                fallback: null,
              },
              format: {
                path: 'output.format',
                fallback: null,
              },
            },
            value: '{"output": {set-format}, "creativity": {set-creativity}}',
          },
        },
        {
          name: 'animate',
          type: 'ComfyBlock',
          params: {
            seed: null,
            value:
              '{\n  "1": {\n    "inputs": {\n      "ckpt_name": "DreamShaper8_LCM.safetensors",\n      "vae_name": "Baked VAE",\n      "clip_skip": -1,\n      "lora_name": "None",\n      "lora_model_strength": -2.2600000000000002,\n      "lora_clip_strength": 0.14,\n      "positive": "{prompts.image} {prompts.animation}, 4k",\n      "negative": "watermark, text, signature, blurry, nsfw, children, nude, naked",\n      "token_normalization": "none",\n      "weight_interpretation": "comfy",\n      "empty_latent_width": 512,\n      "empty_latent_height": 512,\n      "batch_size": 32\n    },\n    "class_type": "Efficient Loader",\n    "_meta": {\n      "title": "Efficient Loader"\n    }\n  },\n  "3": {\n    "inputs": {\n      "lora_name": "glimmerAnimateDiff_v3.safetensors",\n      "strength": 0.8\n    },\n    "class_type": "ADE_AnimateDiffLoRALoader",\n    "_meta": {\n      "title": "Load AnimateDiff LoRA 🎭🅐🅓"\n    }\n  },\n  "4": {\n    "inputs": {\n      "context_length": 16,\n      "context_stride": 1,\n      "context_overlap": 4,\n      "closed_loop": false,\n      "fuse_method": "pyramid",\n      "use_on_equal_length": false,\n      "start_percent": 0,\n      "guarantee_steps": 1\n    },\n    "class_type": "ADE_LoopedUniformContextOptions",\n    "_meta": {\n      "title": "Context Options◆Looped Uniform 🎭🅐🅓"\n    }\n  },\n  "6": {\n    "inputs": {\n      "frame_rate": 14,\n      "loop_count": 0,\n      "filename_prefix": "AnimateDiff",\n      "format": "{settings.format}",\n      "pingpong": false,\n      "save_output": true,\n      "pix_fmt": "yuv420p",\n      "crf": {settings.crf},\n      "save_metadata": true,\n      "images": [\n        "32",\n        0\n      ]\n    },\n    "class_type": "VHS_VideoCombine",\n    "_meta": {\n      "title": "Video Combine 🎥🅥🅗🅢"\n    }\n  },\n  "7": {\n    "inputs": {\n      "upscale_type": "latent",\n      "hires_ckpt_name": "(use same)",\n      "latent_upscaler": "ttl_nn.SD 1.x",\n      "pixel_upscaler": "4x-AnimeSharp.pth",\n      "upscale_by": 2,\n      "use_same_seed": true,\n      "seed": 0,\n      "hires_steps": 8,\n      "denoise": 0.6,\n      "iterations": 1,\n      "use_controlnet": false,\n      "control_net_name": "OpenPoseXL2.safetensors",\n      "strength": 1,\n      "preprocessor": "none",\n      "preprocessor_imgs": false\n    },\n    "class_type": "HighRes-Fix Script",\n    "_meta": {\n      "title": "HighRes-Fix Script"\n    }\n  },\n  "8": {\n    "inputs": {\n      "model_name": "AnimateLCM_sd15_t2v.ckpt",\n      "beta_schedule": "lcm \u003E\u003E sqrt_linear",\n      "motion_scale": 1.2,\n      "apply_v2_models_properly": false,\n      "model": [\n        "1",\n        0\n      ],\n      "context_options": [\n        "4",\n        0\n      ],\n      "motion_lora": [\n        "3",\n        0\n      ]\n    },\n    "class_type": "ADE_AnimateDiffLoaderWithContext",\n    "_meta": {\n      "title": "AnimateDiff Loader [Legacy] 🎭🅐🅓①"\n    }\n  },\n  "9": {\n    "inputs": {\n      "image": "{image}"\n    },\n    "class_type": "LoadImage",\n    "_meta": {\n      "title": "Load Image"\n    }\n  },\n  "12": {\n    "inputs": {\n      "pixels": [\n        "40",\n        0\n      ],\n      "vae": [\n        "1",\n        4\n      ]\n    },\n    "class_type": "VAEEncode",\n    "_meta": {\n      "title": "VAE Encode"\n    }\n  },\n  "13": {\n    "inputs": {\n      "multiply_by": 32,\n      "latents": [\n        "12",\n        0\n      ]\n    },\n    "class_type": "VHS_DuplicateLatents",\n    "_meta": {\n      "title": "Duplicate Latent Batch 🎥🅥🅗🅢"\n    }\n  },\n  "28": {\n    "inputs": {\n      "add_noise": "enable",\n      "noise_seed": 0,\n      "steps": {settings.max},\n      "cfg": {cfg},\n      "sampler_name": "lcm",\n      "scheduler": "sgm_uniform",\n      "start_at_step": {settings.min},\n      "end_at_step": 10000,\n      "return_with_leftover_noise": "disable",\n      "preview_method": "auto",\n      "vae_decode": "true",\n      "model": [\n        "8",\n        0\n      ],\n      "positive": [\n        "1",\n        1\n      ],\n      "negative": [\n        "1",\n        2\n      ],\n      "latent_image": [\n        "13",\n        0\n      ],\n      "optional_vae": [\n        "1",\n        4\n      ],\n      "script": [\n        "7",\n        0\n      ]\n    },\n    "class_type": "KSampler Adv. (Efficient)",\n    "_meta": {\n      "title": "KSampler Adv. (Efficient)"\n    }\n  },\n  "32": {\n    "inputs": {\n      "upscale_method": "lanczos",\n      "scale_by": {settings.size},\n      "image": [\n        "28",\n        5\n      ]\n    },\n    "class_type": "ImageScaleBy",\n    "_meta": {\n      "title": "Upscale Image By"\n    }\n  },\n  "40": {\n    "inputs": {\n      "upscale_method": "nearest-exact",\n      "megapixels": 0.26,\n      "image": [\n        "9",\n        0\n      ]\n    },\n    "class_type": "ImageScaleToTotalPixels",\n    "_meta": {\n      "title": "ImageScaleToTotalPixels"\n    }\n  }\n}',
            fixSeed: false,
          },
        },
      ],
    },
  },
]
