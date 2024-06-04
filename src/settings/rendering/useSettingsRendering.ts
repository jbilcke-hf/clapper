"use client"

import { create } from "zustand"
import { persist } from 'zustand/middleware'
import { getValidNumber } from "@aitube/clap"

import { ComfyVendor, RenderingStrategy } from "@/types"
import { getValidString, parseRenderingStrategy, parseComfyVendor } from "@/lib/utils"
import { HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL } from "@/lib/core/constants"

import { SettingsRenderingStore } from "./types"
import { getDefaultSettingsRendering } from "./getDefaultSettingsRendering"

export const useSettingsRendering = create<SettingsRenderingStore>()(
  persist(
    (set, get) => ({
      ...getDefaultSettingsRendering(),

      setComfyUiApiVendor: (comfyUiApiVendor?: ComfyVendor) => {
        const { comfyUiApiVendor: defaultComfyUiApiVendor } = getDefaultSettingsRendering()
        set({ comfyUiApiVendor: parseComfyVendor(comfyUiApiVendor, defaultComfyUiApiVendor) })
      },
      setComfyUiApiKey: (comfyUiApiKey?: string) => {
        const { comfyUiApiKey: defaultComfyUiApiKey } = getDefaultSettingsRendering()
        set({ comfyUiApiKey: getValidString(comfyUiApiKey, defaultComfyUiApiKey) })
      },
      setStoryboardRenderingStrategy: (storyboardRenderingStrategy?: RenderingStrategy) => {
        const { storyboardRenderingStrategy: defaulStoryboardRenderingStrategy } = getDefaultSettingsRendering()
        set({ storyboardRenderingStrategy: parseRenderingStrategy(storyboardRenderingStrategy, defaulStoryboardRenderingStrategy) })
      },
      setVideoRenderingStrategy: (videoRenderingStrategy?: RenderingStrategy) => {
        const { videoRenderingStrategy: defaultVideoRenderingStrategy } = getDefaultSettingsRendering()
        set({ videoRenderingStrategy: parseRenderingStrategy(videoRenderingStrategy, defaultVideoRenderingStrategy) })
      },
      setMaxNbAssetsToGenerateInParallel: (maxNbAssetsToGenerateInParallel?: number) => {
        const { maxNbAssetsToGenerateInParallel: defaultMaxNbAssetsToGenerateInParallel } = getDefaultSettingsRendering()
        set({
          maxNbAssetsToGenerateInParallel: getValidNumber(
            maxNbAssetsToGenerateInParallel,
            1,
            HARD_LIMIT_NB_MAX_ASSETS_TO_GENERATE_IN_PARALLEL,
            defaultMaxNbAssetsToGenerateInParallel
          )
        })
      },
    }),
    {
      name: 'CLAPPER_REVISION_0_SETTINGS_RENDERING'
    },
  ),
)