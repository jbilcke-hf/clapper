import { ComfyIcuAccelerator, ComputeProvider } from "@/types"

export const computeProviderShortNames = {
  [ComputeProvider.ANTHROPIC]: "Anthropic",
  [ComputeProvider.COHERE]: "Cohere",
  [ComputeProvider.COMFY_COMFYICU]: "Comfy.icu",
  [ComputeProvider.COMFY_HUGGINGFACE]: "Hugging Face Comfy",
  [ComputeProvider.COMFY_REPLICATE]: "Replicate Comfy",
  [ComputeProvider.CUSTOM]: "Custom API",
  [ComputeProvider.ELEVENLABS]: "ElevenLabs",
  [ComputeProvider.FALAI]: "Fal.ai",
  [ComputeProvider.FIREWORKSAI]: "FireworksAI",
  [ComputeProvider.GOOGLE]: "Google (VertexAI)",
  [ComputeProvider.GROQ]: "Groq",
  [ComputeProvider.HUGGINGFACE]: "Hugging Face",
  [ComputeProvider.KITSAI]: "Kits.ai",
  [ComputeProvider.MISTRALAI]: "MistralAI",
  [ComputeProvider.MODELSLAB]: "ModelsLab",
  [ComputeProvider.NONE]: "None", // <-- this is the default
  [ComputeProvider.OPENAI]: "OpenAI",
  [ComputeProvider.REPLICATE]: "Replicate",
  [ComputeProvider.STABILITYAI]: "StabilityAI",
  [ComputeProvider.MIDJOURNEY]: "Midjourney (no image API)",
  [ComputeProvider.SUNO]: "Suno (no music API)",
  [ComputeProvider.UDIO]: "Udio (no music API)",
  [ComputeProvider.LUMALABS]: "LumaLabs (no video API)",
  [ComputeProvider.KUAISHOU]: "KuaiShou (no video API)",
  [ComputeProvider.RUNWAYML]: "RunwayML (no video API)",
}

export const availableComputeProvidersForAssistant = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.GROQ,
  ComputeProvider.OPENAI,
  ComputeProvider.ANTHROPIC,
  ComputeProvider.FIREWORKSAI,
]

export const availableComputeProvidersForImages = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.REPLICATE,
  ComputeProvider.COMFY_REPLICATE,
  ComputeProvider.COMFY_COMFYICU,
  ComputeProvider.STABILITYAI,
  ComputeProvider.FIREWORKSAI,
  ComputeProvider.FALAI,
  ComputeProvider.MODELSLAB,
  ComputeProvider.MIDJOURNEY,
]

export const availableComputeProvidersForVideos = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.REPLICATE,
  ComputeProvider.COMFY_REPLICATE,
  ComputeProvider.COMFY_COMFYICU,
  ComputeProvider.STABILITYAI,
  // ComputeProvider.FIREWORKSAI,
  ComputeProvider.FALAI,
  ComputeProvider.MODELSLAB,
  ComputeProvider.OPENAI,
  ComputeProvider.GOOGLE,
  ComputeProvider.LUMALABS,
  ComputeProvider.KUAISHOU,
]

export const availableComputeProvidersForMusic = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.COMFY_REPLICATE,
  ComputeProvider.COMFY_COMFYICU,
  ComputeProvider.STABILITYAI,
  // ComputeProvider.FIREWORKSAI,
  ComputeProvider.FALAI,
  ComputeProvider.MODELSLAB,
  ComputeProvider.SUNO,
  ComputeProvider.UDIO,
]

export const availableComputeProvidersForSound = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.COMFY_REPLICATE,
  ComputeProvider.COMFY_COMFYICU,
  ComputeProvider.STABILITYAI,
  // ComputeProvider.FIREWORKSAI,
  ComputeProvider.FALAI,
  ComputeProvider.ELEVENLABS,
]

export const availableComputeProvidersForVoice = [
  ComputeProvider.ELEVENLABS,
  ComputeProvider.KITSAI,
  ComputeProvider.STABILITYAI,
  // ComputeProvider.FIREWORKSAI,
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.COMFY_REPLICATE,
  ComputeProvider.COMFY_COMFYICU,
  ComputeProvider.FALAI,
  ComputeProvider.MODELSLAB,
]

