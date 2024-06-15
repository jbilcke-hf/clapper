"use client"

import { create } from "zustand"
import { persist } from 'zustand/middleware'

import { UIStore } from "./types"
import { getDefaultUIState } from "./getDefaultUIState"
import { SettingsCategory } from "@/types"

export const useUI = create<UIStore>()(
  persist(
    (set, get) => ({
      ...getDefaultUIState(),
      setHasBetaAccess: (hasBetaAccess: boolean) => {
        set({ hasBetaAccess })
      },
      setShowApiKeys: (showApiKeys: boolean) => {
        set({ showApiKeys })
      },
      setShowSettings: (showSettings: SettingsCategory) => {
        set({ showSettings })
      },
      setShowImporter: (showImporter: boolean) => {
        set({ showImporter })
      },
      setShowTimeline: (showTimeline: boolean) => {
        set({ showTimeline })
      },
      setShowExplorer: (showExplorer: boolean) => {
        set({ showExplorer })
      },
      setShowVideoPlayer: (showVideoPlayer: boolean) => {
        set({ showVideoPlayer })
      },
      setShowAssistant: (showAssistant: boolean) => {
        set({ showAssistant })
      },
      setShowFPS: (showFPS: boolean) => {
        set({ showFPS })
      },
      setFollowCursor: (followCursor: boolean) => {
        set({ followCursor })
      },
    }),
    {
      name: 'CLAPPER_REVISION_0_CONTROLLERS_UI'
    },
  ),
)