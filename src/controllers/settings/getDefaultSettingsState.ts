import { RenderingStrategy } from "@aitube/timeline"

import { ComfyIcuAccelerator, ComputeProvider } from "@/types"

import { SettingsState } from "./types"
import { defaultWorkflowForImages } from "./workflows/image"

export function getDefaultSettingsState(): SettingsState {
  const state: SettingsState = {

    customComfyUiApiKey: "",
    replicateApiKey: "",
    comfyIcuApiKey: "",
    comfyIcuAccelerator: ComfyIcuAccelerator.L4,
    huggingFaceApiKey: "",
    modelsLabApiKey: "",
    falAiApiKey: "",
    openaiApiKey: "",
    googleApiKey: "",
    groqApiKey: "",
    anthropicApiKey: "",
    elevenLabsApiKey: "",
    kitsAiApiKey: "",
    cohereApiKey: "",
    mistralAiApiKey: "",
    stabilityAiApiKey: "",
    fireworksAiApiKey: "",

    assistantProvider: ComputeProvider.NONE,
    imageProvider: ComputeProvider.NONE,
    videoProvider: ComputeProvider.NONE,
    soundProvider: ComputeProvider.NONE,
    voiceProvider: ComputeProvider.NONE,
    musicProvider: ComputeProvider.NONE,

    censorNotForAllAudiencesContent: false,

    imagePromptPrefix: "screencap",
    imagePromptSuffix: "high quality, beautiful, amazing, intricate details",
    imageNegativePrompt: "black banding, ugly, imperfect, cropped, low resolution",
    videoPromptPrefix: "screencap",
    videoPromptSuffix: "high quality, beautiful, amazing, intricate details",
    videoNegativePrompt: "black banding, ugly, imperfect, cropped, low resolution",

    assistantModel: "",
    assistantTurboModel: "",
    imageGenerationModel: "",
    imageGenerationTurboModel: "",
    imageUpscalingModel: "",
    videoGenerationModel: "",
    videoUpscalingModel: "",
    soundGenerationModel: "",
    voiceGenerationModel: "",
    musicGenerationModel: "",

    imageRenderingStrategy: RenderingStrategy.ON_DEMAND,
    videoRenderingStrategy: RenderingStrategy.ON_DEMAND,
    voiceRenderingStrategy: RenderingStrategy.ON_DEMAND,
    soundRenderingStrategy: RenderingStrategy.ON_DEMAND,
    musicRenderingStrategy: RenderingStrategy.ON_DEMAND,

    maxImagesToGenerateInParallel: 1,
    maxVideosToGenerateInParallel: 1,

    comfyWorkflowForImage: defaultWorkflowForImages,
    comfyWorkflowForVideo: "{}",
    comfyWorkflowForVoice: "{}",
    comfyWorkflowForSound: "{}",
    comfyWorkflowForMusic: "{}",
  
    // "HuggingFaceH4/zephyr-7b-beta"
    // "mistralai/Mixtral-8x7B-Instruct-v0.1",
    huggingFaceModelForAssistant: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    huggingFaceModelForImage: "sd-community/sdxl-flash",
    huggingFaceModelForVideo: "",
    huggingFaceModelForVoice: "",
    huggingFaceModelForSound: "",
    huggingFaceModelForMusic: "",
  
    gradioApiUrlForAssistant: "",
    gradioApiUrlForImage: "",
    gradioApiUrlForVideo: "",
    gradioApiUrlForSpeech: "",
    gradioApiUrlForSound: "",
    gradioApiUrlForMusic: "",

    replicateModelForImage: "chenxwh/sdxl-flash:001bb81139b01780380407b4106ac681df46108e002eafbeb9ccb2d8faca42e1",

    // note: this model doesn't support width and height parameters
    replicateModelForVideo: "camenduru/animatediff-lightning-4-step:be39c6d599942831314b770f03cfd062bfd0faa8cc52e9289bcce830b721fcb6",
    replicateModelForVoice: "lucataco/xtts-v2",
    replicateModelForSound: "sepal/audiogen",
    replicateModelForMusic: "meta/musicgen",
  
    stabilityAiModelForImage: "",
    stabilityAiModelForVideo: "",
    stabilityAiModelForVoice: "",
    stabilityAiModelForSound: "",
    stabilityAiModelForMusic: "",
  
    fireworksAiModelForAssistant: "",
    fireworksAiModelForImage: "stability/sd3",
    fireworksAiModelForVideo: "",
    fireworksAiModelForVoice: "",
    fireworksAiModelForSound: "",
    fireworksAiModelForMusic: "",
  
    falAiModelForImage: "fal-ai/fast-sdxl", // "fal-ai/fast-lightning-sdxl",
    falAiModelForVideo: "fal-ai/stable-video",
    falAiModelForVoice: "fal-ai/metavoice-v1",
    falAiModelForSound: "fal-ai/stable-audio",
    falAiModelForMusic: "fal-ai/stable-audio",
  
    modelsLabModelForImage: "",
    modelsLabModelForVideo: "",
    modelsLabModelForVoice: "",
    modelsLabModelForSound: "",
    modelsLabModelForMusic: "",

    openaiModelForAssistant: "gpt-4o",
    openaiModelForImage: "dall-e-3",
    openaiModelForVideo: "sora",
    openaiModelForVoice: "v1",

    groqModelForAssistant: "mixtral-8x7b-32768",
  
    googleModelForAssistant: "gemini-1.5-pro-001",
    googleModelForImage: "imagen",
    googleModelForVideo: "veo",
    googleModelForVoice: "v1",
    googleModelForMusic: "MusicLM",


    // Claud 3 stats:
    // Context window	200K*
    // *~150K words, ~680K unicode characters
    // Max output	4096 tokens
    anthropicModelForAssistant: "claude-3-opus-20240229",

    elevenLabsModelForVoice: "v1",
    elevenLabsModelForSound: "v1",

    kitsAiModelForVoice: "",
    cohereModelForAssistant: "command-r-plus",
    mistralAiModelForAssistant: "open-mixtral-8x22b"
  }
  return state
}
