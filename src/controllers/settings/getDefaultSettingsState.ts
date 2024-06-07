import { RenderingStrategy } from "@aitube/timeline"

import { ComfyIcuAccelerator, ComputeProvider } from "@/types"

import { SettingsState } from "./types"
import { defaultWorkflowForStoryboards } from "./workflows/storyboard"

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

    assistantProvider: ComputeProvider.NONE,
    storyboardProvider: ComputeProvider.NONE,
    videoProvider: ComputeProvider.NONE,
    soundProvider: ComputeProvider.NONE,
    speechProvider: ComputeProvider.NONE,
    musicProvider: ComputeProvider.NONE,

    censorNotForAllAudiencesContent: false,

    storyboardPromptPrefix: "",
    storyboardPromptSuffix: "",
    storyboardNegativePrompt: "",
    videoPromptPrefix: "",
    videoPromptSuffix: "",
    videoNegativePrompt: "",

    storyboardRenderingStrategy: RenderingStrategy.ON_DEMAND,
    videoRenderingStrategy: RenderingStrategy.ON_DEMAND,
    maxStoryboardsToGenerateInParallel: 1,
    maxVideosToGenerateInParallel: 1,

    comfyWorkflowForStoryboard: defaultWorkflowForStoryboards,
    comfyWorkflowForVideo: "{}",
    comfyWorkflowForSpeech: "{}",
    comfyWorkflowForSound: "{}",
    comfyWorkflowForMusic: "{}",
  
    // "HuggingFaceH4/zephyr-7b-beta"
    // "mistralai/Mixtral-8x7B-Instruct-v0.1",
    huggingFaceModelForAssistant: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    huggingFaceModelForImage: "sd-community/sdxl-flash",
    huggingFaceModelForVideo: "",
    huggingFaceModelForSpeech: "",
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
    replicateModelForSpeech: "lucataco/xtts-v2",
    replicateModelForSound: "sepal/audiogen",
    replicateModelForMusic: "meta/musicgen",
  
    stabilityAiModelForImage: "",
    stabilityAiModelForVideo: "",
    stabilityAiModelForSpeech: "",
    stabilityAiModelForSound: "",
    stabilityAiModelForMusic: "",
  
    falAiModelForImage: "fal-ai/fast-sdxl", // "fal-ai/fast-lightning-sdxl",
    falAiModelForVideo: "fal-ai/fast-animatediff/turbo/text-to-video",
    falAiModelForSpeech: "fal-ai/metavoice-v1",
    falAiModelForSound: "fal-ai/stable-audio",
    falAiModelForMusic: "fal-ai/stable-audio",
  
    modelsLabModelForImage: "",
    modelsLabModelForVideo: "",
    modelsLabModelForSpeech: "",
    modelsLabModelForSound: "",
    modelsLabModelForMusic: "",

    openaiModelForAssistant: "gpt-4-turbo",
    openaiModelForImage: "dall-e-3",
    openaiModelForVideo: "sora",
    openaiModelForSpeech: "v1",

    groqModelForAssistant: "mixtral-8x7b-32768",
  
    googleModelForAssistant: "gemini",
    googleModelForImage: "imagen",
    googleModelForVideo: "veo",
    googleModelForSpeech: "v1",
    googleModelForMusic: "MusicLM",

    anthropicModelForAssistant: "claude-3-opus-20240229",

    elevenLabsModelForSpeech: "v1",
    elevenLabsModelForSound: "v1",
  }
  return state
}
