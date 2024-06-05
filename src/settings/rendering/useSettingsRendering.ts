"use client"

import { create } from "zustand"
import { persist } from 'zustand/middleware'
import { getValidNumber } from "@aitube/clap"
import { parseRenderingStrategy, RenderingStrategy } from "@aitube/timeline"

import { ComfyIcuAccelerator, ComputeProvider } from "@/types"
import { getValidString, parseComputeProvider } from "@/lib/utils"
import { HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL } from "@/lib/core/constants"

import { SettingsRenderingState, SettingsRenderingStore } from "./types"
import { getDefaultSettingsRendering } from "./getDefaultSettingsRendering"
import { getValidComfyWorkflowTemplate } from "@/lib/utils/getValidComfyWorkflowTemplate"
import { parseComfyIcuAccelerator } from "@/lib/utils/parseComfyIcuAccelerator"

export const useSettingsRendering = create<SettingsRenderingStore>()(
  persist(
    (set, get) => ({
      ...getDefaultSettingsRendering(),

      setAssistantProvider: (assistantProvider?: ComputeProvider) => {
        const { videoProvider: defaultAssistantProvider } = getDefaultSettingsRendering()
        set({ assistantProvider: parseComputeProvider(assistantProvider, defaultAssistantProvider) })
      },
      setVideoProvider: (videoProvider?: ComputeProvider) => {
        const { videoProvider: defaultVideoProvider } = getDefaultSettingsRendering()
        set({ videoProvider: parseComputeProvider(videoProvider, defaultVideoProvider) })
      },
      setStoryboardProvider: (storyboardProvider?: ComputeProvider) => {
        const { storyboardProvider: defaultStoryboardProvider } = getDefaultSettingsRendering()
        set({ storyboardProvider: parseComputeProvider(storyboardProvider, defaultStoryboardProvider) })
      },
      setSpeechProvider: (speechProvider?: ComputeProvider) => {
        const { speechProvider: defaultSpeechProvider } = getDefaultSettingsRendering()
        set({ speechProvider: parseComputeProvider(speechProvider, defaultSpeechProvider) })
      },
      setSoundProvider: (soundProvider?: ComputeProvider) => {
        const { soundProvider: defaultSoundProvider } = getDefaultSettingsRendering()
        set({ soundProvider: parseComputeProvider(soundProvider, defaultSoundProvider) })
      },
      setMusicProvider: (musicProvider?: ComputeProvider) => {
        const { musicProvider: defaultMusicProvider } = getDefaultSettingsRendering()
        set({ musicProvider: parseComputeProvider(musicProvider, defaultMusicProvider) })
      },
      setCustomComfyUiApiKey: (customComfyUiApiKey?: string) => {
        const { customComfyUiApiKey: defaulCustomComfyUiApiKey } = getDefaultSettingsRendering()
        set({ customComfyUiApiKey: getValidString(customComfyUiApiKey, defaulCustomComfyUiApiKey) })
      },
      setReplicateApiKey: (replicateApiKey?: string) => {
        const { replicateApiKey: defaultReplicateApiKey } = getDefaultSettingsRendering()
        set({ replicateApiKey: getValidString(replicateApiKey, defaultReplicateApiKey) })
      },
      setComfyIcuApiKey: (comfyIcuApiKey?: string) => {
        const { comfyIcuApiKey: defaultComfyIcuApiKey } = getDefaultSettingsRendering()
        set({ comfyIcuApiKey: getValidString(comfyIcuApiKey, defaultComfyIcuApiKey) })
      },
      setComfyIcuAccelerator: (comfyIcuAccelerator?: ComfyIcuAccelerator) => {
        const { comfyIcuAccelerator: defaulComfyIcuAccelerator } = getDefaultSettingsRendering()
        set({ comfyIcuAccelerator: parseComfyIcuAccelerator(comfyIcuAccelerator, defaulComfyIcuAccelerator) })
      },
      setHuggingFaceApiKey: (huggingFaceApiKey?: string) => {
        const { huggingFaceApiKey: defaultHuggingFaceApiKey } = getDefaultSettingsRendering()
        set({ huggingFaceApiKey: getValidString(huggingFaceApiKey, defaultHuggingFaceApiKey) })
      },
      setFalAiApiKey: (falAiApiKey?: string) => {
        set({ falAiApiKey: getValidString(falAiApiKey, getDefaultSettingsRendering().falAiApiKey) })
      },
      setModelsLabApiKey: (modelsLabApiKey?: string) => {
        set({ modelsLabApiKey: getValidString(modelsLabApiKey, getDefaultSettingsRendering().modelsLabApiKey) })
      },
      setStoryboardRenderingStrategy: (storyboardRenderingStrategy?: RenderingStrategy) => {
        const { storyboardRenderingStrategy: defaulStoryboardRenderingStrategy } = getDefaultSettingsRendering()
        set({ storyboardRenderingStrategy: parseRenderingStrategy(storyboardRenderingStrategy, defaulStoryboardRenderingStrategy) })
      },
      setVideoRenderingStrategy: (videoRenderingStrategy?: RenderingStrategy) => {
        const { videoRenderingStrategy: defaultVideoRenderingStrategy } = getDefaultSettingsRendering()
        set({ videoRenderingStrategy: parseRenderingStrategy(videoRenderingStrategy, defaultVideoRenderingStrategy) })
      },
      setMaxStoryboardsToGenerateInParallel: (maxStoryboardsToGenerateInParallel?: number) => {
        const { maxStoryboardsToGenerateInParallel: defaultMaxStoryboardsToGenerateInParallel } = getDefaultSettingsRendering()
        set({
          maxStoryboardsToGenerateInParallel: getValidNumber(
            maxStoryboardsToGenerateInParallel,
            1,
            HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL,
            defaultMaxStoryboardsToGenerateInParallel
          )
        })
      },
      setMaxVideosToGenerateInParallel: (maxVideosToGenerateInParallel?: number) => {
        const { maxVideosToGenerateInParallel: defaultMaxVideosToGenerateInParallel } = getDefaultSettingsRendering()
        set({
          maxVideosToGenerateInParallel: getValidNumber(
            maxVideosToGenerateInParallel,
            1,
            HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL,
            defaultMaxVideosToGenerateInParallel
          )
        })
      },
      setComfyWorkflowForStoryboard: (comfyWorkflowForStoryboard?: string) => {
        set({ comfyWorkflowForStoryboard: getValidComfyWorkflowTemplate(comfyWorkflowForStoryboard, getDefaultSettingsRendering().comfyWorkflowForStoryboard) })
      },
      setComfyWorkflowForVideo: (comfyWorkflowForVideo?: string) => {
        set({ comfyWorkflowForVideo: getValidComfyWorkflowTemplate(comfyWorkflowForVideo, getDefaultSettingsRendering().comfyWorkflowForVideo) })
      },
      setComfyWorkflowForSpeech: (comfyWorkflowForSpeech?: string) => {
        set({ comfyWorkflowForSpeech: getValidComfyWorkflowTemplate(comfyWorkflowForSpeech, getDefaultSettingsRendering().comfyWorkflowForSpeech) })
      },
      setComfyWorkflowForSound: (comfyWorkflowForSound?: string) => {
        set({ comfyWorkflowForSound: getValidComfyWorkflowTemplate(comfyWorkflowForSound, getDefaultSettingsRendering().comfyWorkflowForSound) })
      },
      setComfyWorkflowForMusic: (comfyWorkflowForMusic?: string) => {
        set({ comfyWorkflowForMusic: getValidComfyWorkflowTemplate(comfyWorkflowForMusic, getDefaultSettingsRendering().comfyWorkflowForMusic) })
      },
      setHuggingFaceModelForImage: (huggingFaceModelForImage?: string) => {
        set({ huggingFaceModelForImage: getValidString(huggingFaceModelForImage, getDefaultSettingsRendering().huggingFaceModelForImage) })
      },
      setHuggingFaceModelForVideo: (huggingFaceModelForVideo?: string) => {
        set({ huggingFaceModelForVideo: getValidString(huggingFaceModelForVideo, getDefaultSettingsRendering().huggingFaceModelForVideo) })
      },
      setHuggingFaceModelForSpeech: (huggingFaceModelForSpeech?: string) => {
        set({ huggingFaceModelForSpeech: getValidString(huggingFaceModelForSpeech, getDefaultSettingsRendering().huggingFaceModelForSpeech) })
      },
      setHuggingFaceModelForSound: (huggingFaceModelForSound?: string) => {
        set({ huggingFaceModelForSound: getValidString(huggingFaceModelForSound, getDefaultSettingsRendering().huggingFaceModelForSound) })
      },
      setHuggingFaceModelForMusic: (huggingFaceModelForMusic?: string) => {
        set({ huggingFaceModelForMusic: getValidString(huggingFaceModelForMusic, getDefaultSettingsRendering().huggingFaceModelForMusic) })
      },
      setReplicateModelForImage: (replicateModelForImage?: string) => {
        set({ replicateModelForImage: getValidString(replicateModelForImage, getDefaultSettingsRendering().replicateModelForImage) })
      },
      setReplicateModelForVideo: (replicateModelForVideo?: string) => {
        set({ replicateModelForVideo: getValidString(replicateModelForVideo, getDefaultSettingsRendering().replicateModelForVideo) })
      },
      setReplicateModelForSpeech: (replicateModelForSpeech?: string) => {
        set({ replicateModelForSpeech: getValidString(replicateModelForSpeech, getDefaultSettingsRendering().replicateModelForSpeech) })
      },
      setReplicateModelForSound: (replicateModelForSound?: string) => {
        set({ replicateModelForSound: getValidString(replicateModelForSound, getDefaultSettingsRendering().replicateModelForSound) })
      },
      setReplicateModelForMusic: (replicateModelForMusic?: string) => {
        set({ replicateModelForMusic: getValidString(replicateModelForMusic, getDefaultSettingsRendering().replicateModelForMusic) })
      },
      setStabilityAiModelForImage: (stabilityAiModelForImage?: string) => {
        set({ stabilityAiModelForImage: getValidString(stabilityAiModelForImage, getDefaultSettingsRendering().stabilityAiModelForImage) })
      },
      setStabilityAiModelForVideo: (stabilityAiModelForVideo?: string) => {
        set({ stabilityAiModelForVideo: getValidString(stabilityAiModelForVideo, getDefaultSettingsRendering().stabilityAiModelForVideo) })
      },
      setStabilityAiModelForSpeech: (stabilityAiModelForSpeech?: string) => {
        set({ stabilityAiModelForSpeech: getValidString(stabilityAiModelForSpeech, getDefaultSettingsRendering().stabilityAiModelForSpeech) })
      },
      setStabilityAiModelForSound: (stabilityAiModelForSound?: string) => {
        set({ stabilityAiModelForSound: getValidString(stabilityAiModelForSound, getDefaultSettingsRendering().stabilityAiModelForSound) })
      },
      setStabilityAiModelForMusic: (stabilityAiModelForMusic?: string) => {
        set({ stabilityAiModelForMusic: getValidString(stabilityAiModelForMusic, getDefaultSettingsRendering().stabilityAiModelForMusic) })
      },
      setFalAiModelForImage: (falAiModelForImage?: string) => {
        set({ falAiModelForImage: getValidString(falAiModelForImage, getDefaultSettingsRendering().falAiModelForImage) })
      },
      setFalAiModelForVideo: (falAiModelForVideo?: string) => {
        set({ falAiModelForVideo: getValidString(falAiModelForVideo, getDefaultSettingsRendering().falAiModelForVideo) })
      },
      setFalAiModelForSpeech: (falAiModelForSpeech?: string) => {
        set({ falAiModelForSpeech: getValidString(falAiModelForSpeech, getDefaultSettingsRendering().falAiModelForSpeech) })
      },
      setFalAiModelForSound: (falAiModelForSound?: string) => {
        set({ falAiModelForSound: getValidString(falAiModelForSound, getDefaultSettingsRendering().falAiModelForSound) })
      },
      setFalAiModelForMusic: (falAiModelForMusic?: string) => {
        set({ falAiModelForMusic: getValidString(falAiModelForMusic, getDefaultSettingsRendering().falAiModelForMusic) })
      },
      setModelsLabModelForImage: (modelsLabModelForImage?: string) => {
        set({ modelsLabModelForImage: getValidString(modelsLabModelForImage, getDefaultSettingsRendering().modelsLabModelForImage) })
      },
      setModelsLabModelForVideo: (modelsLabModelForVideo?: string) => {
        set({ modelsLabModelForVideo: getValidString(modelsLabModelForVideo, getDefaultSettingsRendering().modelsLabModelForVideo) })
      },
      setModelsLabModelForSpeech: (modelsLabModelForSpeech?: string) => {
        set({ modelsLabModelForSpeech: getValidString(modelsLabModelForSpeech, getDefaultSettingsRendering().modelsLabModelForSpeech) })
      },
      setModelsLabModelForSound: (modelsLabModelForSound?: string) => {
        set({ modelsLabModelForSound: getValidString(modelsLabModelForSound, getDefaultSettingsRendering().modelsLabModelForSound) })
      },
      setModelsLabModelForMusic: (modelsLabModelForMusic?: string) => {
        set({ modelsLabModelForMusic: getValidString(modelsLabModelForMusic, getDefaultSettingsRendering().modelsLabModelForMusic) })
      },

      getSettings: (): SettingsRenderingState => {
        const {
          assistantProvider,
          storyboardProvider,
          videoProvider,
          soundProvider,
          speechProvider,
          musicProvider,
          customComfyUiApiKey,
          replicateApiKey,
          comfyIcuApiKey,
          comfyIcuAccelerator,
          huggingFaceApiKey,
          falAiApiKey,
          modelsLabApiKey,
          storyboardRenderingStrategy,
          videoRenderingStrategy,
          maxStoryboardsToGenerateInParallel,
          maxVideosToGenerateInParallel,
          comfyWorkflowForStoryboard,
          comfyWorkflowForVideo,
          comfyWorkflowForSpeech,
          comfyWorkflowForSound,
          comfyWorkflowForMusic,
          huggingFaceModelForImage,
          huggingFaceModelForVideo,
          huggingFaceModelForSpeech,
          huggingFaceModelForSound,
          huggingFaceModelForMusic,
          replicateModelForImage,
          replicateModelForVideo,
          replicateModelForSpeech,
          replicateModelForSound,
          replicateModelForMusic,
          stabilityAiModelForImage,
          stabilityAiModelForVideo,
          stabilityAiModelForSpeech,
          stabilityAiModelForSound,
          stabilityAiModelForMusic,
          falAiModelForImage,
          falAiModelForVideo,
          falAiModelForSpeech,
          falAiModelForSound,
          falAiModelForMusic,
          modelsLabModelForImage,
          modelsLabModelForVideo,
          modelsLabModelForSpeech,
          modelsLabModelForSound,
          modelsLabModelForMusic,
        } = get()
        return {
          assistantProvider,
          storyboardProvider,
          videoProvider,
          soundProvider,
          speechProvider,
          musicProvider,
          customComfyUiApiKey,
          replicateApiKey,
          comfyIcuApiKey,
          comfyIcuAccelerator,
          huggingFaceApiKey,
          falAiApiKey,
          modelsLabApiKey,
          storyboardRenderingStrategy,
          videoRenderingStrategy,
          maxStoryboardsToGenerateInParallel,
          maxVideosToGenerateInParallel,
          comfyWorkflowForStoryboard,
          comfyWorkflowForVideo,
          comfyWorkflowForSpeech,
          comfyWorkflowForSound,
          comfyWorkflowForMusic,
          huggingFaceModelForImage,
          huggingFaceModelForVideo,
          huggingFaceModelForSpeech,
          huggingFaceModelForSound,
          huggingFaceModelForMusic,
          replicateModelForImage,
          replicateModelForVideo,
          replicateModelForSpeech,
          replicateModelForSound,
          replicateModelForMusic,
          stabilityAiModelForImage,
          stabilityAiModelForVideo,
          stabilityAiModelForSpeech,
          stabilityAiModelForSound,
          stabilityAiModelForMusic,
          falAiModelForImage,
          falAiModelForVideo,
          falAiModelForSpeech,
          falAiModelForSound,
          falAiModelForMusic,
          modelsLabModelForImage,
          modelsLabModelForVideo,
          modelsLabModelForSpeech,
          modelsLabModelForSound,
          modelsLabModelForMusic,
        }
      },
    }),
    {
      name: 'CLAPPER_REVISION_0_SETTINGS_RENDERING'
    },
  ),
)