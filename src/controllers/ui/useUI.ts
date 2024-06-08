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
      setShowChat: (showChat: boolean) => {
        set({ showChat })
      },
      setShowFPS: (showFPS: boolean) => {
        set({ showFPS })
      },
      setFollowCursor: (followCursor: boolean) => {
        set({ followCursor })
      },
    }),
    {
      name: 'CLAPPER_REVISION_0_SETTINGS_VIEW'
    },
  ),
)