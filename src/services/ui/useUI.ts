'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  ProjectCreationWizardStep,
  ScriptEditorService,
  ScriptEditorStore,
  SettingsCategory,
  UIStore,
  UITheme,
  UIThemeName,
} from '@aitube/clapper-services'
import { getDefaultUIState } from './getDefaultUIState'
import { themes } from './theme'
import { useScriptEditor } from '../editors/script-editor/useScriptEditor'
import { TimelineStore, useTimeline } from '@aitube/timeline'

export const useUI = create<UIStore>()(
  persist(
    (set, get) => ({
      ...getDefaultUIState(),
      setIsTopMenuOpen: (isTopMenuOpen: boolean) => {
        set({ isTopMenuOpen })
      },
      setShowWelcomeScreen: (showWelcomeScreen: boolean) => {
        console.log('setShowWelcomeScreen called with:', showWelcomeScreen)
        set({ showWelcomeScreen: showWelcomeScreen })
      },
      setHasBetaAccess: (hasBetaAccess: boolean) => {
        set({ hasBetaAccess })
      },
      setThemeName: (themeName: UIThemeName) => {
        set({ themeName })
        get().applyThemeToComponents()
      },
      applyThemeToComponents: () => {
        const scriptEditor: ScriptEditorStore = useScriptEditor.getState()
        const timeline: TimelineStore = useTimeline.getState()

        const theme = get().getTheme()

        // update the editor's theme
        scriptEditor.monaco?.editor?.setTheme?.(theme.id)

        timeline.setTimelineTheme(theme.timeline)
        // update the timeline's theme
        // this is an interesting "fast trial" mode to test color hues,
        // but obviously we cannot use that in production
        // const style = document.getElementById("clap-timeline")?.style
        // if (style) { style.filter = theme.timelineFilter }
      },
      getTheme: () => {
        return (themes as any)[get().themeName] || themes.backstage
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
      setProjectCreationWizardStep: (
        projectCreationWizardStep: ProjectCreationWizardStep
      ) => {
        set({ projectCreationWizardStep })
      },
    }),
    {
      name: 'CLAPPER_REVISION_0_CONTROLLERS_UI',
    }
  )
)
