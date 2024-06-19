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
  [ComputeProvider.MIDJOURNEY]: "Midjourney (no API)",
  [ComputeProvider.SUNO]: "Suno (no music API)",
  [ComputeProvider.UDIO]: "Udio (no music API)",
  [ComputeProvider.LUMALABS]: "Luma: Dream Machine (no API)",
  [ComputeProvider.KUAISHOU]: "KuaiShou: Kling (no API)",
  [ComputeProvider.RUNWAYML]: "RunwayML: GEN-3 (no API)",
  [ComputeProvider.HEDRA]: "Hedra: Character-1 (no API)",
  [ComputeProvider.LEONARDOAI]: "Leonardo.ai (no API)",
  [ComputeProvider.EVERARTAI]: "Everart.ai (no API)",
}

// for developer sanity purposes, we only support LangChain for now.
// if you wish to add or enable a new provider, please provide a working
// implementation of the LangChain module (even if it's in alpha eg. a GitHub NPM link, that's okay)
export const availableComputeProvidersForAssistant = [
  // disabled since this LangChain bridge is not available through NPM yet
  // ComputeProvider.HUGGINGFACE,

  ComputeProvider.GROQ,
  ComputeProvider.OPENAI,
  ComputeProvider.GOOGLE,
  ComputeProvider.COHERE,
  ComputeProvider.ANTHROPIC,
  ComputeProvider.MISTRALAI,

  // disabled since this LangChain bridge is not available through NPM yet
  // ComputeProvider.FIREWORKSAI,
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
  ComputeProvider.EVERARTAI,
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
  ComputeProvider.HEDRA,
  ComputeProvider.LEONARDOAI,
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
  [ComputeProvider.COHERE]: [
    "command",
    "command-r",
    "command-r-plus", // the latest one I think
    "command-light",
    "command-nightly",
    "command-light-nightly",
    "c4-aya-23"
  ],
  [ComputeProvider.ANTHROPIC]: [
    // you can find this list here: https://docs.anthropic.com/en/docs/models-overview
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307"
  ], 
  [ComputeProvider.GOOGLE]: [
    // you can find this list here: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versioning
    "gemini-1.5-flash-001",
    "gemini-1.5-pro-001",
    "gemini-1.0-pro-vision-001",
    "gemini-1.0-pro-002",

    // The auto-updated version of a Gemini model points to the most recent stable version


    // you can find this list here: https://docs.anthropic.com/en/docs/models-overview
    "claude-3-opus@20240229",
    "claude-3-sonnet@20240229",
    "claude-3-haiku@20240307"
  ],
  [ComputeProvider.MISTRALAI]: [
    "open-mistral-7b",
    "open-mixtral-8x7b",
    "open-mixtral-8x22b",
    "mistral-medium",
    "mistral-large-2402"
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
  ],
  [ComputeProvider.EVERARTAI]: [
    "(No public API)",
  ],
}

export const availableModelsForImageUpscaling: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/ccsr",
  ],
  [ComputeProvider.STABILITYAI]: [
    "stable-image/upscale/conservative",
    "stable-image/upscale/creative"
  ],
}

export const availableModelsForImageDepth: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/imageutils/marigold-depth",
    "fal-ai/imageutils/depth",
  ],
  [ComputeProvider.HUGGINGFACE]: [
    "depth-anything/Depth-Anything-V2-Large",
    "depth-anything/Depth-Anything-V2-Base",
    "depth-anything/Depth-Anything-V2-Small",
  ],
  [ComputeProvider.REPLICATE]: [
    "cjwbw/depth-anything",
    "adirik/marigold"
  ],
}

export const availableModelsForImageSegmentation: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/imageutils/sam",
    "fal-ai/tiny-sam"
  ],
  [ComputeProvider.HUGGINGFACE]: [
    "ybelkada/segment-anything"
  ],
  [ComputeProvider.REPLICATE]: [
    "yyjim/segment-anything-everything",
    "cjwbw/semantic-segment-anything",
    "pablodawson/segment-anything-automatic"
  ],
}

export const availableModelsForVideoGeneration: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.FALAI]: [
    "fal-ai/stable-video",
  ],
  [ComputeProvider.STABILITYAI]: [
    "image-to-video",
  ],
  [ComputeProvider.HUGGINGFACE]: [
    "spaces/hpcai-tech/open-sora",
    "spaces/multimodalart/hallo" // supports audio input
  ],
  [ComputeProvider.REPLICATE]: [
    // note: we need a model that accepts cinematic ratios
    // "camenduru/open-sora"

    "anotherjesse/zeroscope-v2-xl",
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
  ],
  [ComputeProvider.HEDRA]: [
    "Hedra is unavailable (no public API)",
  ],
  [ComputeProvider.LEONARDOAI]: [
    "Leonardo.ai is unavailable (no public API)",
  ],
}

export const availableModelsForVideoUpscaling: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.REPLICATE]: [
    "lucataco/real-esrgan-video",
    "pbarker/gfpgan-video"
  ]
}

export const availableModelsForVideoDepth: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.REPLICATE]: [
    "lucataco/depth-anything-video"
  ]
}


export const availableModelsForVideoSegmentation: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.REPLICATE]: [
    "cjwbw/cutie"
  ]
}

export const availableModelsForSoundGeneration: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.HUGGINGFACE]: [
    "cvssp/audioldm2",
    "cvssp/audioldm2-large",
    "cvssp/audioldm"
  ],
  [ComputeProvider.FALAI]: [
    "fal-ai/stable-audio"
  ],
  [ComputeProvider.ELEVENLABS]: [
    "v1/sound-generation"
  ],
  [ComputeProvider.REPLICATE]: [
    "declare-lab/tango",
    "suno-ai/bark",
    "sepal/audiogen"
  ]
}

export const availableModelsForVoiceGeneration: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.HUGGINGFACE]: [
    "coqui/XTTS-v2",
    "myshell-ai/OpenVoiceV2",
    "myshell-ai/OpenVoice",
    "WhisperSpeech/WhisperSpeech",
    "metavoiceio/metavoice-1B-v0.1",
    "parler-tts/parler_tts_mini_v0.1",
    "parler-tts/parler-tts-mini-expresso"
  ],
  [ComputeProvider.FALAI]: [
    "fal-ai/metavoice-v1"
  ],
  [ComputeProvider.REPLICATE]: [
    "chenxwh/openvoice"
  ],
  [ComputeProvider.ELEVENLABS]: [
    "v1/text-to-speech"
  ]
}

export const availableModelsForMusicGeneration: Partial<Record<ComputeProvider, string[]>> = {
  [ComputeProvider.HUGGINGFACE]: [
    "cvssp/audioldm2-music",
    "facebook/musicgen-large",
  ],
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