export const availableComfyIcuAccelerators = {
  [ComfyIcuAccelerator.L4]: "L4",
  [ComfyIcuAccelerator.T4]: "T4",
  [ComfyIcuAccelerator.A10]: "A10",
  [ComfyIcuAccelerator.A100_40GB]: "A100 (40 GB)",
  [ComfyIcuAccelerator.A100_80GB]: "A100 (80 GB)",
  [ComfyIcuAccelerator.H100]: "H100",
}

export const availableModelsForAssistant: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.OPENAI]: [
    "gpt-4",
    "gpt-4-turbo",
    "gpt-4o",
  ],
  [ComputeProvider.GROQ]: [
    "Mixtral-8x7b-32768",
    "Gemma-7b-lt",
    "Llama3-70b-8192",
    "Llama3-8b-8192",
  ],
  [ComputeProvider.ANTHROPIC]: [
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307"
  ], 
  [ComputeProvider.GOOGLE]: [
    "claude-3-opus@20240229",
    "claude-3-sonnet@20240229",
    "claude-3-haiku@20240307"
  ],
  [ComputeProvider.MISTRALAI]: [
    "mistral-small-latest",
    "open-mistral-7b"
  ],
  [ComputeProvider.HUGGINGFACE]: [
    "HuggingFaceH4/zephyr-7b-beta",
    "mistralai/Mixtral-8x7B-Instruct-v0.1"
  ],
  [ComputeProvider.FIREWORKSAI]: [
    "fireworks/llama-v3-70b-instruct",
  ]
}

export const availableModelsForAssistantTurbo: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.OPENAI]: [
    "gpt-4-turbo"
  ]
}


// note: each of those models do different things, have different parameters..
// so it will have to be taken into account
export const availableModelsForImageGeneration: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/stable-diffusion-v3-medium",
    "fal-ai/fast-sdxl",
    "fal-ai/stable-cascade",
    "fal-ai/fast-lightning-sdxl",
    "fal-ai/hyper-sdxl",
    // "fal-ai/photomaker",
    // "fal-ai/pulid",
    // "fal-ai/image-to-image",
    // "fal-ai/omni-zero",
  ],
  [ComputeProvider.STABILITYAI]: [
    "stable-image/generate/ultra",
    "stable-image/generate/core",
    "stable-image/generate/sd3"
  ],
  [ComputeProvider.FIREWORKSAI]: [
    "stability/sd3",
    "accounts/stability/models/sd3-turbo",
    "fireworks/stable-diffusion-xl-1024-v1-0",
    "accounts/fireworks/models/playground-v2-5-1024px-aesthetic",
  ],
  [ComputeProvider.MIDJOURNEY]: [
    "(No public API)",
  ]
}

// should we call this upscaling or post-processing?
export const availableModelsForImageUpscaling: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/ccsr",
  ],
  [ComputeProvider.STABILITYAI]: [
    "stable-image/upscale/conservative",
    "stable-image/upscale/creative"
  ],
}

export const availableModelsForVideoGeneration: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/stable-video",
  ],
  [ComputeProvider.STABILITYAI]: [
    "image-to-video",
  ],
  [ComputeProvider.OPENAI]: [
    "Sora is unavailable (no public API)",
  ],
  [ComputeProvider.GOOGLE]: [
    "Veo is unavailable (no public API)",
  ],
  [ComputeProvider.RUNWAYML]: [
    "Gen-3 is unavailable (no public API)",
  ],
  [ComputeProvider.LUMALABS]: [
    "Dream Machine is unavailable (no public API)",
  ],
  [ComputeProvider.KUAISHOU]: [
    "Kling is unavailable (no public API)",
  ]
}

export const availableModelsForVideoUpscaling: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
  ]
}

export const availableModelsForSoundGeneration: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/stable-audio"
  ]
}

export const availableModelsForVoiceGeneration: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/metavoice-v1"
  ]
}

export const availableModelsForMusicGeneration: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/stable-audio"
  ],
  [ComputeProvider.SUNO]: [
    "Suno is unavailable (No public API)"
  ],
  [ComputeProvider.UDIO]: [
    "Udio is unavailable (No public API)"
  ],
}
