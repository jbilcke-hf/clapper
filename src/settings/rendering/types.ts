import { RenderingStrategy } from "@aitube/timeline"

import { ComfyIcuAccelerator, ComputeProvider } from "@/types"

export type SettingsRenderingState = {
  customComfyUiApiKey: string
  replicateApiKey: string
  comfyIcuApiKey: string
  comfyIcuAccelerator: ComfyIcuAccelerator
  falAiApiKey: string
  modelsLabApiKey: string
  huggingFaceApiKey: string
  assistantProvider: ComputeProvider
  videoProvider: ComputeProvider
  storyboardProvider: ComputeProvider
  speechProvider: ComputeProvider
  soundProvider: ComputeProvider
  musicProvider: ComputeProvider
  storyboardRenderingStrategy: RenderingStrategy
  videoRenderingStrategy: RenderingStrategy
  maxStoryboardsToGenerateInParallel: number
  maxVideosToGenerateInParallel: number

  comfyWorkflowForStoryboard: string
  comfyWorkflowForVideo: string
  comfyWorkflowForSpeech: string
  comfyWorkflowForSound: string
  comfyWorkflowForMusic: string

  huggingFaceModelForImage: string
  huggingFaceModelForVideo: string
  huggingFaceModelForSpeech: string
  huggingFaceModelForSound: string
  huggingFaceModelForMusic: string

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
}

export type SettingsRenderingControls = {
  setCustomComfyUiApiKey: (customComfyUiApiKey?: string) => void
  setReplicateApiKey: (replicateApiKey?: string) => void
  setComfyIcuApiKey: (comfyIcuApiKey?: string) => void
  setComfyIcuAccelerator: (comfyIcuAccelerator?: ComfyIcuAccelerator) => void
  setHuggingFaceApiKey: (huggingFaceApiKey?: string) => void
  setModelsLabApiKey: (modelsLabApiKey?: string) => void
  setFalAiApiKey: (falAiApiKey?: string) => void

  setAssistantProvider: (assistantProvider?: ComputeProvider) => void
  setVideoProvider: (videoProvider?: ComputeProvider) => void
  setStoryboardProvider: (storyboardProvider?: ComputeProvider) => void
  setSpeechProvider: (speechProvider?: ComputeProvider) => void
  setSoundProvider: (soundProvider?: ComputeProvider) => void
  setMusicProvider: (musicProvider?: ComputeProvider) => void

  setStoryboardRenderingStrategy: (storyboardRenderingStrategy?: RenderingStrategy) => void
  setVideoRenderingStrategy: (videoRenderingStrategy?: RenderingStrategy) => void
  setMaxStoryboardsToGenerateInParallel: (maxStoryboardsToGenerateInParallel?: number) => void
  setMaxVideosToGenerateInParallel: (maxVideosToGenerateInParallel?: number) => void

  setComfyWorkflowForStoryboard: (comfyWorkflowForStoryboard?: string) => void
  setComfyWorkflowForVideo: (comfyWorkflowForVideo?: string) => void
  setComfyWorkflowForSpeech: (comfyWorkflowForSpeech?: string) => void
  setComfyWorkflowForSound: (comfyWorkflowForSound?: string) => void
  setComfyWorkflowForMusic: (comfyWorkflowForMusic?: string) => void

  setHuggingFaceModelForImage: (huggingFaceModelForImage?: string) => void
  setHuggingFaceModelForVideo: (huggingFaceModelForVideo?: string) => void
  setHuggingFaceModelForSpeech: (huggingFaceModelForSpeech?: string) => void
  setHuggingFaceModelForSound: (huggingFaceModelForSound?: string) => void
  setHuggingFaceModelForMusic: (huggingFaceModelForMusic?: string) => void

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

  getSettings: () => SettingsRenderingState
}

export type SettingsRenderingStore =
  SettingsRenderingState &
  SettingsRenderingControls