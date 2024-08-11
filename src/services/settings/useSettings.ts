'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getValidNumber, ClapWorkflowProvider } from '@aitube/clap'
import { parseRenderingStrategy, RenderingStrategy } from '@aitube/timeline'
import {
  ComfyIcuAccelerator,
  RequestSettings,
  SettingsState,
  SettingsStore,
} from '@aitube/clapper-services'

import { getValidBoolean, getValidString } from '@/lib/utils'
import { HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL } from '@/lib/core/constants'

import { getDefaultSettingsState } from './getDefaultSettingsState'
import { getValidComfyWorkflowTemplate } from '@/lib/utils/getValidComfyWorkflowTemplate'
import { parseComfyIcuAccelerator } from '@/lib/utils/parseComfyIcuAccelerator'
import { findWorkflows } from '@/components/toolbars/top-menu/lists/getWorkflowProviders'
import { useWorkflowEditor } from '../editors'

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...getDefaultSettingsState(),

      setCustomComfyUiApiKey: (customComfyUiApiKey?: string) => {
        const { customComfyUiApiKey: defaulCustomComfyUiApiKey } =
          getDefaultSettingsState()
        set({
          customComfyUiApiKey: getValidString(
            customComfyUiApiKey,
            defaulCustomComfyUiApiKey
          ),
        })
      },
      setReplicateApiKey: (replicateApiKey?: string) => {
        const { replicateApiKey: defaultReplicateApiKey } =
          getDefaultSettingsState()
        set({
          replicateApiKey: getValidString(
            replicateApiKey,
            defaultReplicateApiKey
          ),
        })
      },
      setComfyIcuApiKey: (comfyIcuApiKey?: string) => {
        const { comfyIcuApiKey: defaultComfyIcuApiKey } =
          getDefaultSettingsState()
        set({
          comfyIcuApiKey: getValidString(comfyIcuApiKey, defaultComfyIcuApiKey),
        })
      },
      setComfyIcuAccelerator: (comfyIcuAccelerator?: ComfyIcuAccelerator) => {
        const { comfyIcuAccelerator: defaulComfyIcuAccelerator } =
          getDefaultSettingsState()
        set({
          comfyIcuAccelerator: parseComfyIcuAccelerator(
            comfyIcuAccelerator,
            defaulComfyIcuAccelerator
          ),
        })
      },
      setComfyDeployApiKey: (comfyDeployApiKey?: string) => {
        const { comfyDeployApiKey: defaultComfyDeployApiKey } =
          getDefaultSettingsState()
        set({
          comfyDeployApiKey: getValidString(
            comfyDeployApiKey,
            defaultComfyDeployApiKey
          ),
        })
      },
      setHuggingFaceApiKey: (huggingFaceApiKey?: string) => {
        const { huggingFaceApiKey: defaultHuggingFaceApiKey } =
          getDefaultSettingsState()
        set({
          huggingFaceApiKey: getValidString(
            huggingFaceApiKey,
            defaultHuggingFaceApiKey
          ),
        })
      },
      setFalAiApiKey: (falAiApiKey?: string) => {
        set({
          falAiApiKey: getValidString(
            falAiApiKey,
            getDefaultSettingsState().falAiApiKey
          ),
        })
      },
      setAiTubeApiKey: (aiTubeApiKey?: string) => {
        set({
          aiTubeApiKey: getValidString(
            aiTubeApiKey,
            getDefaultSettingsState().aiTubeApiKey
          ),
        })
      },
      setModelsLabApiKey: (modelsLabApiKey?: string) => {
        set({
          modelsLabApiKey: getValidString(
            modelsLabApiKey,
            getDefaultSettingsState().modelsLabApiKey
          ),
        })
      },
      setOpenaiApiKey: (openaiApiKey?: string) => {
        set({
          openaiApiKey: getValidString(
            openaiApiKey,
            getDefaultSettingsState().openaiApiKey
          ),
        })
      },
      setGroqApiKey: (groqApiKey?: string) => {
        set({
          groqApiKey: getValidString(
            groqApiKey,
            getDefaultSettingsState().groqApiKey
          ),
        })
      },
      setGoogleApiKey: (googleApiKey?: string) => {
        set({
          googleApiKey: getValidString(
            googleApiKey,
            getDefaultSettingsState().googleApiKey
          ),
        })
      },
      setAnthropicApiKey: (anthropicApiKey?: string) => {
        set({
          anthropicApiKey: getValidString(
            anthropicApiKey,
            getDefaultSettingsState().anthropicApiKey
          ),
        })
      },
      setElevenLabsApiKey: (elevenLabsApiKey?: string) => {
        set({
          elevenLabsApiKey: getValidString(
            elevenLabsApiKey,
            getDefaultSettingsState().elevenLabsApiKey
          ),
        })
      },
      setKitsAiApiKey: (kitsAiApiKey?: string) => {
        set({
          kitsAiApiKey: getValidString(
            kitsAiApiKey,
            getDefaultSettingsState().kitsAiApiKey
          ),
        })
      },
      setCohereApiKey: (cohereApiKey?: string) => {
        set({
          cohereApiKey: getValidString(
            cohereApiKey,
            getDefaultSettingsState().cohereApiKey
          ),
        })
      },
      setMistralAiApiKey: (mistralAiApiKey?: string) => {
        set({
          mistralAiApiKey: getValidString(
            mistralAiApiKey,
            getDefaultSettingsState().mistralAiApiKey
          ),
        })
      },
      setFireworksAiApiKey: (fireworksAiApiKey?: string) => {
        set({
          fireworksAiApiKey: getValidString(
            fireworksAiApiKey,
            getDefaultSettingsState().fireworksAiApiKey
          ),
        })
      },
      setStabilityAiApiKey: (stabilityAiApiKey?: string) => {
        set({
          stabilityAiApiKey: getValidString(
            stabilityAiApiKey,
            getDefaultSettingsState().stabilityAiApiKey
          ),
        })
      },

      setBroadcastObsServerHost: (broadcastObsServerHost: string) => {
        set({ broadcastObsServerHost })
      },
      setBroadcastObsServerPort: (broadcastObsServerPort: number) => {
        set({ broadcastObsServerPort })
      },
      setBroadcastObsServerPass: (broadcastObsServerPass: string) => {
        set({ broadcastObsServerPass })
      },

      setCensorNotForAllAudiencesContent: (
        censorNotForAllAudiencesContent?: boolean
      ) => {
        set({
          censorNotForAllAudiencesContent: getValidBoolean(
            censorNotForAllAudiencesContent,
            getDefaultSettingsState().censorNotForAllAudiencesContent
          ),
        })
      },
      setImagePromptPrefix: (imagePromptPrefix?: string) => {
        set({
          imagePromptPrefix: getValidString(
            imagePromptPrefix,
            getDefaultSettingsState().imagePromptPrefix
          ),
        })
      },
      setImagePromptSuffix: (imagePromptSuffix?: string) => {
        set({
          imagePromptSuffix: getValidString(
            imagePromptSuffix,
            getDefaultSettingsState().imagePromptSuffix
          ),
        })
      },
      setImageNegativePrompt: (imageNegativePrompt?: string) => {
        set({
          imageNegativePrompt: getValidString(
            imageNegativePrompt,
            getDefaultSettingsState().imageNegativePrompt
          ),
        })
      },
      setVideoPromptPrefix: (videoPromptPrefix?: string) => {
        set({
          videoPromptPrefix: getValidString(
            videoPromptPrefix,
            getDefaultSettingsState().videoPromptPrefix
          ),
        })
      },
      setVideoPromptSuffix: (videoPromptSuffix?: string) => {
        set({
          videoPromptSuffix: getValidString(
            videoPromptSuffix,
            getDefaultSettingsState().videoPromptSuffix
          ),
        })
      },
      setVideoNegativePrompt: (videoNegativePrompt?: string) => {
        set({
          videoNegativePrompt: getValidString(
            videoNegativePrompt,
            getDefaultSettingsState().videoNegativePrompt
          ),
        })
      },
      setAssistantWorkflow: (assistantWorkflow?: string) => {
        const { assistantWorkflow: defaultAssistantWorkflow } =
          getDefaultSettingsState()
        set({
          assistantWorkflow: getValidString(
            assistantWorkflow,
            defaultAssistantWorkflow
          ),
        })
      },
      setAssistantTurboWorkflow: (assistantTurboWorkflow?: string) => {
        const { assistantTurboWorkflow: defaultAssistantTurboWorkflow } =
          getDefaultSettingsState()
        set({
          assistantTurboWorkflow: getValidString(
            assistantTurboWorkflow,
            defaultAssistantTurboWorkflow
          ),
        })
      },
      setImageGenerationWorkflow: (imageGenerationWorkflow?: string) => {
        const { imageGenerationWorkflow: defaultImageGenerationWorkflow } =
          getDefaultSettingsState()
        set({
          imageGenerationWorkflow: getValidString(
            imageGenerationWorkflow,
            defaultImageGenerationWorkflow
          ),
        })
      },
      setImageGenerationTurboWorkflow: (
        imageGenerationTurboWorkflow?: string
      ) => {
        const {
          imageGenerationTurboWorkflow: defaultImageGenerationTurboWorkflow,
        } = getDefaultSettingsState()
        set({
          imageGenerationTurboWorkflow: getValidString(
            imageGenerationTurboWorkflow,
            defaultImageGenerationTurboWorkflow
          ),
        })
      },
      setImageUpscalingWorkflow: (imageUpscalingWorkflow?: string) => {
        const { imageUpscalingWorkflow: defaultImageUpscalingWorkflow } =
          getDefaultSettingsState()
        set({
          imageUpscalingWorkflow: getValidString(
            imageUpscalingWorkflow,
            defaultImageUpscalingWorkflow
          ),
        })
      },
      setImageDepthWorkflow: (imageDepthWorkflow?: string) => {
        const { imageDepthWorkflow: defaultImageDepthWorkflow } =
          getDefaultSettingsState()
        set({
          imageDepthWorkflow: getValidString(
            imageDepthWorkflow,
            defaultImageDepthWorkflow
          ),
        })
      },
      setImageSegmentationWorkflow: (imageSegmentationWorkflow?: string) => {
        const { imageSegmentationWorkflow: defaultImageSegmentationWorkflow } =
          getDefaultSettingsState()
        set({
          imageSegmentationWorkflow: getValidString(
            imageSegmentationWorkflow,
            defaultImageSegmentationWorkflow
          ),
        })
      },
      setVideoGenerationWorkflow: (videoGenerationWorkflow?: string) => {
        const { videoGenerationWorkflow: defaultVideoGenerationWorkflow } =
          getDefaultSettingsState()
        set({
          videoGenerationWorkflow: getValidString(
            videoGenerationWorkflow,
            defaultVideoGenerationWorkflow
          ),
        })
      },
      setVideoUpscalingWorkflow: (videoUpscalingWorkflow?: string) => {
        const { videoUpscalingWorkflow: defaultVideoUpscalingWorkflow } =
          getDefaultSettingsState()
        set({
          videoUpscalingWorkflow: getValidString(
            videoUpscalingWorkflow,
            defaultVideoUpscalingWorkflow
          ),
        })
      },
      setVideoDepthWorkflow: (videoDepthWorkflow?: string) => {
        const { videoDepthWorkflow: defaultVideoDepthWorkflow } =
          getDefaultSettingsState()
        set({
          videoDepthWorkflow: getValidString(
            videoDepthWorkflow,
            defaultVideoDepthWorkflow
          ),
        })
      },
      setVideoSegmentationWorkflow: (videoSegmentationWorkflow?: string) => {
        const { videoSegmentationWorkflow: defaultVideoSegmentationWorkflow } =
          getDefaultSettingsState()
        set({
          videoSegmentationWorkflow: getValidString(
            videoSegmentationWorkflow,
            defaultVideoSegmentationWorkflow
          ),
        })
      },
      setSoundGenerationWorkflow: (soundGenerationWorkflow?: string) => {
        const { soundGenerationWorkflow: defaultSoundGenerationWorkflow } =
          getDefaultSettingsState()
        set({
          soundGenerationWorkflow: getValidString(
            soundGenerationWorkflow,
            defaultSoundGenerationWorkflow
          ),
        })
      },
      setVoiceGenerationWorkflow: (voiceGenerationWorkflow?: string) => {
        const { voiceGenerationWorkflow: defaultVoiceGenerationWorkflow } =
          getDefaultSettingsState()
        set({
          voiceGenerationWorkflow: getValidString(
            voiceGenerationWorkflow,
            defaultVoiceGenerationWorkflow
          ),
        })
      },
      setMusicGenerationWorkflow: (musicGenerationWorkflow?: string) => {
        const { musicGenerationWorkflow: defaultVoiceGenerationWorkflow } =
          getDefaultSettingsState()
        set({
          musicGenerationWorkflow: getValidString(
            musicGenerationWorkflow,
            defaultVoiceGenerationWorkflow
          ),
        })
      },
      setImageRenderingStrategy: (
        imageRenderingStrategy?: RenderingStrategy
      ) => {
        const { imageRenderingStrategy: defaultImageRenderingStrategy } =
          getDefaultSettingsState()
        set({
          imageRenderingStrategy: parseRenderingStrategy(
            imageRenderingStrategy,
            defaultImageRenderingStrategy
          ),
        })
      },
      setImageDepthRenderingStrategy: (
        imageDepthRenderingStrategy?: RenderingStrategy
      ) => {
        const {
          imageDepthRenderingStrategy: defaultImageDepthRenderingStrategy,
        } = getDefaultSettingsState()
        set({
          imageDepthRenderingStrategy: parseRenderingStrategy(
            imageDepthRenderingStrategy,
            defaultImageDepthRenderingStrategy
          ),
        })
      },
      setImageSegmentationRenderingStrategy: (
        imageSegmentationRenderingStrategy?: RenderingStrategy
      ) => {
        const {
          imageSegmentationRenderingStrategy:
            defaultImageSegmentationRenderingStrategy,
        } = getDefaultSettingsState()
        set({
          imageSegmentationRenderingStrategy: parseRenderingStrategy(
            imageSegmentationRenderingStrategy,
            defaultImageSegmentationRenderingStrategy
          ),
        })
      },
      setImageUpscalingRenderingStrategy: (
        imageUpscalingRenderingStrategy?: RenderingStrategy
      ) => {
        const {
          imageUpscalingRenderingStrategy:
            defaultImageUpscalingRenderingStrategy,
        } = getDefaultSettingsState()
        set({
          imageUpscalingRenderingStrategy: parseRenderingStrategy(
            imageUpscalingRenderingStrategy,
            defaultImageUpscalingRenderingStrategy
          ),
        })
      },
      setVideoRenderingStrategy: (
        videoRenderingStrategy?: RenderingStrategy
      ) => {
        const { videoRenderingStrategy: defaultVideoRenderingStrategy } =
          getDefaultSettingsState()
        set({
          videoRenderingStrategy: parseRenderingStrategy(
            videoRenderingStrategy,
            defaultVideoRenderingStrategy
          ),
        })
      },
      setVideoDepthRenderingStrategy: (
        videoDepthRenderingStrategy?: RenderingStrategy
      ) => {
        const {
          videoDepthRenderingStrategy: defaultVideoDepthRenderingStrategy,
        } = getDefaultSettingsState()
        set({
          imageDepthRenderingStrategy: parseRenderingStrategy(
            videoDepthRenderingStrategy,
            defaultVideoDepthRenderingStrategy
          ),
        })
      },
      setVideoSegmentationRenderingStrategy: (
        videoSegmentationRenderingStrategy?: RenderingStrategy
      ) => {
        const {
          videoSegmentationRenderingStrategy:
            defaultVideoSegmentationRenderingStrategy,
        } = getDefaultSettingsState()
        set({
          videoSegmentationRenderingStrategy: parseRenderingStrategy(
            videoSegmentationRenderingStrategy,
            defaultVideoSegmentationRenderingStrategy
          ),
        })
      },
      setVideoUpscalingRenderingStrategy: (
        videoUpscalingRenderingStrategy?: RenderingStrategy
      ) => {
        const {
          videoUpscalingRenderingStrategy:
            defaultVideoUpscalingRenderingStrategy,
        } = getDefaultSettingsState()
        set({
          videoUpscalingRenderingStrategy: parseRenderingStrategy(
            videoUpscalingRenderingStrategy,
            defaultVideoUpscalingRenderingStrategy
          ),
        })
      },
      setVoiceRenderingStrategy: (
        voiceRenderingStrategy?: RenderingStrategy
      ) => {
        const { voiceRenderingStrategy: defaultSpeechRenderingStrategy } =
          getDefaultSettingsState()
        set({
          voiceRenderingStrategy: parseRenderingStrategy(
            voiceRenderingStrategy,
            defaultSpeechRenderingStrategy
          ),
        })
      },
      setSoundRenderingStrategy: (
        soundRenderingStrategy?: RenderingStrategy
      ) => {
        const { soundRenderingStrategy: defaultSoundRenderingStrategy } =
          getDefaultSettingsState()
        set({
          soundRenderingStrategy: parseRenderingStrategy(
            soundRenderingStrategy,
            defaultSoundRenderingStrategy
          ),
        })
      },
      setMusicRenderingStrategy: (
        musicRenderingStrategy?: RenderingStrategy
      ) => {
        const { musicRenderingStrategy: defaultMusicRenderingStrategy } =
          getDefaultSettingsState()
        set({
          musicRenderingStrategy: parseRenderingStrategy(
            musicRenderingStrategy,
            defaultMusicRenderingStrategy
          ),
        })
      },
      setMaxImagesToGenerateInParallel: (
        maxImagesToGenerateInParallel?: number
      ) => {
        const {
          maxImagesToGenerateInParallel: defaultMaxImagesToGenerateInParallel,
        } = getDefaultSettingsState()
        set({
          maxImagesToGenerateInParallel: getValidNumber(
            maxImagesToGenerateInParallel,
            1,
            HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL,
            defaultMaxImagesToGenerateInParallel
          ),
        })
      },
      setMaxVideosToGenerateInParallel: (
        maxVideosToGenerateInParallel?: number
      ) => {
        const {
          maxVideosToGenerateInParallel: defaultMaxVideosToGenerateInParallel,
        } = getDefaultSettingsState()
        set({
          maxVideosToGenerateInParallel: getValidNumber(
            maxVideosToGenerateInParallel,
            1,
            HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL,
            defaultMaxVideosToGenerateInParallel
          ),
        })
      },
      setComfyWorkflowForImage: (comfyWorkflowForImage?: string) => {
        set({
          comfyWorkflowForImage: getValidComfyWorkflowTemplate(
            comfyWorkflowForImage,
            getDefaultSettingsState().comfyWorkflowForImage
          ),
        })
      },
      setComfyWorkflowForVideo: (comfyWorkflowForVideo?: string) => {
        set({
          comfyWorkflowForVideo: getValidComfyWorkflowTemplate(
            comfyWorkflowForVideo,
            getDefaultSettingsState().comfyWorkflowForVideo
          ),
        })
      },
      setComfyWorkflowForVoice: (comfyWorkflowForVoice?: string) => {
        set({
          comfyWorkflowForVoice: getValidComfyWorkflowTemplate(
            comfyWorkflowForVoice,
            getDefaultSettingsState().comfyWorkflowForVoice
          ),
        })
      },
      setComfyWorkflowForSound: (comfyWorkflowForSound?: string) => {
        set({
          comfyWorkflowForSound: getValidComfyWorkflowTemplate(
            comfyWorkflowForSound,
            getDefaultSettingsState().comfyWorkflowForSound
          ),
        })
      },
      setComfyWorkflowForMusic: (comfyWorkflowForMusic?: string) => {
        set({
          comfyWorkflowForMusic: getValidComfyWorkflowTemplate(
            comfyWorkflowForMusic,
            getDefaultSettingsState().comfyWorkflowForMusic
          ),
        })
      },
      setGradioApiUrlForAssistant: (gradioApiUrlForAssistant?: string) => {
        set({
          gradioApiUrlForAssistant: getValidString(
            gradioApiUrlForAssistant,
            getDefaultSettingsState().gradioApiUrlForAssistant
          ),
        })
      },
      setGradioApiUrlForImage: (gradioApiUrlForImage?: string) => {
        set({
          gradioApiUrlForImage: getValidString(
            gradioApiUrlForImage,
            getDefaultSettingsState().gradioApiUrlForImage
          ),
        })
      },
      setGradioApiUrlForVideo: (gradioApiUrlForVideo?: string) => {
        set({
          gradioApiUrlForVideo: getValidString(
            gradioApiUrlForVideo,
            getDefaultSettingsState().gradioApiUrlForVideo
          ),
        })
      },
      setGradioApiUrlForVoice: (gradioApiUrlForVoice?: string) => {
        set({
          gradioApiUrlForVoice: getValidString(
            gradioApiUrlForVoice,
            getDefaultSettingsState().gradioApiUrlForVoice
          ),
        })
      },
      setGradioApiUrlForSound: (gradioApiUrlForSound?: string) => {
        set({
          gradioApiUrlForSound: getValidString(
            gradioApiUrlForSound,
            getDefaultSettingsState().gradioApiUrlForSound
          ),
        })
      },
      setGradioApiUrlForMusic: (gradioApiUrlForMusic?: string) => {
        set({
          gradioApiUrlForMusic: getValidString(
            gradioApiUrlForMusic,
            getDefaultSettingsState().gradioApiUrlForMusic
          ),
        })
      },
      setScriptEditorShowLineNumbers: (
        scriptEditorShowLineNumbers: boolean
      ) => {
        set({
          scriptEditorShowLineNumbers: getValidBoolean(
            scriptEditorShowLineNumbers,
            getDefaultSettingsState().scriptEditorShowLineNumbers
          ),
        })
      },
      setScriptEditorShowMinimap: (scriptEditorShowMinimap: boolean) => {
        set({
          scriptEditorShowMinimap: getValidBoolean(
            scriptEditorShowMinimap,
            getDefaultSettingsState().scriptEditorShowMinimap
          ),
        })
      },
      /*
      should we deprecate this? or rename to "default<something>"?
      setHuggingFaceModelForAssistant: (huggingFaceModelForAssistant?: string) => {
        set({ huggingFaceModelForAssistant: getValidString(huggingFaceModelForAssistant, getDefaultSettingsState().huggingFaceModelForAssistant) })
      },
      setHuggingFaceModelForImage: (huggingFaceModelForImage?: string) => {
        set({ huggingFaceModelForImage: getValidString(huggingFaceModelForImage, getDefaultSettingsState().huggingFaceModelForImage) })
      },
      setHuggingFaceModelForImageDepth: (huggingFaceModelForImageDepth?: string) => {
        set({ huggingFaceModelForImageDepth: getValidString(huggingFaceModelForImageDepth, getDefaultSettingsState().huggingFaceModelForImageDepth) })
      },
      setHuggingFaceModelForImageSegmentation: (huggingFaceModelForImageSegmentation?: string) => {
        set({ huggingFaceModelForImageSegmentation: getValidString(huggingFaceModelForImageSegmentation, getDefaultSettingsState().huggingFaceModelForImageSegmentation) })
      },
      setHuggingFaceModelForImageUpscaling: (huggingFaceModelForImageUpscaling?: string) => {
        set({ huggingFaceModelForImageUpscaling: getValidString(huggingFaceModelForImageUpscaling, getDefaultSettingsState().huggingFaceModelForImageUpscaling) })
      },
      setHuggingFaceModelForVideo: (huggingFaceModelForVideo?: string) => {
        set({ huggingFaceModelForVideo: getValidString(huggingFaceModelForVideo, getDefaultSettingsState().huggingFaceModelForVideo) })
      },
      setHuggingFaceModelForVideoDepth: (huggingFaceModelForVideoDepth?: string) => {
        set({ huggingFaceModelForVideoDepth: getValidString(huggingFaceModelForVideoDepth, getDefaultSettingsState().huggingFaceModelForVideoDepth) })
      },
      setHuggingFaceModelForVideoSegmentation: (huggingFaceModelForVideoSegmentation?: string) => {
        set({ huggingFaceModelForVideoSegmentation: getValidString(huggingFaceModelForVideoSegmentation, getDefaultSettingsState().huggingFaceModelForVideoSegmentation) })
      },
      setHuggingFaceModelForVideoUpscaling: (huggingFaceModelForVideoUpscaling?: string) => {
        set({ huggingFaceModelForVideoUpscaling: getValidString(huggingFaceModelForVideoUpscaling, getDefaultSettingsState().huggingFaceModelForVideoUpscaling) })
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
      setReplicateModelForImage: (replicateModelForImage?: string) => {
        set({ replicateModelForImage: getValidString(replicateModelForImage, getDefaultSettingsState().replicateModelForImage) })
      },
      setReplicateModelForImageDepth: (replicateModelForImageDepth?: string) => {
        set({ replicateModelForImageDepth: getValidString(replicateModelForImageDepth, getDefaultSettingsState().replicateModelForImageDepth) })
      },
      setReplicateModelForImageSegmentation: (replicateModelForImageSegmentation?: string) => {
        set({ replicateModelForImageSegmentation: getValidString(replicateModelForImageSegmentation, getDefaultSettingsState().replicateModelForImageSegmentation) })
      },
      setReplicateModelForImageUpscaling: (replicateModelForImageUpscaling?: string) => {
        set({ replicateModelForImageUpscaling: getValidString(replicateModelForImageUpscaling, getDefaultSettingsState().replicateModelForImageUpscaling) })
      },
      setReplicateModelForVideo: (replicateModelForVideo?: string) => {
        set({ replicateModelForVideo: getValidString(replicateModelForVideo, getDefaultSettingsState().replicateModelForVideo) })
      },
      setReplicateModelForVideoDepth: (replicateModelForVideoDepth?: string) => {
        set({ replicateModelForVideoDepth: getValidString(replicateModelForVideoDepth, getDefaultSettingsState().replicateModelForVideoDepth) })
      },
      setReplicateModelForVideoSegmentation: (replicateModelForVideoSegmentation?: string) => {
        set({ replicateModelForVideoSegmentation: getValidString(replicateModelForVideoSegmentation, getDefaultSettingsState().replicateModelForVideoSegmentation) })
      },
      setReplicateModelForVideoUpscaling: (replicateModelForVideoUpscaling?: string) => {
        set({ replicateModelForVideoUpscaling: getValidString(replicateModelForVideoUpscaling, getDefaultSettingsState().replicateModelForVideoUpscaling) })
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
      setFalAiModelForImageDepth: (falAiModelForImageDepth?: string) => {
        set({ falAiModelForImageDepth: getValidString(falAiModelForImageDepth, getDefaultSettingsState().falAiModelForImageDepth) })
      },
      setFalAiModelForImageSegmentation: (falAiModelForImageSegmentation?: string) => {
        set({ falAiModelForImageSegmentation: getValidString(falAiModelForImageSegmentation, getDefaultSettingsState().falAiModelForImageSegmentation) })
      },
      setFalAiModelForImageUpscaling: (falAiModelForImageUpscaling?: string) => {
        set({ falAiModelForImageUpscaling: getValidString(falAiModelForImageUpscaling, getDefaultSettingsState().falAiModelForImageUpscaling) })
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
      */
      getRequestSettings: (): RequestSettings => {
        const state = get()
        const defaultSettings = getDefaultSettingsState()

        const availableWorkflows =
          useWorkflowEditor.getState().availableWorkflows

        const assistantWorkflowId =
          state.assistantWorkflow || defaultSettings.assistantWorkflow

        const assistantTurboWorkflowId =
          state.assistantTurboWorkflow || defaultSettings.assistantTurboWorkflow

        const imageGenerationWorkflowId =
          state.imageGenerationWorkflow ||
          defaultSettings.imageGenerationWorkflow

        const imageGenerationTurboWorkflowId =
          state.imageGenerationTurboWorkflow ||
          defaultSettings.imageGenerationTurboWorkflow

        const imageUpscalingWorkflowId =
          state.imageUpscalingWorkflow || defaultSettings.imageUpscalingWorkflow

        const imageDepthWorkflowId =
          state.imageDepthWorkflow || defaultSettings.imageDepthWorkflow

        const imageSegmentationWorkflowId =
          state.imageSegmentationWorkflow ||
          defaultSettings.imageSegmentationWorkflow

        const videoGenerationWorkflowId =
          state.videoGenerationWorkflow ||
          defaultSettings.videoGenerationWorkflow

        const videoDepthWorkflowId =
          state.videoDepthWorkflow || defaultSettings.videoDepthWorkflow

        const videoSegmentationWorkflowId =
          state.videoSegmentationWorkflow ||
          defaultSettings.videoSegmentationWorkflow

        const videoUpscalingWorkflowId =
          state.videoUpscalingWorkflow || defaultSettings.videoUpscalingWorkflow

        const soundGenerationWorkflowId =
          state.soundGenerationWorkflow ||
          defaultSettings.soundGenerationWorkflow

        const voiceGenerationWorkflowId =
          state.voiceGenerationWorkflow ||
          defaultSettings.voiceGenerationWorkflow

        const musicGenerationWorkflowId =
          state.musicGenerationWorkflow ||
          defaultSettings.musicGenerationWorkflow

        const { workflowIds } = findWorkflows(availableWorkflows, {
          workflowIds: [
            assistantWorkflowId,
            assistantTurboWorkflowId,
            imageGenerationWorkflowId,
            imageGenerationTurboWorkflowId,
            imageUpscalingWorkflowId,
            imageDepthWorkflowId,
            imageSegmentationWorkflowId,
            videoGenerationWorkflowId,
            videoDepthWorkflowId,
            videoSegmentationWorkflowId,
            videoUpscalingWorkflowId,
            soundGenerationWorkflowId,
            voiceGenerationWorkflowId,
            musicGenerationWorkflowId,
          ],
        })

        return {
          // why do we need those fallbacks? because some users will leave the fields empty,
          // eg. an empty model string.. basically we want to allow empty config that still works!

          customComfyUiApiKey:
            state.customComfyUiApiKey || defaultSettings.customComfyUiApiKey,
          replicateApiKey:
            state.replicateApiKey || defaultSettings.replicateApiKey,
          comfyIcuApiKey:
            state.comfyIcuApiKey || defaultSettings.comfyIcuApiKey,
          comfyIcuAccelerator:
            state.comfyIcuAccelerator || defaultSettings.comfyIcuAccelerator,
          comfyDeployApiKey:
            state.comfyDeployApiKey || defaultSettings.comfyDeployApiKey,

          huggingFaceApiKey:
            state.huggingFaceApiKey || defaultSettings.huggingFaceApiKey,
          aiTubeApiKey: state.aiTubeApiKey || defaultSettings.aiTubeApiKey,

          falAiApiKey: state.falAiApiKey || defaultSettings.falAiApiKey,
          modelsLabApiKey:
            state.modelsLabApiKey || defaultSettings.modelsLabApiKey,
          openaiApiKey: state.openaiApiKey || defaultSettings.openaiApiKey,
          groqApiKey: state.groqApiKey || defaultSettings.groqApiKey,
          googleApiKey: state.googleApiKey || defaultSettings.googleApiKey,
          anthropicApiKey:
            state.anthropicApiKey || defaultSettings.anthropicApiKey,
          elevenLabsApiKey:
            state.elevenLabsApiKey || defaultSettings.elevenLabsApiKey,
          cohereApiKey: state.cohereApiKey || defaultSettings.cohereApiKey,
          mistralAiApiKey:
            state.mistralAiApiKey || defaultSettings.mistralAiApiKey,
          kitsAiApiKey: state.kitsAiApiKey || defaultSettings.kitsAiApiKey,
          fireworksAiApiKey:
            state.fireworksAiApiKey || defaultSettings.fireworksAiApiKey,
          stabilityAiApiKey:
            state.stabilityAiApiKey || defaultSettings.stabilityAiApiKey,

          broadcastObsServerHost:
            state.broadcastObsServerHost ||
            defaultSettings.broadcastObsServerHost,
          broadcastObsServerPort:
            state.broadcastObsServerPort ||
            defaultSettings.broadcastObsServerPort,
          broadcastObsServerPass:
            state.broadcastObsServerPass ||
            defaultSettings.broadcastObsServerPass,

          censorNotForAllAudiencesContent:
            state.censorNotForAllAudiencesContent ||
            defaultSettings.censorNotForAllAudiencesContent,
          imagePromptPrefix:
            state.imagePromptPrefix || defaultSettings.imagePromptPrefix,
          imagePromptSuffix:
            state.imagePromptSuffix || defaultSettings.imagePromptSuffix,
          imageNegativePrompt:
            state.imageNegativePrompt || defaultSettings.imageNegativePrompt,
          videoPromptPrefix:
            state.videoPromptPrefix || defaultSettings.videoPromptPrefix,
          videoPromptSuffix:
            state.videoPromptSuffix || defaultSettings.videoPromptSuffix,
          videoNegativePrompt:
            state.videoNegativePrompt || defaultSettings.videoNegativePrompt,

          assistantWorkflow: workflowIds[assistantWorkflowId],
          assistantTurboWorkflow: workflowIds[assistantTurboWorkflowId],
          imageGenerationWorkflow: workflowIds[imageGenerationWorkflowId],
          imageGenerationTurboWorkflow:
            workflowIds[imageGenerationTurboWorkflowId],
          imageUpscalingWorkflow: workflowIds[imageUpscalingWorkflowId],
          imageDepthWorkflow: workflowIds[imageDepthWorkflowId],
          imageSegmentationWorkflow: workflowIds[imageSegmentationWorkflowId],
          videoGenerationWorkflow: workflowIds[videoGenerationWorkflowId],
          videoDepthWorkflow: workflowIds[videoDepthWorkflowId],
          videoSegmentationWorkflow: workflowIds[videoSegmentationWorkflowId],
          videoUpscalingWorkflow: workflowIds[videoUpscalingWorkflowId],
          soundGenerationWorkflow: workflowIds[soundGenerationWorkflowId],
          voiceGenerationWorkflow: workflowIds[voiceGenerationWorkflowId],
          musicGenerationWorkflow: workflowIds[musicGenerationWorkflowId],

          imageRenderingStrategy:
            state.imageRenderingStrategy ||
            defaultSettings.imageRenderingStrategy,
          imageDepthRenderingStrategy:
            state.imageDepthRenderingStrategy ||
            defaultSettings.imageDepthRenderingStrategy,
          imageSegmentationRenderingStrategy:
            state.imageSegmentationRenderingStrategy ||
            defaultSettings.imageSegmentationRenderingStrategy,
          imageUpscalingRenderingStrategy:
            state.imageUpscalingRenderingStrategy ||
            defaultSettings.imageUpscalingRenderingStrategy,

          videoRenderingStrategy:
            state.videoRenderingStrategy ||
            defaultSettings.videoRenderingStrategy,
          videoDepthRenderingStrategy:
            state.videoDepthRenderingStrategy ||
            defaultSettings.videoDepthRenderingStrategy,
          videoSegmentationRenderingStrategy:
            state.videoSegmentationRenderingStrategy ||
            defaultSettings.videoSegmentationRenderingStrategy,
          videoUpscalingRenderingStrategy:
            state.videoUpscalingRenderingStrategy ||
            defaultSettings.videoUpscalingRenderingStrategy,

          voiceRenderingStrategy:
            state.voiceRenderingStrategy ||
            defaultSettings.voiceRenderingStrategy,
          soundRenderingStrategy:
            state.soundRenderingStrategy ||
            defaultSettings.soundRenderingStrategy,
          musicRenderingStrategy:
            state.musicRenderingStrategy ||
            defaultSettings.musicRenderingStrategy,
          maxImagesToGenerateInParallel:
            state.maxImagesToGenerateInParallel ||
            defaultSettings.maxImagesToGenerateInParallel,
          maxVideosToGenerateInParallel:
            state.maxVideosToGenerateInParallel ||
            defaultSettings.maxVideosToGenerateInParallel,
          comfyWorkflowForImage:
            state.comfyWorkflowForImage ||
            defaultSettings.comfyWorkflowForImage,
          comfyWorkflowForVideo:
            state.comfyWorkflowForVideo ||
            defaultSettings.comfyWorkflowForVideo,
          comfyWorkflowForVoice:
            state.comfyWorkflowForVoice ||
            defaultSettings.comfyWorkflowForVoice,
          comfyWorkflowForSound:
            state.comfyWorkflowForSound ||
            defaultSettings.comfyWorkflowForSound,
          comfyWorkflowForMusic:
            state.comfyWorkflowForMusic ||
            defaultSettings.comfyWorkflowForMusic,
          gradioApiUrlForAssistant:
            state.gradioApiUrlForAssistant ||
            defaultSettings.gradioApiUrlForAssistant,
          gradioApiUrlForImage:
            state.gradioApiUrlForImage || defaultSettings.gradioApiUrlForImage,
          gradioApiUrlForVideo:
            state.gradioApiUrlForVideo || defaultSettings.gradioApiUrlForVideo,
          gradioApiUrlForVoice:
            state.gradioApiUrlForVoice || defaultSettings.gradioApiUrlForVoice,
          gradioApiUrlForSound:
            state.gradioApiUrlForSound || defaultSettings.gradioApiUrlForSound,
          gradioApiUrlForMusic:
            state.gradioApiUrlForMusic || defaultSettings.gradioApiUrlForMusic,
          scriptEditorShowLineNumbers:
            state.scriptEditorShowLineNumbers ||
            defaultSettings.scriptEditorShowLineNumbers,
          scriptEditorShowMinimap:
            state.scriptEditorShowMinimap ||
            defaultSettings.scriptEditorShowMinimap,
        }
      },
    }),
    {
      name: 'CLAPPER_REVISION_0_CONTROLLERS_USE_SETTINGS',
    }
  )
)
