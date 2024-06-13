"use client"

import { create } from "zustand"
import { persist } from 'zustand/middleware'
import { getValidNumber } from "@aitube/clap"
import { parseRenderingStrategy, RenderingStrategy } from "@aitube/timeline"

import { ComfyIcuAccelerator, ComputeProvider } from "@/types"
import { getValidBoolean, getValidString, parseComputeProvider } from "@/lib/utils"
import { HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL } from "@/lib/core/constants"

import { SettingsState, SettingsStore } from "./types"
import { getDefaultSettingsState } from "./getDefaultSettingsState"
import { getValidComfyWorkflowTemplate } from "@/lib/utils/getValidComfyWorkflowTemplate"
import { parseComfyIcuAccelerator } from "@/lib/utils/parseComfyIcuAccelerator"

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...getDefaultSettingsState(),

      setAssistantProvider: (assistantProvider?: ComputeProvider) => {
        const { videoProvider: defaultAssistantProvider } = getDefaultSettingsState()
        set({assistantProvider: parseComputeProvider(assistantProvider, defaultAssistantProvider) })
      },
      setVideoProvider: (videoProvider?: ComputeProvider) => {
        const { videoProvider: defaultVideoProvider } = getDefaultSettingsState()
        set({ videoProvider: parseComputeProvider(videoProvider, defaultVideoProvider) })
      },
      setImageProvider: (imageProvider?: ComputeProvider) => {
        const { imageProvider: defaultImageProvider } = getDefaultSettingsState()
        set({ imageProvider: parseComputeProvider(imageProvider, defaultImageProvider) })
      },
      setVoiceProvider: (voiceProvider?: ComputeProvider) => {
        const { voiceProvider: defaultSpeechProvider } = getDefaultSettingsState()
        set({ voiceProvider: parseComputeProvider(voiceProvider, defaultSpeechProvider) })
      },
      setSoundProvider: (soundProvider?: ComputeProvider) => {
        const { soundProvider: defaultSoundProvider } = getDefaultSettingsState()
        set({ soundProvider: parseComputeProvider(soundProvider, defaultSoundProvider) })
      },
      setMusicProvider: (musicProvider?: ComputeProvider) => {
        const { musicProvider: defaultMusicProvider } = getDefaultSettingsState()
        set({ musicProvider: parseComputeProvider(musicProvider, defaultMusicProvider) })
      },
      setCustomComfyUiApiKey: (customComfyUiApiKey?: string) => {
        const { customComfyUiApiKey: defaulCustomComfyUiApiKey } = getDefaultSettingsState()
        set({ customComfyUiApiKey: getValidString(customComfyUiApiKey, defaulCustomComfyUiApiKey) })
      },
      setReplicateApiKey: (replicateApiKey?: string) => {
        const { replicateApiKey: defaultReplicateApiKey } = getDefaultSettingsState()
        set({ replicateApiKey: getValidString(replicateApiKey, defaultReplicateApiKey) })
      },
      setComfyIcuApiKey: (comfyIcuApiKey?: string) => {
        const { comfyIcuApiKey: defaultComfyIcuApiKey } = getDefaultSettingsState()
        set({ comfyIcuApiKey: getValidString(comfyIcuApiKey, defaultComfyIcuApiKey) })
      },
      setComfyIcuAccelerator: (comfyIcuAccelerator?: ComfyIcuAccelerator) => {
        const { comfyIcuAccelerator: defaulComfyIcuAccelerator } = getDefaultSettingsState()
        set({ comfyIcuAccelerator: parseComfyIcuAccelerator(comfyIcuAccelerator, defaulComfyIcuAccelerator) })
      },
      setHuggingFaceApiKey: (huggingFaceApiKey?: string) => {
        const { huggingFaceApiKey: defaultHuggingFaceApiKey } = getDefaultSettingsState()
        set({ huggingFaceApiKey: getValidString(huggingFaceApiKey, defaultHuggingFaceApiKey) })
      },
      setFalAiApiKey: (falAiApiKey?: string) => {
        set({ falAiApiKey: getValidString(falAiApiKey, getDefaultSettingsState().falAiApiKey) })
      },
      setModelsLabApiKey: (modelsLabApiKey?: string) => {
        set({ modelsLabApiKey: getValidString(modelsLabApiKey, getDefaultSettingsState().modelsLabApiKey) })
      },
      setOpenaiApiKey: (openaiApiKey?: string) => {
        set({ openaiApiKey: getValidString(openaiApiKey, getDefaultSettingsState().openaiApiKey) })
      },
      setGroqApiKey: (groqApiKey?: string) => {
        set({ groqApiKey: getValidString(groqApiKey, getDefaultSettingsState().groqApiKey) })
      },
      setGoogleApiKey: (googleApiKey?: string) => {
        set({ googleApiKey: getValidString(googleApiKey, getDefaultSettingsState().googleApiKey) })
      },
      setAnthropicApiKey: (anthropicApiKey?: string) => {
        set({ anthropicApiKey: getValidString(anthropicApiKey, getDefaultSettingsState().anthropicApiKey) })
      },
      setElevenLabsApiKey: (elevenLabsApiKey?: string) => {
        set({ elevenLabsApiKey: getValidString(elevenLabsApiKey, getDefaultSettingsState().elevenLabsApiKey) })
      },
      setKitsAiApiKey: (kitsAiApiKey?: string) => {
        set({ kitsAiApiKey: getValidString(kitsAiApiKey, getDefaultSettingsState().kitsAiApiKey) })
      },
      setCohereApiKey: (cohereApiKey?: string) => {
        set({ cohereApiKey: getValidString(cohereApiKey, getDefaultSettingsState().cohereApiKey) })
      },
      setMistralAiApiKey: (mistralAiApiKey?: string) => {
        set({ mistralAiApiKey: getValidString(mistralAiApiKey, getDefaultSettingsState().mistralAiApiKey) })
      },
      setFireworksAiApiKey: (fireworksAiApiKey?: string) => {
        set({ fireworksAiApiKey: getValidString(fireworksAiApiKey, getDefaultSettingsState().fireworksAiApiKey) })
      },
      setStabilityAiApiKey: (stabilityAiApiKey?: string) => {
        set({ stabilityAiApiKey: getValidString(stabilityAiApiKey, getDefaultSettingsState().stabilityAiApiKey) })
      },
      setCensorNotForAllAudiencesContent: (censorNotForAllAudiencesContent?: boolean) => {
        set({ censorNotForAllAudiencesContent: getValidBoolean(censorNotForAllAudiencesContent, getDefaultSettingsState().censorNotForAllAudiencesContent) })
      },
      setImagePromptPrefix: (imagePromptPrefix?: string) => {
        set({ imagePromptPrefix: getValidString(imagePromptPrefix, getDefaultSettingsState().imagePromptPrefix) })
      },
      setImagePromptSuffix: (imagePromptSuffix?: string) => {
        set({ imagePromptSuffix: getValidString(imagePromptSuffix, getDefaultSettingsState().imagePromptSuffix) })
      },
      setImageNegativePrompt: (imageNegativePrompt?: string) => {
        set({ imageNegativePrompt: getValidString(imageNegativePrompt, getDefaultSettingsState().imageNegativePrompt) })
      },
      setVideoPromptPrefix: (videoPromptPrefix?: string) => {
        set({ videoPromptPrefix: getValidString(videoPromptPrefix, getDefaultSettingsState().videoPromptPrefix) })
      },
      setVideoPromptSuffix: (videoPromptSuffix?: string) => {
        set({ videoPromptSuffix: getValidString(videoPromptSuffix, getDefaultSettingsState().videoPromptSuffix) })
      },
      setVideoNegativePrompt: (videoNegativePrompt?: string) => {
        set({ videoNegativePrompt: getValidString(videoNegativePrompt, getDefaultSettingsState().videoNegativePrompt) })
      },
      setAssistantModel: (assistantModel?: string) => {
        const { assistantModel: defaultAssistantModel } = getDefaultSettingsState()
        set({ assistantModel: getValidString(assistantModel, defaultAssistantModel) })
      },
      setAssistantTurboModel: (assistantTurboModel?: string) => {
        const { assistantTurboModel: defaultAssistantTurboModel } = getDefaultSettingsState()
        set({ assistantTurboModel: getValidString(assistantTurboModel, defaultAssistantTurboModel) })
      },
      setImageGenerationModel: (imageGenerationModel?: string) => {
        const { imageGenerationModel: defaultImageGenerationModel } = getDefaultSettingsState()
        set({ imageGenerationModel: getValidString(imageGenerationModel, defaultImageGenerationModel) })
      },
      setImageGenerationTurboModel: (imageGenerationTurboModel?: string) => {
        const { imageGenerationTurboModel: defaultImageGenerationTurboModel } = getDefaultSettingsState()
        set({ imageGenerationTurboModel: getValidString(imageGenerationTurboModel, defaultImageGenerationTurboModel) })
      },
      setImageUpscalingModel: (imageUpscalingModel?: string) => {
        const { imageUpscalingModel: defaultImageUpscalingModel } = getDefaultSettingsState()
        set({ imageUpscalingModel: getValidString(imageUpscalingModel, defaultImageUpscalingModel) })
      },
      setVideoGenerationModel: (videoGenerationModel?: string) => {
        const { videoGenerationModel: defaultVideoGenerationModel } = getDefaultSettingsState()
        set({ videoGenerationModel: getValidString(videoGenerationModel, defaultVideoGenerationModel) })
      },
      setVideoUpscalingModel: (videoUpscalingModel?: string) => {
        const { videoUpscalingModel: defaultVideoUpscalingModel} = getDefaultSettingsState()
        set({ videoUpscalingModel: getValidString(videoUpscalingModel, defaultVideoUpscalingModel) })
      },
      setSoundGenerationModel: (soundGenerationModel?: string) => {
        const { soundGenerationModel: defaultSoundGenerationModel } = getDefaultSettingsState()
        set({ soundGenerationModel: getValidString(soundGenerationModel, defaultSoundGenerationModel) })
      },
      setVoiceGenerationModel: (voiceGenerationModel?: string) => {
        const { voiceGenerationModel: defaultVoiceGenerationModel } = getDefaultSettingsState()
        set({ voiceGenerationModel: getValidString(voiceGenerationModel, defaultVoiceGenerationModel) })
      },
      setMusicGenerationModel: (musicGenerationModel?: string) => {
        const { musicGenerationModel: defaultVoiceGenerationModel } = getDefaultSettingsState()
        set({ musicGenerationModel: getValidString(musicGenerationModel, defaultVoiceGenerationModel) })
      },
      setImageRenderingStrategy: (imageRenderingStrategy?: RenderingStrategy) => {
        const { imageRenderingStrategy: defaulImageRenderingStrategy } = getDefaultSettingsState()
        set({ imageRenderingStrategy: parseRenderingStrategy(imageRenderingStrategy, defaulImageRenderingStrategy) })
      },
      setVideoRenderingStrategy: (videoRenderingStrategy?: RenderingStrategy) => {
        const { videoRenderingStrategy: defaultVideoRenderingStrategy } = getDefaultSettingsState()
        set({ videoRenderingStrategy: parseRenderingStrategy(videoRenderingStrategy, defaultVideoRenderingStrategy) })
      },
      setVoiceRenderingStrategy: (voiceRenderingStrategy?: RenderingStrategy) => {
        const { voiceRenderingStrategy: defaultSpeechRenderingStrategy } = getDefaultSettingsState()
        set({ voiceRenderingStrategy: parseRenderingStrategy(voiceRenderingStrategy, defaultSpeechRenderingStrategy) })
      },
      setSoundRenderingStrategy: (soundRenderingStrategy?: RenderingStrategy) => {
        const { soundRenderingStrategy: defaultSoundRenderingStrategy } = getDefaultSettingsState()
        set({ soundRenderingStrategy: parseRenderingStrategy(soundRenderingStrategy, defaultSoundRenderingStrategy) })
      },
      setMusicRenderingStrategy: (musicRenderingStrategy?: RenderingStrategy) => {
        const { musicRenderingStrategy: defaultMusicRenderingStrategy } = getDefaultSettingsState()
        set({ musicRenderingStrategy: parseRenderingStrategy(musicRenderingStrategy, defaultMusicRenderingStrategy) })
      },
      setMaxImagesToGenerateInParallel: (maxImagesToGenerateInParallel?: number) => {
        const { maxImagesToGenerateInParallel: defaultMaxImagesToGenerateInParallel } = getDefaultSettingsState()
        set({
          maxImagesToGenerateInParallel: getValidNumber(
            maxImagesToGenerateInParallel,
            1,
            HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL,
            defaultMaxImagesToGenerateInParallel
          )
        })
      },
      setMaxVideosToGenerateInParallel: (maxVideosToGenerateInParallel?: number) => {
        const { maxVideosToGenerateInParallel: defaultMaxVideosToGenerateInParallel } = getDefaultSettingsState()
        set({
          maxVideosToGenerateInParallel: getValidNumber(
            maxVideosToGenerateInParallel,
            1,
            HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL,
            defaultMaxVideosToGenerateInParallel
          )
        })
      },
      setComfyWorkflowForImage: (comfyWorkflowForImage?: string) => {
        set({ comfyWorkflowForImage: getValidComfyWorkflowTemplate(comfyWorkflowForImage, getDefaultSettingsState().comfyWorkflowForImage) })
      },
      setComfyWorkflowForVideo: (comfyWorkflowForVideo?: string) => {
        set({ comfyWorkflowForVideo: getValidComfyWorkflowTemplate(comfyWorkflowForVideo, getDefaultSettingsState().comfyWorkflowForVideo) })
      },
      setComfyWorkflowForVoice: (comfyWorkflowForVoice?: string) => {
        set({ comfyWorkflowForVoice: getValidComfyWorkflowTemplate(comfyWorkflowForVoice, getDefaultSettingsState().comfyWorkflowForVoice) })
      },
      setComfyWorkflowForSound: (comfyWorkflowForSound?: string) => {
        set({ comfyWorkflowForSound: getValidComfyWorkflowTemplate(comfyWorkflowForSound, getDefaultSettingsState().comfyWorkflowForSound) })
      },
      setComfyWorkflowForMusic: (comfyWorkflowForMusic?: string) => {
        set({ comfyWorkflowForMusic: getValidComfyWorkflowTemplate(comfyWorkflowForMusic, getDefaultSettingsState().comfyWorkflowForMusic) })
      },

      setHuggingFaceModelForAssistant: (huggingFaceModelForAssistant?: string) => {
        set({ huggingFaceModelForAssistant: getValidString(huggingFaceModelForAssistant, getDefaultSettingsState().huggingFaceModelForAssistant) })
      },
      setHuggingFaceModelForImage: (huggingFaceModelForImage?: string) => {
        set({ huggingFaceModelForImage: getValidString(huggingFaceModelForImage, getDefaultSettingsState().huggingFaceModelForImage) })
      },
      setHuggingFaceModelForVideo: (huggingFaceModelForVideo?: string) => {
        set({ huggingFaceModelForVideo: getValidString(huggingFaceModelForVideo, getDefaultSettingsState().huggingFaceModelForVideo) })
      },
      setHuggingFaceModelForVoice: (huggingFaceModelForVoice?: string) => {
        set({ huggingFaceModelForVoice: getValidString(huggingFaceModelForVoice, getDefaultSettingsState().huggingFaceModelForVoice) })
      },
      setHuggingFaceModelForSound: (huggingFaceModelForSound?: string) => {
        set({ huggingFaceModelForSound: getValidString(huggingFaceModelForSound, getDefaultSettingsState().huggingFaceModelForSound) })
      },
      setHuggingFaceModelForMusic: (huggingFaceModelForMusic?: string) => {
        set({ huggingFaceModelForMusic: getValidString(huggingFaceModelForMusic, getDefaultSettingsState().huggingFaceModelForMusic) })
      },
      setGradioApiUrlForAssistant: (gradioApiUrlForAssistant?: string) => {
        set({ gradioApiUrlForAssistant: getValidString(gradioApiUrlForAssistant, getDefaultSettingsState().gradioApiUrlForAssistant) })
      },
      setGradioApiUrlForImage: (gradioApiUrlForImage?: string) => {
        set({ gradioApiUrlForImage: getValidString(gradioApiUrlForImage, getDefaultSettingsState().gradioApiUrlForImage) })
      },
      setGradioApiUrlForVideo: (gradioApiUrlForVideo?: string) => {
        set({ gradioApiUrlForVideo: getValidString(gradioApiUrlForVideo, getDefaultSettingsState().gradioApiUrlForVideo) })
      },
      setGradioApiUrlForSpeech: (gradioApiUrlForSpeech?: string) => {
        set({ gradioApiUrlForSpeech: getValidString(gradioApiUrlForSpeech, getDefaultSettingsState().gradioApiUrlForSpeech) })
      },
      setGradioApiUrlForSound: (gradioApiUrlForSound?: string) => {
        set({ gradioApiUrlForSound: getValidString(gradioApiUrlForSound, getDefaultSettingsState().gradioApiUrlForSound) })
      },
      setGradioApiUrlForMusic: (gradioApiUrlForMusic?: string) => {
        set({ gradioApiUrlForMusic: getValidString(gradioApiUrlForMusic, getDefaultSettingsState().gradioApiUrlForMusic) })
      },
      setReplicateModelForImage: (replicateModelForImage?: string) => {
        set({ replicateModelForImage: getValidString(replicateModelForImage, getDefaultSettingsState().replicateModelForImage) })
      },
      setReplicateModelForVideo: (replicateModelForVideo?: string) => {
        set({ replicateModelForVideo: getValidString(replicateModelForVideo, getDefaultSettingsState().replicateModelForVideo) })
      },
      setReplicateModelForVoice: (replicateModelForVoice?: string) => {
        set({ replicateModelForVoice: getValidString(replicateModelForVoice, getDefaultSettingsState().replicateModelForVoice) })
      },
      setReplicateModelForSound: (replicateModelForSound?: string) => {
        set({ replicateModelForSound: getValidString(replicateModelForSound, getDefaultSettingsState().replicateModelForSound) })
      },
      setReplicateModelForMusic: (replicateModelForMusic?: string) => {
        set({ replicateModelForMusic: getValidString(replicateModelForMusic, getDefaultSettingsState().replicateModelForMusic) })
      },
      setStabilityAiModelForImage: (stabilityAiModelForImage?: string) => {
        set({ stabilityAiModelForImage: getValidString(stabilityAiModelForImage, getDefaultSettingsState().stabilityAiModelForImage) })
      },
      setStabilityAiModelForVideo: (stabilityAiModelForVideo?: string) => {
        set({ stabilityAiModelForVideo: getValidString(stabilityAiModelForVideo, getDefaultSettingsState().stabilityAiModelForVideo) })
      },
      setStabilityAiModelForVoice: (stabilityAiModelForVoice?: string) => {
        set({ stabilityAiModelForVoice: getValidString(stabilityAiModelForVoice, getDefaultSettingsState().stabilityAiModelForVoice) })
      },
      setStabilityAiModelForSound: (stabilityAiModelForSound?: string) => {
        set({ stabilityAiModelForSound: getValidString(stabilityAiModelForSound, getDefaultSettingsState().stabilityAiModelForSound) })
      },
      setStabilityAiModelForMusic: (stabilityAiModelForMusic?: string) => {
        set({ stabilityAiModelForMusic: getValidString(stabilityAiModelForMusic, getDefaultSettingsState().stabilityAiModelForMusic) })
      },
      setFireworksAiModelForAssistant: (fireworksAiModelForAssistant?: string) => {
        set({ fireworksAiModelForAssistant: getValidString(fireworksAiModelForAssistant, getDefaultSettingsState().fireworksAiModelForAssistant) })
      },
      setFireworksAiModelForImage: (fireworksAiModelForImage?: string) => {
        set({ fireworksAiModelForImage: getValidString(fireworksAiModelForImage, getDefaultSettingsState().fireworksAiModelForImage) })
      },
      setFireworksAiModelForVideo: (fireworksAiModelForVideo?: string) => {
        set({ fireworksAiModelForVideo: getValidString(fireworksAiModelForVideo, getDefaultSettingsState().fireworksAiModelForVideo) })
      },
      setFireworksAiModelForVoice: (fireworksAiModelForVoice?: string) => {
        set({ fireworksAiModelForVoice: getValidString(fireworksAiModelForVoice, getDefaultSettingsState().fireworksAiModelForVoice) })
      },
      setFireworksAiModelForSound: (fireworksAiModelForSound?: string) => {
        set({ fireworksAiModelForSound: getValidString(fireworksAiModelForSound, getDefaultSettingsState().fireworksAiModelForSound) })
      },
      setFireworksAiModelForMusic: (fireworksAiModelForMusic?: string) => {
        set({ fireworksAiModelForMusic: getValidString(fireworksAiModelForMusic, getDefaultSettingsState().fireworksAiModelForMusic) })
      },
      setFalAiModelForImage: (falAiModelForImage?: string) => {
        set({ falAiModelForImage: getValidString(falAiModelForImage, getDefaultSettingsState().falAiModelForImage) })
      },
      setFalAiModelForVideo: (falAiModelForVideo?: string) => {
        set({ falAiModelForVideo: getValidString(falAiModelForVideo, getDefaultSettingsState().falAiModelForVideo) })
      },
      setFalAiModelForVoice: (falAiModelForVoice?: string) => {
        set({ falAiModelForVoice: getValidString(falAiModelForVoice, getDefaultSettingsState().falAiModelForVoice) })
      },
      setFalAiModelForSound: (falAiModelForSound?: string) => {
        set({ falAiModelForSound: getValidString(falAiModelForSound, getDefaultSettingsState().falAiModelForSound) })
      },
      setFalAiModelForMusic: (falAiModelForMusic?: string) => {
        set({ falAiModelForMusic: getValidString(falAiModelForMusic, getDefaultSettingsState().falAiModelForMusic) })
      },
      setModelsLabModelForImage: (modelsLabModelForImage?: string) => {
        set({ modelsLabModelForImage: getValidString(modelsLabModelForImage, getDefaultSettingsState().modelsLabModelForImage) })
      },
      setModelsLabModelForVideo: (modelsLabModelForVideo?: string) => {
        set({ modelsLabModelForVideo: getValidString(modelsLabModelForVideo, getDefaultSettingsState().modelsLabModelForVideo) })
      },
      setModelsLabModelForVoice: (modelsLabModelForVoice?: string) => {
        set({ modelsLabModelForVoice: getValidString(modelsLabModelForVoice, getDefaultSettingsState().modelsLabModelForVoice) })
      },
      setModelsLabModelForSound: (modelsLabModelForSound?: string) => {
        set({ modelsLabModelForSound: getValidString(modelsLabModelForSound, getDefaultSettingsState().modelsLabModelForSound) })
      },
      setModelsLabModelForMusic: (modelsLabModelForMusic?: string) => {
        set({ modelsLabModelForMusic: getValidString(modelsLabModelForMusic, getDefaultSettingsState().modelsLabModelForMusic) })
      },
      setOpenaiModelForAssistant: (openaiModelForAssistant?: string) => {
        set({ openaiModelForAssistant: getValidString(openaiModelForAssistant, getDefaultSettingsState().openaiModelForAssistant) })
      },
      setOpenaiModelForImage: (openaiModelForImage?: string) => {
        set({ openaiModelForImage: getValidString(openaiModelForImage, getDefaultSettingsState().openaiModelForImage) })
      },
      setOpenaiModelForVideo: (openaiModelForVideo?: string) => {
        set({ openaiModelForVideo: getValidString(openaiModelForVideo, getDefaultSettingsState().openaiModelForVideo) })
      },
      setOpenaiModelForVoice: (openaiModelForVoice?: string) => {
        set({ openaiModelForVoice: getValidString(openaiModelForVoice, getDefaultSettingsState().openaiModelForVoice) })
      },
      setGroqModelForAssistant: (groqModelForAssistant?: string) => {
        set({ groqModelForAssistant: getValidString(groqModelForAssistant, getDefaultSettingsState().groqModelForAssistant) })
      },
      setGoogleModelForAssistant: (googleModelForAssistant?: string) => {
        set({ googleModelForAssistant: getValidString(googleModelForAssistant, getDefaultSettingsState().googleModelForAssistant) })
      },
      setGoogleModelForImage: (googleModelForImage?: string) => {
        set({ googleModelForImage: getValidString(googleModelForImage, getDefaultSettingsState().googleModelForImage) })
      },
      setGoogleModelForVideo: (googleModelForVideo?: string) => {
        set({ googleModelForVideo: getValidString(googleModelForVideo, getDefaultSettingsState().googleModelForVideo) })
      },
      setGoogleModelForVoice: (googleModelForVoice?: string) => {
        set({ googleModelForVoice: getValidString(googleModelForVoice, getDefaultSettingsState().googleModelForVoice) })
      },
      setGoogleModelForMusic: (googleModelForMusic?: string) => {
        set({ googleModelForMusic: getValidString(googleModelForMusic, getDefaultSettingsState().googleModelForMusic) })
      },
      setAnthropicModelForAssistant: (anthropicModelForAssistant?: string) => {
        set({ anthropicModelForAssistant: getValidString(anthropicModelForAssistant, getDefaultSettingsState().anthropicModelForAssistant) })
      },
      setElevenLabsModelForVoice: (elevenLabsModelForVoice?: string) => {
        set({ elevenLabsModelForVoice: getValidString(elevenLabsModelForVoice, getDefaultSettingsState().elevenLabsModelForVoice) })
      },
      setElevenLabsModelForSound: (elevenLabsModelForSound?: string) => {
        set({ elevenLabsModelForSound: getValidString(elevenLabsModelForSound, getDefaultSettingsState().elevenLabsModelForSound) })
      },
      setCohereModelForAssistant: (cohereModelForAssistant?: string) => {
        set({ cohereModelForAssistant: getValidString(cohereModelForAssistant, getDefaultSettingsState().cohereModelForAssistant) })
      },
      setMistralAiModelForAssistant: (mistralAiModelForAssistant?: string) => {
        set({ mistralAiModelForAssistant: getValidString(mistralAiModelForAssistant, getDefaultSettingsState().mistralAiModelForAssistant) })
      },
      setKitsAiModelForVoice: (kitsAiModelForVoice?: string) => {
        set({ kitsAiModelForVoice: getValidString(kitsAiModelForVoice, getDefaultSettingsState().kitsAiModelForVoice) })
      },
      getSettings: (): SettingsState => {
        const state = get()
        const defaultSettings = getDefaultSettingsState()
        return {
          // why do we need those fallbacks? because some users will leave the fields empty,
          // eg. an empty model string.. basically we want to allow empty config that still works!
          assistantProvider: state.assistantProvider || defaultSettings.assistantProvider,
          imageProvider: state.imageProvider || defaultSettings.imageProvider,
          videoProvider: state.videoProvider || defaultSettings.videoProvider,
          soundProvider: state.soundProvider || defaultSettings.soundProvider,
          voiceProvider: state.voiceProvider || defaultSettings.voiceProvider,
          musicProvider: state.musicProvider || defaultSettings.musicProvider,
          customComfyUiApiKey: state.customComfyUiApiKey || defaultSettings.customComfyUiApiKey,
          replicateApiKey: state.replicateApiKey || defaultSettings.replicateApiKey,
          comfyIcuApiKey: state.comfyIcuApiKey || defaultSettings.comfyIcuApiKey,
          comfyIcuAccelerator: state.comfyIcuAccelerator || defaultSettings.comfyIcuAccelerator,
          huggingFaceApiKey: state.huggingFaceApiKey || defaultSettings.huggingFaceApiKey,
          falAiApiKey: state.falAiApiKey || defaultSettings.falAiApiKey,
          modelsLabApiKey: state.modelsLabApiKey || defaultSettings.modelsLabApiKey,
          openaiApiKey: state.openaiApiKey || defaultSettings.openaiApiKey,
          groqApiKey: state.groqApiKey || defaultSettings.groqApiKey,
          googleApiKey: state.googleApiKey || defaultSettings.googleApiKey,
          anthropicApiKey: state.anthropicApiKey || defaultSettings.anthropicApiKey,
          elevenLabsApiKey: state.elevenLabsApiKey || defaultSettings.elevenLabsApiKey,
          cohereApiKey: state.cohereApiKey || defaultSettings.cohereApiKey,
          mistralAiApiKey: state.mistralAiApiKey || defaultSettings.mistralAiApiKey,
          kitsAiApiKey: state.kitsAiApiKey || defaultSettings.kitsAiApiKey,
          fireworksAiApiKey: state.fireworksAiApiKey || defaultSettings.fireworksAiApiKey,
          stabilityAiApiKey: state.stabilityAiApiKey || defaultSettings.stabilityAiApiKey,
          censorNotForAllAudiencesContent: state.censorNotForAllAudiencesContent || defaultSettings.censorNotForAllAudiencesContent,
          imagePromptPrefix: state.imagePromptPrefix || defaultSettings.imagePromptPrefix,
          imagePromptSuffix: state.imagePromptSuffix || defaultSettings.imagePromptSuffix,
          imageNegativePrompt: state.imageNegativePrompt || defaultSettings.imageNegativePrompt,
          videoPromptPrefix: state.videoPromptPrefix || defaultSettings.videoPromptPrefix,
          videoPromptSuffix: state.videoPromptSuffix || defaultSettings.videoPromptSuffix,
          videoNegativePrompt: state.videoNegativePrompt || defaultSettings.videoNegativePrompt,       
                    
          assistantModel: state.assistantModel || defaultSettings.assistantModel,
          assistantTurboModel: state.assistantTurboModel || defaultSettings.assistantTurboModel,
          imageGenerationModel: state.imageGenerationModel || defaultSettings.imageGenerationModel,
          imageGenerationTurboModel: state.imageGenerationTurboModel || defaultSettings.imageGenerationTurboModel,
          imageUpscalingModel: state.imageUpscalingModel || defaultSettings.imageUpscalingModel,
          videoGenerationModel: state.videoGenerationModel || defaultSettings.videoGenerationModel,
          videoUpscalingModel: state.videoUpscalingModel || defaultSettings.videoUpscalingModel,
          soundGenerationModel: state.soundGenerationModel || defaultSettings.soundGenerationModel,
          voiceGenerationModel: state.voiceGenerationModel || defaultSettings.voiceGenerationModel,
          musicGenerationModel: state.musicGenerationModel || defaultSettings.musicGenerationModel,
                    
          imageRenderingStrategy: state.imageRenderingStrategy || defaultSettings.imageRenderingStrategy,
          videoRenderingStrategy: state.videoRenderingStrategy || defaultSettings.videoRenderingStrategy,
          voiceRenderingStrategy: state.voiceRenderingStrategy || defaultSettings.voiceRenderingStrategy,
          soundRenderingStrategy: state.soundRenderingStrategy || defaultSettings.soundRenderingStrategy,
          musicRenderingStrategy: state.musicRenderingStrategy || defaultSettings.musicRenderingStrategy,
          maxImagesToGenerateInParallel: state.maxImagesToGenerateInParallel || defaultSettings.maxImagesToGenerateInParallel,
          maxVideosToGenerateInParallel: state.maxVideosToGenerateInParallel || defaultSettings.maxVideosToGenerateInParallel,
          comfyWorkflowForImage: state.comfyWorkflowForImage || defaultSettings.comfyWorkflowForImage,
          comfyWorkflowForVideo: state.comfyWorkflowForVideo || defaultSettings.comfyWorkflowForVideo,
          comfyWorkflowForVoice: state.comfyWorkflowForVoice || defaultSettings.comfyWorkflowForVoice,
          comfyWorkflowForSound: state.comfyWorkflowForSound || defaultSettings.comfyWorkflowForSound,
          comfyWorkflowForMusic: state.comfyWorkflowForMusic || defaultSettings.comfyWorkflowForMusic,
          huggingFaceModelForAssistant: state.huggingFaceModelForAssistant || defaultSettings.huggingFaceModelForAssistant,
          huggingFaceModelForImage: state.huggingFaceModelForImage || defaultSettings.huggingFaceModelForImage,
          huggingFaceModelForVideo: state.huggingFaceModelForVideo || defaultSettings.huggingFaceModelForVideo,
          huggingFaceModelForVoice: state.huggingFaceModelForVoice || defaultSettings.huggingFaceModelForVoice,
          huggingFaceModelForSound: state.huggingFaceModelForSound || defaultSettings.huggingFaceModelForSound,
          huggingFaceModelForMusic: state.huggingFaceModelForMusic || defaultSettings.huggingFaceModelForMusic,
          gradioApiUrlForAssistant: state.gradioApiUrlForAssistant || defaultSettings.gradioApiUrlForAssistant,
          gradioApiUrlForImage: state.gradioApiUrlForImage || defaultSettings.gradioApiUrlForImage,
          gradioApiUrlForVideo: state.gradioApiUrlForVideo || defaultSettings.gradioApiUrlForVideo,
          gradioApiUrlForSpeech: state.gradioApiUrlForSpeech || defaultSettings.gradioApiUrlForSpeech,
          gradioApiUrlForSound: state.gradioApiUrlForSound || defaultSettings.gradioApiUrlForSound,
          gradioApiUrlForMusic: state.gradioApiUrlForMusic || defaultSettings.gradioApiUrlForMusic,
          replicateModelForImage: state.replicateModelForImage || defaultSettings.replicateModelForImage,
          replicateModelForVideo: state.replicateModelForVideo || defaultSettings.replicateModelForVideo,
          replicateModelForVoice: state.replicateModelForVoice || defaultSettings.replicateModelForVoice,
          replicateModelForSound: state.replicateModelForSound || defaultSettings.replicateModelForSound,
          replicateModelForMusic: state.replicateModelForMusic || defaultSettings.replicateModelForMusic,
          stabilityAiModelForImage: state.stabilityAiModelForImage || defaultSettings.stabilityAiModelForImage,
          stabilityAiModelForVideo: state.stabilityAiModelForVideo || defaultSettings.stabilityAiModelForVideo,
          stabilityAiModelForVoice: state.stabilityAiModelForVoice || defaultSettings.stabilityAiModelForVoice,
          stabilityAiModelForSound: state.stabilityAiModelForSound || defaultSettings.stabilityAiModelForSound,
          stabilityAiModelForMusic: state.stabilityAiModelForMusic || defaultSettings.stabilityAiModelForMusic,
          fireworksAiModelForAssistant: state.fireworksAiModelForAssistant || defaultSettings.fireworksAiModelForAssistant,
          fireworksAiModelForImage: state.fireworksAiModelForImage || defaultSettings.fireworksAiModelForImage,
          fireworksAiModelForVideo: state.fireworksAiModelForVideo || defaultSettings.fireworksAiModelForVideo,
          fireworksAiModelForVoice: state.fireworksAiModelForVoice || defaultSettings.fireworksAiModelForVoice,
          fireworksAiModelForSound: state.fireworksAiModelForSound || defaultSettings.fireworksAiModelForSound,
          fireworksAiModelForMusic: state.fireworksAiModelForMusic || defaultSettings.fireworksAiModelForMusic,
          falAiModelForImage: state.falAiModelForImage || defaultSettings.falAiModelForImage,
          falAiModelForVideo: state.falAiModelForVideo || defaultSettings.falAiModelForVideo,
          falAiModelForVoice: state.falAiModelForVoice || defaultSettings.falAiModelForVoice,
          falAiModelForSound: state.falAiModelForSound || defaultSettings.falAiModelForSound,
          falAiModelForMusic: state.falAiModelForMusic || defaultSettings.falAiModelForMusic,
          modelsLabModelForImage: state.modelsLabModelForImage || defaultSettings.modelsLabModelForImage,
          modelsLabModelForVideo: state.modelsLabModelForVideo || defaultSettings.modelsLabModelForVideo,
          modelsLabModelForVoice: state.modelsLabModelForVoice || defaultSettings.modelsLabModelForVoice,
          modelsLabModelForSound: state.modelsLabModelForSound || defaultSettings.modelsLabModelForSound,
          modelsLabModelForMusic: state.modelsLabModelForMusic || defaultSettings.modelsLabModelForMusic,
          openaiModelForAssistant: state.openaiModelForAssistant || defaultSettings.openaiModelForAssistant,
          openaiModelForImage: state.openaiModelForImage || defaultSettings.openaiModelForImage,
          openaiModelForVideo: state.openaiModelForVideo || defaultSettings.openaiModelForVideo,
          openaiModelForVoice: state.openaiModelForVoice || defaultSettings.openaiModelForVoice,
          groqModelForAssistant: state.groqModelForAssistant || defaultSettings.groqModelForAssistant,
          googleModelForAssistant: state.googleModelForAssistant || defaultSettings.googleModelForAssistant,
          googleModelForImage: state.googleModelForImage || defaultSettings.googleModelForImage,
          googleModelForVideo: state.googleModelForVideo || defaultSettings.googleModelForVideo,
          googleModelForVoice: state.googleModelForVoice || defaultSettings.googleModelForVoice,
          googleModelForMusic: state.googleModelForMusic || defaultSettings.googleModelForMusic,
          anthropicModelForAssistant: state.anthropicModelForAssistant || defaultSettings.anthropicModelForAssistant,
          elevenLabsModelForVoice: state.elevenLabsModelForVoice || defaultSettings.elevenLabsModelForVoice,
          elevenLabsModelForSound: state.elevenLabsModelForSound || defaultSettings.elevenLabsModelForSound,
          cohereModelForAssistant: state.cohereModelForAssistant || defaultSettings.cohereModelForAssistant,
          mistralAiModelForAssistant: state.mistralAiModelForAssistant || defaultSettings.mistralAiModelForAssistant,
          kitsAiModelForVoice: state.kitsAiModelForVoice || defaultSettings.kitsAiModelForVoice,
        }
      },
    }),
    {
      name: 'CLAPPER_REVISION_0_SETTINGS_RENDERING'
    },
  ),
)