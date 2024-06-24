"use client"

import { create } from "zustand"
import { persist } from 'zustand/middleware'

import { SettingsCategory } from "@/types"
import { UIStore } from "./types"
import { getDefaultUIState } from "./getDefaultUIState"
import { UITheme, UIThemeName, backstage, themes } from "./theme"
import { useEditor } from "../editor/useEditor"

export const useUI = create<UIStore>()(
  persist(
    (set, get) => ({
      ...getDefaultUIState(),
      setHasBetaAccess: (hasBetaAccess: boolean) => {
        set({ hasBetaAccess })
      },
      setThemeName: (themeName: UIThemeName) => {
        set({ themeName })
        get().applyThemeToComponents()
      },
      applyThemeToComponents: () => {
        const theme = get().getTheme()

        // update the editor's theme
        useEditor.getState().monaco?.editor?.setTheme?.(theme.id)

        // update the timeline's theme
        // this is an interesting "fast trial" mode to test color hues,
        // but obviously we cannot use that in production
        // const style = document.getElementById("clap-timeline")?.style
        // if (style) { style.filter = theme.timelineFilter }
      },
      getTheme: () => {
        return themes[get().themeName] || themes.backstage
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
      setEditorFontSize: (editorFontSize: number) => {
        set({ editorFontSize })
      },
    }),
    {
      name: 'CLAPPER_REVISION_0_CONTROLLERS_UI'
    },
  ),
)

if (typeof window !== "undefined") {
  (window as any).useUI = useUI
}