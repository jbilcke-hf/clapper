import { ComfyIcuAccelerator, ComputeProvider } from "@/types"

export const availableComputeProviders = {
  [ComputeProvider.NONE]: "No default provider",
  [ComputeProvider.HUGGINGFACE]: "HuggingFace",
  [ComputeProvider.REPLICATE]: "Replicate (Cog & ComfyUI)",
  [ComputeProvider.COMFY_COMFYICU]: "Comfy.icu (ComfyUI workflow)",
  [ComputeProvider.FALAI]: "Fal.ai",
  [ComputeProvider.MODELSLAB]: "ModelsLab",
  // [ComputeProvider.CUSTOM]: "Custom server",
}

export const availableComputeProvidersForAssistant = {
  [ComputeProvider.NONE]: "No assistant provider",
  [ComputeProvider.HUGGINGFACE]: "Hugging Face (Inference API)",
  [ComputeProvider.GROQ]: "Groq",
  [ComputeProvider.OPENAI]: "OpenAI (ChatGPT)",
}

export const availableComputeProvidersForStoryboards = {
  [ComputeProvider.NONE]: "No storyboard provider",
  [ComputeProvider.HUGGINGFACE]: "HuggingFace",
  [ComputeProvider.REPLICATE]: "Replicate (Cog API)",
  [ComputeProvider.COMFY_REPLICATE]: "Replicate (Comfy API)",
  [ComputeProvider.COMFY_COMFYICU]: "Comfy.icu (Comfy API)",
  [ComputeProvider.FALAI]: "Fal.ai",
  [ComputeProvider.MODELSLAB]: "ModelsLab.com",
}

export const availableComputeProvidersForVideos = {
  [ComputeProvider.NONE]: "No video provider",
  [ComputeProvider.HUGGINGFACE]: "HuggingFace",
  [ComputeProvider.REPLICATE]: "Replicate (Cog API)",
  [ComputeProvider.COMFY_REPLICATE]: "Replicate (Comfy API)",
  [ComputeProvider.COMFY_COMFYICU]: "Comfy.icu (Comfy API)",
  [ComputeProvider.FALAI]: "Fal.ai",
  [ComputeProvider.MODELSLAB]: "ModelsLab.com",
}

export const availableComputeProvidersForMusic = {
  [ComputeProvider.NONE]: "No music provider",
  [ComputeProvider.HUGGINGFACE]: "HuggingFace",
  [ComputeProvider.COMFY_REPLICATE]: "Replicate (Comfy API)",
  [ComputeProvider.COMFY_COMFYICU]: "Comfy.icu (Comfy API)",
  [ComputeProvider.STABILITYAI]: "StabilityAI (Stable Audio API)",
  [ComputeProvider.FALAI]: "Fal.ai",
  [ComputeProvider.MODELSLAB]: "ModelsLab.com",
}

export const availableComputeProvidersForSound = {
  [ComputeProvider.NONE]: "No sound provider",
  [ComputeProvider.HUGGINGFACE]: "HuggingFace",
  [ComputeProvider.COMFY_REPLICATE]: "Replicate (Comfy API)",
  [ComputeProvider.COMFY_COMFYICU]: "Comfy.icu (Comfy API)",
  [ComputeProvider.STABILITYAI]: "StabilityAI (Stable Audio API)",
  [ComputeProvider.ELEVENLABS]: "Eleven Labs (Sound Effects API)",

}

export const availableComputeProvidersForSpeech = {
  [ComputeProvider.NONE]: "No speech provider",
  [ComputeProvider.ELEVENLABS]: "Eleven Labs (TTS API)",
  [ComputeProvider.STABILITYAI]: "StabilityAI (Stable Audio API)",
  [ComputeProvider.HUGGINGFACE]: "HuggingFace",
  [ComputeProvider.COMFY_REPLICATE]: "Replicate (Comfy API)",
  [ComputeProvider.COMFY_COMFYICU]: "Comfy.icu (Comfy API)",
  [ComputeProvider.FALAI]: "Fal.ai",
  [ComputeProvider.MODELSLAB]: "ModelsLab.com",
}

export const availableComfyIcuAccelerators = {
  [ComfyIcuAccelerator.L4]: "L4",
  [ComfyIcuAccelerator.T4]: "T4",
  [ComfyIcuAccelerator.A10]: "A10",
  [ComfyIcuAccelerator.A100_40GB]: "A100 (40 GB)",
  [ComfyIcuAccelerator.A100_80GB]: "A100 (80 GB)",
  [ComfyIcuAccelerator.H100]: "H100",
}