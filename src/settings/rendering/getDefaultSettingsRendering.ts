import { RenderingStrategy } from "@aitube/timeline"

import { ComfyIcuAccelerator, ComputeProvider } from "@/types"

import { SettingsRenderingState } from "./types"
import { defaultWorkflowForStoryboards } from "./workflows/storyboard"

export function getDefaultSettingsRendering(): SettingsRenderingState {
  const state: SettingsRenderingState = {
    assistantProvider: ComputeProvider.NONE,
    storyboardProvider: ComputeProvider.NONE,
    videoProvider: ComputeProvider.NONE,
    soundProvider: ComputeProvider.NONE,
    speechProvider: ComputeProvider.NONE,
    musicProvider: ComputeProvider.NONE,

    customComfyUiApiKey: "",
    replicateApiKey: "",
    comfyIcuApiKey: "",
    comfyIcuAccelerator: ComfyIcuAccelerator.L4,
    huggingFaceApiKey: "",
    modelsLabApiKey: "",
    falAiApiKey: "",
    storyboardRenderingStrategy: RenderingStrategy.ON_DEMAND,
    videoRenderingStrategy: RenderingStrategy.ON_DEMAND,
    maxStoryboardsToGenerateInParallel: 1,
    maxVideosToGenerateInParallel: 1,

    comfyWorkflowForStoryboard: defaultWorkflowForStoryboards,
    comfyWorkflowForVideo: "{}",
    comfyWorkflowForSpeech: "{}",
    comfyWorkflowForSound: "{}",
    comfyWorkflowForMusic: "{}",
  
    huggingFaceModelForImage: "sd-community/sdxl-flash",
    huggingFaceModelForVideo: "",
    huggingFaceModelForSpeech: "",
    huggingFaceModelForSound: "",
    huggingFaceModelForMusic: "",
  
    replicateModelForImage: "chenxwh/sdxl-flash:001bb81139b01780380407b4106ac681df46108e002eafbeb9ccb2d8faca42e1",

    // note: this model doesn't support width and height parameters
    replicateModelForVideo: "camenduru/animatediff-lightning-4-step:be39c6d599942831314b770f03cfd062bfd0faa8cc52e9289bcce830b721fcb6",
    replicateModelForSpeech: "",
    replicateModelForSound: "",
    replicateModelForMusic: "",
  
    stabilityAiModelForImage: "",
    stabilityAiModelForVideo: "",
    stabilityAiModelForSpeech: "",
    stabilityAiModelForSound: "",
    stabilityAiModelForMusic: "",
  
    falAiModelForImage: "",
    falAiModelForVideo: "",
    falAiModelForSpeech: "",
    falAiModelForSound: "",
    falAiModelForMusic: "",
  
    modelsLabModelForImage: "",
    modelsLabModelForVideo: "",
    modelsLabModelForSpeech: "",
    modelsLabModelForSound: "",
    modelsLabModelForMusic: "",
  }
  return state
}
