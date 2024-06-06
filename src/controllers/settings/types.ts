import { RenderingStrategy } from "@aitube/timeline"

import { ComfyIcuAccelerator, ComputeProvider } from "@/types"

export type SettingsState = {
  customComfyUiApiKey: string
  replicateApiKey: string
  comfyIcuApiKey: string
  comfyIcuAccelerator: ComfyIcuAccelerator
  falAiApiKey: string
  modelsLabApiKey: string
  huggingFaceApiKey: string
  openaiApiKey: string
  googleApiKey: string
  groqApiKey: string
  anthropicApiKey: string
  elevenLabsApiKey: string

  // ------------- CATEGORY PROVIDERS ---------------
  assistantProvider: ComputeProvider
  videoProvider: ComputeProvider
  storyboardProvider: ComputeProvider
  speechProvider: ComputeProvider
  soundProvider: ComputeProvider
  musicProvider: ComputeProvider

  // -------------- SAFETY CHECKER ------------------

  censorNotForAllAudiencesContent: boolean

  // -------------- MISC SETTINGS -------------------

  storyboardRenderingStrategy: RenderingStrategy
  videoRenderingStrategy: RenderingStrategy
  maxStoryboardsToGenerateInParallel: number
  maxVideosToGenerateInParallel: number

  // ------------ COMFY UI WORKFLOWS -----------------
  comfyWorkflowForStoryboard: string
  comfyWorkflowForVideo: string
  comfyWorkflowForSpeech: string
  comfyWorkflowForSound: string
  comfyWorkflowForMusic: string

  // ---------- MODELS FOR EACH PROVIDER --------------

  huggingFaceModelForAssistant: string
  huggingFaceModelForImage: string
  huggingFaceModelForVideo: string
  huggingFaceModelForSpeech: string
  huggingFaceModelForSound: string
  huggingFaceModelForMusic: string

  gradioApiUrlForAssistant: string
  gradioApiUrlForImage: string
  gradioApiUrlForVideo: string
  gradioApiUrlForSpeech: string
  gradioApiUrlForSound: string
  gradioApiUrlForMusic: string

  replicateModelForImage: string
  replicateModelForVideo: string
  replicateModelForSpeech: string
  replicateModelForSound: string
  replicateModelForMusic: string

  stabilityAiModelForImage: string
  stabilityAiModelForVideo: string
  stabilityAiModelForSpeech: string
  stabilityAiModelForSound: string
  stabilityAiModelForMusic: string

  falAiModelForImage: string
  falAiModelForVideo: string
  falAiModelForSpeech: string
  falAiModelForSound: string
  falAiModelForMusic: string

  modelsLabModelForImage: string
  modelsLabModelForVideo: string
  modelsLabModelForSpeech: string
  modelsLabModelForSound: string
  modelsLabModelForMusic: string

  openaiModelForAssistant: string
  openaiModelForImage: string
  openaiModelForVideo: string
  openaiModelForSpeech: string

  groqModelForAssistant: string

  googleModelForAssistant: string
  googleModelForImage: string
  googleModelForVideo: string
  googleModelForSpeech: string
  googleModelForMusic: string

  anthropicModelForAssistant: string

  elevenLabsModelForSpeech: string
  elevenLabsModelForSound: string
}

