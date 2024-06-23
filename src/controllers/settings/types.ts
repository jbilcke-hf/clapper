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
  kitsAiApiKey: string
  cohereApiKey: string
  mistralAiApiKey: string
  stabilityAiApiKey: string
  fireworksAiApiKey: string

  // ------------- CATEGORY PROVIDERS ---------------
  assistantProvider: ComputeProvider
  imageProvider: ComputeProvider
  imageDepthProvider: ComputeProvider
  imageSegmentationProvider: ComputeProvider
  imageUpscalingProvider: ComputeProvider
  videoProvider: ComputeProvider
  videoDepthProvider: ComputeProvider
  videoSegmentationProvider: ComputeProvider
  videoUpscalingProvider: ComputeProvider
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
  

  assistantModel: string
  assistantTurboModel: string
  imageGenerationModel: string
  imageGenerationTurboModel: string
  imageUpscalingModel: string
  imageDepthModel: string
  imageSegmentationModel: string
  videoGenerationModel: string
  videoUpscalingModel: string
  videoDepthModel: string
  videoSegmentationModel: string
  soundGenerationModel: string
  voiceGenerationModel: string
  musicGenerationModel: string

  imageRenderingStrategy: RenderingStrategy
  imageUpscalingRenderingStrategy: RenderingStrategy
  imageDepthRenderingStrategy: RenderingStrategy
  imageSegmentationRenderingStrategy: RenderingStrategy
  videoRenderingStrategy: RenderingStrategy
  videoUpscalingRenderingStrategy: RenderingStrategy
  videoDepthRenderingStrategy: RenderingStrategy
  videoSegmentationRenderingStrategy: RenderingStrategy
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


  gradioApiUrlForAssistant: string
  gradioApiUrlForImage: string
  gradioApiUrlForVideo: string
  gradioApiUrlForVoice: string
  gradioApiUrlForSound: string
  gradioApiUrlForMusic: string

  /*
  should we deprecate this? or rename to "default<something>"?
  huggingFaceModelForAssistant: string
  huggingFaceModelForImage: string
  huggingFaceModelForImageDepth: string
  huggingFaceModelForImageSegmentation: string
  huggingFaceModelForImageUpscaling: string
  huggingFaceModelForVideo: string
  huggingFaceModelForVideoDepth: string
  huggingFaceModelForVideoSegmentation: string
  huggingFaceModelForVideoUpscaling: string
  huggingFaceModelForVoice: string
  huggingFaceModelForSound: string
  huggingFaceModelForMusic: string

  replicateModelForImage: string
  replicateModelForImageDepth: string
  replicateModelForImageSegmentation: string
  replicateModelForImageUpscaling: string
  replicateModelForVideo: string
  replicateModelForVideoDepth: string
  replicateModelForVideoSegmentation: string
  replicateModelForVideoUpscaling: string
  replicateModelForVoice: string
  replicateModelForSound: string
  replicateModelForMusic: string

  stabilityAiModelForImage: string
  stabilityAiModelForVideo: string
  stabilityAiModelForVoice: string
  stabilityAiModelForSound: string
  stabilityAiModelForMusic: string

  fireworksAiModelForAssistant: string
  fireworksAiModelForImage: string
  fireworksAiModelForVideo: string
  fireworksAiModelForVoice: string
  fireworksAiModelForSound: string
  fireworksAiModelForMusic: string

  falAiModelForImage: string
  falAiModelForImageDepth: string
  falAiModelForImageSegmentation: string
  falAiModelForImageUpscaling: string
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

  kitsAiModelForVoice: string

  cohereModelForAssistant: string

  mistralAiModelForAssistant: string
  */
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
  setFireworksAiApiKey: (fireworksAiApiKey?: string) => void
  setAnthropicApiKey: (anthropicApiKey?: string) => void
  setElevenLabsApiKey: (elevenLabsApiKey?: string) => void
  setCohereApiKey: (cohereApiKey?: string) => void
  setMistralAiApiKey: (mistralAiApiKey?: string) => void
  setKitsAiApiKey: (kitsAiApiKey?: string) => void
  setStabilityAiApiKey: (stabilityAiApiKey?: string) => void

  setAssistantProvider: (assistantProvider?: ComputeProvider) => void
  setImageProvider: (imageProvider?: ComputeProvider) => void
  setImageDepthProvider: (imageDepthProvider?: ComputeProvider) => void
  setImageSegmentationProvider: (imageSegmentationProvider?: ComputeProvider) => void
  setImageUpscalingProvider: (imageUpscalingProvider?: ComputeProvider) => void
  setVideoProvider: (videoProvider?: ComputeProvider) => void
  setVideoDepthProvider: (videoDepthProvider?: ComputeProvider) => void
  setVideoSegmentationProvider: (videoSegmentationProvider?: ComputeProvider) => void
  setVideoUpscalingProvider: (videoUpscalingProvider?: ComputeProvider) => void
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

  setAssistantModel: (assistantModel?: string) => void
  setAssistantTurboModel: (assistantTurboModel?: string) => void
  setImageGenerationModel: (imageGenerationModel?: string) => void
  setImageGenerationTurboModel: (imageGenerationTurboModel?: string) => void
  setImageUpscalingModel: (imageUpscalingModel?: string) => void
  setImageDepthModel: (imageDepthModel?: string) => void
  setImageSegmentationModel: (imageSegmentationModel?: string) => void
  setVideoGenerationModel: (videoGenerationModel?: string) => void
  setVideoDepthModel: (videoDepthModel?: string) => void
  setVideoSegmentationModel: (videoSegmentationModel?: string) => void
  setVideoUpscalingModel: (videoUpscalingModel?: string) => void
  setSoundGenerationModel: (soundGenerationModel?: string) => void
  setVoiceGenerationModel: (voiceGenerationModel?: string) => void
  setMusicGenerationModel: (musicGenerationModel?: string) => void
  
  setImageRenderingStrategy: (imageRenderingStrategy?: RenderingStrategy) => void
  setImageUpscalingRenderingStrategy: (imageUpscalingRenderingStrategy?: RenderingStrategy) => void
  setImageDepthRenderingStrategy: (imageDepthRenderingStrategy?: RenderingStrategy) => void
  setImageSegmentationRenderingStrategy: (imageSegmentationRenderingStrategy?: RenderingStrategy) => void
  setVideoRenderingStrategy: (videoRenderingStrategy?: RenderingStrategy) => void
  setVideoDepthRenderingStrategy: (videoDepthRenderingStrategy?: RenderingStrategy) => void
  setVideoSegmentationRenderingStrategy: (videoSegmentationRenderingStrategy?: RenderingStrategy) => void
  setVideoUpscalingRenderingStrategy: (videoUpscalingRenderingStrategy?: RenderingStrategy) => void
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

  setGradioApiUrlForAssistant: (gradioApiUrlForAssistant?: string) => void
  setGradioApiUrlForImage: (gradioApiUrlForImage?: string) => void
  setGradioApiUrlForVideo: (gradioApiUrlForVideo?: string) => void
  setGradioApiUrlForVoice: (gradioApiUrlForVoice?: string) => void
  setGradioApiUrlForSound: (gradioApiUrlForSound?: string) => void
  setGradioApiUrlForMusic: (gradioApiUrlForMusic?: string) => void

  /*
  should we deprecate this? or rename to "default<something>"?
  setHuggingFaceModelForAssistant: (huggingFaceModelForAssistant?: string) => void
  setHuggingFaceModelForImage: (huggingFaceModelForImage?: string) => void
  setHuggingFaceModelForImageDepth: (huggingFaceModelForImageDepth?: string) => void
  setHuggingFaceModelForImageSegmentation: (huggingFaceModelForImageSegmentation?: string) => void
  setHuggingFaceModelForImageUpscaling: (huggingFaceModelForImageUpscaling?: string) => void
  setHuggingFaceModelForVideo: (huggingFaceModelForVideo?: string) => void
  setHuggingFaceModelForVideoDepth: (huggingFaceModelForVideoDepth?: string) => void
  setHuggingFaceModelForVideoSegmentation: (huggingFaceModelForVideoSegmentation?: string) => void
  setHuggingFaceModelForVideoUpscaling: (huggingFaceModelForVideoUpscaling?: string) => void
  setHuggingFaceModelForVoice: (huggingFaceModelForVoice?: string) => void
  setHuggingFaceModelForSound: (huggingFaceModelForSound?: string) => void
  setHuggingFaceModelForMusic: (huggingFaceModelForMusic?: string) => void

  setReplicateModelForImage: (replicateModelForImage?: string) => void
  setReplicateModelForImageDepth: (replicateModelForImageDepth?: string) => void
  setReplicateModelForImageSegmentation: (replicateModelForImageSegmentation?: string) => void
  setReplicateModelForImageUpscaling: (replicateModelForImageUpscaling?: string) => void
  setReplicateModelForVideo: (replicateModelForVideo?: string) => void
  setReplicateModelForVideoDepth: (replicateModelForVideoDepth?: string) => void
  setReplicateModelForVideoSegmentation: (replicateModelForVideoSegmentation?: string) => void
  setReplicateModelForVideoUpscaling: (replicateModelForVideoUpscaling?: string) => void
  setReplicateModelForVoice: (replicateModelForVoice?: string) => void
  setReplicateModelForSound: (replicateModelForSound?: string) => void
  setReplicateModelForMusic: (replicateModelForMusic?: string) => void

  setStabilityAiModelForImage: (stabilityAiModelForImage?: string) => void
  setStabilityAiModelForVideo: (stabilityAiModelForVideo?: string) => void
  setStabilityAiModelForVoice: (stabilityAiModelForVoice?: string) => void
  setStabilityAiModelForSound: (stabilityAiModelForSound?: string) => void
  setStabilityAiModelForMusic: (stabilityAiModelForMusic?: string) => void

  setFireworksAiModelForAssistant: (fireworksAiModelForAssistant?: string) => void
  setFireworksAiModelForImage: (fireworksAiModelForImage?: string) => void
  setFireworksAiModelForVideo: (fireworksAiModelForVideo?: string) => void
  setFireworksAiModelForVoice: (fireworksAiModelForVoice?: string) => void
  setFireworksAiModelForSound: (fireworksAiModelForSound?: string) => void
  setFireworksAiModelForMusic: (fireworksAiModelForMusic?: string) => void

  setFalAiModelForImage: (falAiModelForImage?: string) => void
  setFalAiModelForImageDepth: (falAiModelForImageDepth?: string) => void
  setFalAiModelForImageSegmentation: (falAiModelForImageSegmentation?: string) => void
  setFalAiModelForImageUpscaling: (falAiModelForImageUpscaling?: string) => void
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
  
  setCohereModelForAssistant: (cohereModelForAssistant?: string) => void
  setMistralAiModelForAssistant: (mistralAiModelForAssistant?: string) => void
  
  setKitsAiModelForVoice: (kitsAiModelForVoice?: string) => void
  */
  getSettings: () => SettingsState
}

export type SettingsStore =
  SettingsState &
  SettingsControls