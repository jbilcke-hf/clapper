import { ComfyIcuAccelerator, ComputeProvider } from "@/types"


export const computeProviderShortNames = {
  [ComputeProvider.NONE]: "None",
  [ComputeProvider.CUSTOM]: "Custom API",
  [ComputeProvider.HUGGINGFACE]: "Hugging Face",
  [ComputeProvider.COMFY_HUGGINGFACE]: "Hugging Face Comfy",
  [ComputeProvider.REPLICATE]: "Replicate",
  [ComputeProvider.COMFY_REPLICATE]: "Replicate Comfy",
  [ComputeProvider.COMFY_COMFYICU]: "Comfy.icu",
  [ComputeProvider.ELEVENLABS]: "ElevenLabs",
  [ComputeProvider.OPENAI]: "OpenAI",
  [ComputeProvider.STABILITYAI]: "StabilityAI",
  [ComputeProvider.GROQ]: "Groq",
  [ComputeProvider.FALAI]: "Fal.ai",
  [ComputeProvider.MODELSLAB]: "ModelsLab"
}

export const availableComputeProvidersForAssistant = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.GROQ,
  ComputeProvider.OPENAI,
]

export const availableComputeProvidersForImages = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.REPLICATE,
  ComputeProvider.COMFY_REPLICATE,
  ComputeProvider.COMFY_COMFYICU,
  ComputeProvider.FALAI,
  ComputeProvider.MODELSLAB,
]

export const availableComputeProvidersForVideos = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.REPLICATE,
  ComputeProvider.COMFY_REPLICATE,
  ComputeProvider.COMFY_COMFYICU,
  ComputeProvider.FALAI,
  ComputeProvider.MODELSLAB,
]

export const availableComputeProvidersForMusic = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.COMFY_REPLICATE,
  ComputeProvider.COMFY_COMFYICU,
  ComputeProvider.STABILITYAI,
  ComputeProvider.FALAI,
  ComputeProvider.MODELSLAB,
]

export const availableComputeProvidersForSound = [
  ComputeProvider.HUGGINGFACE,
  ComputeProvider.COMFY_REPLICATE,
  ComputeProvider.COMFY_COMFYICU,
  ComputeProvider.STABILITYAI,
  ComputeProvider.FALAI,
  ComputeProvider.ELEVENLABS,
]

export const availableComputeProvidersForVoice = [
  ComputeProvider.ELEVENLABS,
  ComputeProvider.STABILITYAI,
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