export type SettingsControls = {
  setCustomComfyUiApiKey: (customComfyUiApiKey?: string) => void
  setReplicateApiKey: (replicateApiKey?: string) => void
  setComfyIcuApiKey: (comfyIcuApiKey?: string) => void
  setComfyIcuAccelerator: (comfyIcuAccelerator?: ComfyIcuAccelerator) => void
  setHuggingFaceApiKey: (huggingFaceApiKey?: string) => void
  setModelsLabApiKey: (modelsLabApiKey?: string) => void
  setFalAiApiKey: (falAiApiKey?: string) => void
  
  setOpenaiApiKey: (openaiApiKey?: string) => void
  setGoogleApiKey: (googleApiKey?: string) => void
  setGroqApiKey: (groqApiKey?: string) => void
  setAnthropicApiKey: (anthropicApiKey?: string) => void
  setElevenLabsApiKey: (elevenLabsApiKey?: string) => void

  setAssistantProvider: (assistantProvider?: ComputeProvider) => void
  setVideoProvider: (videoProvider?: ComputeProvider) => void
  setStoryboardProvider: (storyboardProvider?: ComputeProvider) => void
  setSpeechProvider: (speechProvider?: ComputeProvider) => void
  setSoundProvider: (soundProvider?: ComputeProvider) => void
  setMusicProvider: (musicProvider?: ComputeProvider) => void

  setCensorNotForAllAudiencesContent: (censorNotForAllAudiencesContent?: boolean) => void
  setStoryboardRenderingStrategy: (storyboardRenderingStrategy?: RenderingStrategy) => void
  setVideoRenderingStrategy: (videoRenderingStrategy?: RenderingStrategy) => void
  setMaxStoryboardsToGenerateInParallel: (maxStoryboardsToGenerateInParallel?: number) => void
  setMaxVideosToGenerateInParallel: (maxVideosToGenerateInParallel?: number) => void

  setComfyWorkflowForStoryboard: (comfyWorkflowForStoryboard?: string) => void
  setComfyWorkflowForVideo: (comfyWorkflowForVideo?: string) => void
  setComfyWorkflowForSpeech: (comfyWorkflowForSpeech?: string) => void
  setComfyWorkflowForSound: (comfyWorkflowForSound?: string) => void
  setComfyWorkflowForMusic: (comfyWorkflowForMusic?: string) => void

  setHuggingFaceModelForAssistant: (huggingFaceModelForAssistant?: string) => void
  setHuggingFaceModelForImage: (huggingFaceModelForImage?: string) => void
  setHuggingFaceModelForVideo: (huggingFaceModelForVideo?: string) => void
  setHuggingFaceModelForSpeech: (huggingFaceModelForSpeech?: string) => void
  setHuggingFaceModelForSound: (huggingFaceModelForSound?: string) => void
  setHuggingFaceModelForMusic: (huggingFaceModelForMusic?: string) => void

  setGradioApiUrlForAssistant: (gradioApiUrlForAssistant?: string) => void
  setGradioApiUrlForImage: (gradioApiUrlForImage?: string) => void
  setGradioApiUrlForVideo: (gradioApiUrlForVideo?: string) => void
  setGradioApiUrlForSpeech: (gradioApiUrlForSpeech?: string) => void
  setGradioApiUrlForSound: (gradioApiUrlForSound?: string) => void
  setGradioApiUrlForMusic: (gradioApiUrlForMusic?: string) => void

  setReplicateModelForImage: (replicateModelForImage?: string) => void
  setReplicateModelForVideo: (replicateModelForVideo?: string) => void
  setReplicateModelForSpeech: (replicateModelForSpeech?: string) => void
  setReplicateModelForSound: (replicateModelForSound?: string) => void
  setReplicateModelForMusic: (replicateModelForMusic?: string) => void

  setStabilityAiModelForImage: (stabilityAiModelForImage?: string) => void
  setStabilityAiModelForVideo: (stabilityAiModelForVideo?: string) => void
  setStabilityAiModelForSpeech: (stabilityAiModelForSpeech?: string) => void
  setStabilityAiModelForSound: (stabilityAiModelForSound?: string) => void
  setStabilityAiModelForMusic: (stabilityAiModelForMusic?: string) => void

  setFalAiModelForImage: (falAiModelForImage?: string) => void
  setFalAiModelForVideo: (falAiModelForVideo?: string) => void
  setFalAiModelForSpeech: (falAiModelForSpeech?: string) => void
  setFalAiModelForSound: (falAiModelForSound?: string) => void
  setFalAiModelForMusic: (falAiModelForMusic?: string) => void

  setModelsLabModelForImage: (modelsLabModelForImage?: string) => void
  setModelsLabModelForVideo: (modelsLabModelForVideo?: string) => void
  setModelsLabModelForSpeech: (modelsLabModelForSpeech?: string) => void
  setModelsLabModelForSound: (modelsLabModelForSound?: string) => void
  setModelsLabModelForMusic: (modelsLabModelForMusic?: string) => void

  setOpenaiModelForAssistant: (openaiModelForAssistant?: string) => void
  setOpenaiModelForImage: (openaiModelForImage?: string) => void
  setOpenaiModelForVideo: (openaiModelForVideo?: string) => void
  setOpenaiModelForSpeech: (openaiModelForSpeech?: string) => void

  setGroqModelForAssistant: (groqModelForAssistant?: string) => void

  setGoogleModelForAssistant: (googleModelForAssistant?: string) => void
  setGoogleModelForImage: (googleModelForImage?: string) => void
  setGoogleModelForVideo: (googleModelForVideo?: string) => void
  setGoogleModelForSpeech: (googleModelForSpeech?: string) => void
  setGoogleModelForMusic: (googleModelForMusic?: string) => void

  setAnthropicModelForAssistant: (anthropicModelForAssistant?: string) => void
  
  setElevenLabsModelForSpeech: (elevenLabsModelForSpeech?: string) => void
  setElevenLabsModelForSound: (elevenLabsModelForSound?: string) => void
  
  getSettings: () => SettingsState
}

export type SettingsStore =
  SettingsState &
  SettingsControls