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
  imageProvider: ComputeProvider
  voiceProvider: ComputeProvider
  soundProvider: ComputeProvider
  musicProvider: ComputeProvider

  // -------------- SAFETY CHECKER ------------------

  censorNotForAllAudiencesContent: boolean

  // -------------- MISC SETTINGS -------------------

  imagePromptPrefix: string
  imagePromptSuffix: string
  imageNegativePrompt: string
  videoPromptPrefix: string
  videoPromptSuffix: string
  videoNegativePrompt: string

  imageRenderingStrategy: RenderingStrategy
  videoRenderingStrategy: RenderingStrategy
  voiceRenderingStrategy: RenderingStrategy
  soundRenderingStrategy: RenderingStrategy
  musicRenderingStrategy: RenderingStrategy

  maxImagesToGenerateInParallel: number
  maxVideosToGenerateInParallel: number

  // ------------ COMFY UI WORKFLOWS -----------------
  comfyWorkflowForImage: string
  comfyWorkflowForVideo: string
  comfyWorkflowForVoice: string
  comfyWorkflowForSound: string
  comfyWorkflowForMusic: string

  // ---------- MODELS FOR EACH PROVIDER --------------

  huggingFaceModelForAssistant: string
  huggingFaceModelForImage: string
  huggingFaceModelForVideo: string
  huggingFaceModelForVoice: string
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
  replicateModelForVoice: string
  replicateModelForSound: string
  replicateModelForMusic: string

  stabilityAiModelForImage: string
  stabilityAiModelForVideo: string
  stabilityAiModelForVoice: string
  stabilityAiModelForSound: string
  stabilityAiModelForMusic: string

  falAiModelForImage: string
  falAiModelForVideo: string
  falAiModelForVoice: string
  falAiModelForSound: string
  falAiModelForMusic: string

  modelsLabModelForImage: string
  modelsLabModelForVideo: string
  modelsLabModelForVoice: string
  modelsLabModelForSound: string
  modelsLabModelForMusic: string

  openaiModelForAssistant: string
  openaiModelForImage: string
  openaiModelForVideo: string
  openaiModelForVoice: string

  groqModelForAssistant: string

  googleModelForAssistant: string
  googleModelForImage: string
  googleModelForVideo: string
  googleModelForVoice: string
  googleModelForMusic: string

  anthropicModelForAssistant: string

  elevenLabsModelForVoice: string
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
  setImageProvider: (imageProvider?: ComputeProvider) => void
  setVoiceProvider: (voiceProvider?: ComputeProvider) => void
  setSoundProvider: (soundProvider?: ComputeProvider) => void
  setMusicProvider: (musicProvider?: ComputeProvider) => void

  setCensorNotForAllAudiencesContent: (censorNotForAllAudiencesContent?: boolean) => void
  setImagePromptPrefix: (imagePromptPrefix?: string) => void
  setImagePromptSuffix: (imagePromptSuffix?: string) => void
  setImageNegativePrompt: (imageNegativePrompt?: string) => void
  setVideoPromptPrefix: (videoPromptPrefix?: string) => void
  setVideoPromptSuffix: (videoPromptSuffix?: string) => void
  setVideoNegativePrompt: (videoNegativePrompt?: string) => void

  setImageRenderingStrategy: (imageRenderingStrategy?: RenderingStrategy) => void
  setVideoRenderingStrategy: (videoRenderingStrategy?: RenderingStrategy) => void
  setVoiceRenderingStrategy: (voiceRenderingStrategy?: RenderingStrategy) => void
  setSoundRenderingStrategy: (soundRenderingStrategy?: RenderingStrategy) => void
  setMusicRenderingStrategy: (musicRenderingStrategy?: RenderingStrategy) => void

  setMaxImagesToGenerateInParallel: (maxImagesToGenerateInParallel?: number) => void
  setMaxVideosToGenerateInParallel: (maxVideosToGenerateInParallel?: number) => void

  setComfyWorkflowForImage: (comfyWorkflowForImage?: string) => void
  setComfyWorkflowForVideo: (comfyWorkflowForVideo?: string) => void
  setComfyWorkflowForVoice: (comfyWorkflowForVoice?: string) => void
  setComfyWorkflowForSound: (comfyWorkflowForSound?: string) => void
  setComfyWorkflowForMusic: (comfyWorkflowForMusic?: string) => void

  setHuggingFaceModelForAssistant: (huggingFaceModelForAssistant?: string) => void
  setHuggingFaceModelForImage: (huggingFaceModelForImage?: string) => void
  setHuggingFaceModelForVideo: (huggingFaceModelForVideo?: string) => void
  setHuggingFaceModelForVoice: (huggingFaceModelForVoice?: string) => void
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
  setReplicateModelForVoice: (replicateModelForVoice?: string) => void
  setReplicateModelForSound: (replicateModelForSound?: string) => void
  setReplicateModelForMusic: (replicateModelForMusic?: string) => void

  setStabilityAiModelForImage: (stabilityAiModelForImage?: string) => void
  setStabilityAiModelForVideo: (stabilityAiModelForVideo?: string) => void
  setStabilityAiModelForVoice: (stabilityAiModelForVoice?: string) => void
  setStabilityAiModelForSound: (stabilityAiModelForSound?: string) => void
  setStabilityAiModelForMusic: (stabilityAiModelForMusic?: string) => void

  setFalAiModelForImage: (falAiModelForImage?: string) => void
  setFalAiModelForVideo: (falAiModelForVideo?: string) => void
  setFalAiModelForVoice: (falAiModelForVoice?: string) => void
  setFalAiModelForSound: (falAiModelForSound?: string) => void
  setFalAiModelForMusic: (falAiModelForMusic?: string) => void

  setModelsLabModelForImage: (modelsLabModelForImage?: string) => void
  setModelsLabModelForVideo: (modelsLabModelForVideo?: string) => void
  setModelsLabModelForVoice: (modelsLabModelForVoice?: string) => void
  setModelsLabModelForSound: (modelsLabModelForSound?: string) => void
  setModelsLabModelForMusic: (modelsLabModelForMusic?: string) => void

  setOpenaiModelForAssistant: (openaiModelForAssistant?: string) => void
  setOpenaiModelForImage: (openaiModelForImage?: string) => void
  setOpenaiModelForVideo: (openaiModelForVideo?: string) => void
  setOpenaiModelForVoice: (openaiModelForVoice?: string) => void

  setGroqModelForAssistant: (groqModelForAssistant?: string) => void

  setGoogleModelForAssistant: (googleModelForAssistant?: string) => void
  setGoogleModelForImage: (googleModelForImage?: string) => void
  setGoogleModelForVideo: (googleModelForVideo?: string) => void
  setGoogleModelForVoice: (googleModelForVoice?: string) => void
  setGoogleModelForMusic: (googleModelForMusic?: string) => void

  setAnthropicModelForAssistant: (anthropicModelForAssistant?: string) => void
  
  setElevenLabsModelForVoice: (elevenLabsModelForVoice?: string) => void
  setElevenLabsModelForSound: (elevenLabsModelForSound?: string) => void
  
  getSettings: () => SettingsState
}

export type SettingsStore =
  SettingsState &
  SettingsControls