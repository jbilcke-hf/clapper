import { SettingsCategory } from "@/types"
import { UITheme, UIThemeName } from "./theme"

export type UIState = {
  hasBetaAccess: boolean
  themeName: UIThemeName
  showApiKeys: boolean
  showSettings: SettingsCategory
  showImporter: boolean
  showTimeline: boolean
  showExplorer: boolean
  showVideoPlayer: boolean
  showAssistant: boolean
  showFPS: boolean
  followCursor: boolean
  editorFontSize: number
}

export type UIControls = {
  setHasBetaAccess: (hasBetaAccess: boolean) => void
  setThemeName: (themeName: UIThemeName) => void
  applyThemeToComponents: () => void
  getTheme: () => UITheme
  setShowApiKeys: (showApiKeys: boolean) => void
  setShowSettings: (showSettings: SettingsCategory) => void
  setShowImporter: (showImporter: boolean) => void
  setShowTimeline: (showTimeline: boolean) => void
  setShowExplorer: (showExplorer: boolean) => void
  setShowVideoPlayer: (showVideoPlayer: boolean) => void
  setShowAssistant: (showAssistant: boolean) => void
  setShowFPS: (showFPS: boolean) => void
  setFollowCursor: (followCursor: boolean) => void
  setEditorFontSize: (editorFontSize: number) => void
  
}

export type UIStore =
  UIState &
  UIControls