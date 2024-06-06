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
        set({ assistantProvider: parseComputeProvider(assistantProvider, defaultAssistantProvider) })
      },
      setVideoProvider: (videoProvider?: ComputeProvider) => {
        const { videoProvider: defaultVideoProvider } = getDefaultSettingsState()
        set({ videoProvider: parseComputeProvider(videoProvider, defaultVideoProvider) })
      },
      setStoryboardProvider: (storyboardProvider?: ComputeProvider) => {
        const { storyboardProvider: defaultStoryboardProvider } = getDefaultSettingsState()
        set({ storyboardProvider: parseComputeProvider(storyboardProvider, defaultStoryboardProvider) })
      },
      setSpeechProvider: (speechProvider?: ComputeProvider) => {
        const { speechProvider: defaultSpeechProvider } = getDefaultSettingsState()
        set({ speechProvider: parseComputeProvider(speechProvider, defaultSpeechProvider) })
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
      setCensorNotForAllAudiencesContent: (censorNotForAllAudiencesContent?: boolean) => {
        set({ censorNotForAllAudiencesContent: getValidBoolean(censorNotForAllAudiencesContent, getDefaultSettingsState().censorNotForAllAudiencesContent) })
      },
      setStoryboardRenderingStrategy: (storyboardRenderingStrategy?: RenderingStrategy) => {
        const { storyboardRenderingStrategy: defaulStoryboardRenderingStrategy } = getDefaultSettingsState()
        set({ storyboardRenderingStrategy: parseRenderingStrategy(storyboardRenderingStrategy, defaulStoryboardRenderingStrategy) })
      },
      setVideoRenderingStrategy: (videoRenderingStrategy?: RenderingStrategy) => {
        const { videoRenderingStrategy: defaultVideoRenderingStrategy } = getDefaultSettingsState()
        set({ videoRenderingStrategy: parseRenderingStrategy(videoRenderingStrategy, defaultVideoRenderingStrategy) })
      },
      setMaxStoryboardsToGenerateInParallel: (maxStoryboardsToGenerateInParallel?: number) => {
        const { maxStoryboardsToGenerateInParallel: defaultMaxStoryboardsToGenerateInParallel } = getDefaultSettingsState()
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
      setComfyWorkflowForStoryboard: (comfyWorkflowForStoryboard?: string) => {
        set({ comfyWorkflowForStoryboard: getValidComfyWorkflowTemplate(comfyWorkflowForStoryboard, getDefaultSettingsState().comfyWorkflowForStoryboard) })
      },
      setComfyWorkflowForVideo: (comfyWorkflowForVideo?: string) => {
        set({ comfyWorkflowForVideo: getValidComfyWorkflowTemplate(comfyWorkflowForVideo, getDefaultSettingsState().comfyWorkflowForVideo) })
      },
      setComfyWorkflowForSpeech: (comfyWorkflowForSpeech?: string) => {
        set({ comfyWorkflowForSpeech: getValidComfyWorkflowTemplate(comfyWorkflowForSpeech, getDefaultSettingsState().comfyWorkflowForSpeech) })
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
      setHuggingFaceModelForSpeech: (huggingFaceModelForSpeech?: string) => {
        set({ huggingFaceModelForSpeech: getValidString(huggingFaceModelForSpeech, getDefaultSettingsState().huggingFaceModelForSpeech) })
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
      setReplicateModelForSpeech: (replicateModelForSpeech?: string) => {
        set({ replicateModelForSpeech: getValidString(replicateModelForSpeech, getDefaultSettingsState().replicateModelForSpeech) })
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
      setStabilityAiModelForSpeech: (stabilityAiModelForSpeech?: string) => {
        set({ stabilityAiModelForSpeech: getValidString(stabilityAiModelForSpeech, getDefaultSettingsState().stabilityAiModelForSpeech) })
      },
      setStabilityAiModelForSound: (stabilityAiModelForSound?: string) => {
        set({ stabilityAiModelForSound: getValidString(stabilityAiModelForSound, getDefaultSettingsState().stabilityAiModelForSound) })
      },
      setStabilityAiModelForMusic: (stabilityAiModelForMusic?: string) => {
        set({ stabilityAiModelForMusic: getValidString(stabilityAiModelForMusic, getDefaultSettingsState().stabilityAiModelForMusic) })
      },
      setFalAiModelForImage: (falAiModelForImage?: string) => {
        set({ falAiModelForImage: getValidString(falAiModelForImage, getDefaultSettingsState().falAiModelForImage) })
      },
      setFalAiModelForVideo: (falAiModelForVideo?: string) => {
        set({ falAiModelForVideo: getValidString(falAiModelForVideo, getDefaultSettingsState().falAiModelForVideo) })
      },
      setFalAiModelForSpeech: (falAiModelForSpeech?: string) => {
        set({ falAiModelForSpeech: getValidString(falAiModelForSpeech, getDefaultSettingsState().falAiModelForSpeech) })
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
      setModelsLabModelForSpeech: (modelsLabModelForSpeech?: string) => {
        set({ modelsLabModelForSpeech: getValidString(modelsLabModelForSpeech, getDefaultSettingsState().modelsLabModelForSpeech) })
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
      setOpenaiModelForSpeech: (openaiModelForSpeech?: string) => {
        set({ openaiModelForSpeech: getValidString(openaiModelForSpeech, getDefaultSettingsState().openaiModelForSpeech) })
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
      setGoogleModelForSpeech: (googleModelForSpeech?: string) => {
        set({ googleModelForSpeech: getValidString(googleModelForSpeech, getDefaultSettingsState().googleModelForSpeech) })
      },
      setGoogleModelForMusic: (googleModelForMusic?: string) => {
        set({ googleModelForMusic: getValidString(googleModelForMusic, getDefaultSettingsState().googleModelForMusic) })
      },
      setAnthropicModelForAssistant: (anthropicModelForAssistant?: string) => {
        set({ anthropicModelForAssistant: getValidString(anthropicModelForAssistant, getDefaultSettingsState().anthropicModelForAssistant) })
      },
      setElevenLabsModelForSpeech: (elevenLabsModelForSpeech?: string) => {
        set({ elevenLabsModelForSpeech: getValidString(elevenLabsModelForSpeech, getDefaultSettingsState().elevenLabsModelForSpeech) })
      },
      setElevenLabsModelForSound: (elevenLabsModelForSound?: string) => {
        set({ elevenLabsModelForSound: getValidString(elevenLabsModelForSound, getDefaultSettingsState().elevenLabsModelForSound) })
      },
      getSettings: (): SettingsState => {
        const state = get()
        const defaultSettings = getDefaultSettingsState()
        return {
          // why do we need those fallbacks? because some users will leave the fields empty,
          // eg. an empty model string.. basically we want to allow empty config that still works!
          assistantProvider: state.assistantProvider || defaultSettings.assistantProvider,
          storyboardProvider: state.storyboardProvider || defaultSettings.storyboardProvider,
          videoProvider: state.videoProvider || defaultSettings.videoProvider,
          soundProvider: state.soundProvider || defaultSettings.soundProvider,
          speechProvider: state.speechProvider || defaultSettings.speechProvider,
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
          censorNotForAllAudiencesContent: state.censorNotForAllAudiencesContent || defaultSettings.censorNotForAllAudiencesContent,
          storyboardRenderingStrategy: state.storyboardRenderingStrategy || defaultSettings.storyboardRenderingStrategy,
          videoRenderingStrategy: state.videoRenderingStrategy || defaultSettings.videoRenderingStrategy,
          maxStoryboardsToGenerateInParallel: state.maxStoryboardsToGenerateInParallel || defaultSettings.maxStoryboardsToGenerateInParallel,
          maxVideosToGenerateInParallel: state.maxVideosToGenerateInParallel || defaultSettings.maxVideosToGenerateInParallel,
          comfyWorkflowForStoryboard: state.comfyWorkflowForStoryboard || defaultSettings.comfyWorkflowForStoryboard,
          comfyWorkflowForVideo: state.comfyWorkflowForVideo || defaultSettings.comfyWorkflowForVideo,
          comfyWorkflowForSpeech: state.comfyWorkflowForSpeech || defaultSettings.comfyWorkflowForSpeech,
          comfyWorkflowForSound: state.comfyWorkflowForSound || defaultSettings.comfyWorkflowForSound,
          comfyWorkflowForMusic: state.comfyWorkflowForMusic || defaultSettings.comfyWorkflowForMusic,
          huggingFaceModelForAssistant: state.huggingFaceModelForAssistant || defaultSettings.huggingFaceModelForAssistant,
          huggingFaceModelForImage: state.huggingFaceModelForImage || defaultSettings.huggingFaceModelForImage,
          huggingFaceModelForVideo: state.huggingFaceModelForVideo || defaultSettings.huggingFaceModelForVideo,
          huggingFaceModelForSpeech: state.huggingFaceModelForSpeech || defaultSettings.huggingFaceModelForSpeech,
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
          replicateModelForSpeech: state.replicateModelForSpeech || defaultSettings.replicateModelForSpeech,
          replicateModelForSound: state.replicateModelForSound || defaultSettings.replicateModelForSound,
          replicateModelForMusic: state.replicateModelForMusic || defaultSettings.replicateModelForMusic,
          stabilityAiModelForImage: state.stabilityAiModelForImage || defaultSettings.stabilityAiModelForImage,
          stabilityAiModelForVideo: state.stabilityAiModelForVideo || defaultSettings.stabilityAiModelForVideo,
          stabilityAiModelForSpeech: state.stabilityAiModelForSpeech || defaultSettings.stabilityAiModelForSpeech,
          stabilityAiModelForSound: state.stabilityAiModelForSound || defaultSettings.stabilityAiModelForSound,
          stabilityAiModelForMusic: state.stabilityAiModelForMusic || defaultSettings.stabilityAiModelForMusic,
          falAiModelForImage: state.falAiModelForImage || defaultSettings.falAiModelForImage,
          falAiModelForVideo: state.falAiModelForVideo || defaultSettings.falAiModelForVideo,
          falAiModelForSpeech: state.falAiModelForSpeech || defaultSettings.falAiModelForSpeech,
          falAiModelForSound: state.falAiModelForSound || defaultSettings.falAiModelForSound,
          falAiModelForMusic: state.falAiModelForMusic || defaultSettings.falAiModelForMusic,
          modelsLabModelForImage: state.modelsLabModelForImage || defaultSettings.modelsLabModelForImage,
          modelsLabModelForVideo: state.modelsLabModelForVideo || defaultSettings.modelsLabModelForVideo,
          modelsLabModelForSpeech: state.modelsLabModelForSpeech || defaultSettings.modelsLabModelForSpeech,
          modelsLabModelForSound: state.modelsLabModelForSound || defaultSettings.modelsLabModelForSound,
          modelsLabModelForMusic: state.modelsLabModelForMusic || defaultSettings.modelsLabModelForMusic,
          openaiModelForAssistant: state.openaiModelForAssistant || defaultSettings.openaiModelForAssistant,
          openaiModelForImage: state.openaiModelForImage || defaultSettings.openaiModelForImage,
          openaiModelForVideo: state.openaiModelForVideo || defaultSettings.openaiModelForVideo,
          openaiModelForSpeech: state.openaiModelForSpeech || defaultSettings.openaiModelForSpeech,
          groqModelForAssistant: state.groqModelForAssistant || defaultSettings.groqModelForAssistant,
          googleModelForAssistant: state.googleModelForAssistant || defaultSettings.googleModelForAssistant,
          googleModelForImage: state.googleModelForImage || defaultSettings.googleModelForImage,
          googleModelForVideo: state.googleModelForVideo || defaultSettings.googleModelForVideo,
          googleModelForSpeech: state.googleModelForSpeech || defaultSettings.googleModelForSpeech,
          googleModelForMusic: state.googleModelForMusic || defaultSettings.googleModelForMusic,
          anthropicModelForAssistant: state.anthropicModelForAssistant || defaultSettings.anthropicModelForAssistant,
          elevenLabsModelForSpeech: state.elevenLabsModelForSpeech || defaultSettings.elevenLabsModelForSpeech,
          elevenLabsModelForSound: state.elevenLabsModelForSound || defaultSettings.elevenLabsModelForSound,
        }
      },
    }),
    {
      name: 'CLAPPER_REVISION_0_SETTINGS_RENDERING'
    },
  ),
)