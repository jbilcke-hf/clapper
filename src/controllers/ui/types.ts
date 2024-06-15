import { SettingsCategory } from "@/types"

export type UIState = {
  hasBetaAccess: boolean
  showApiKeys: boolean
  showSettings: SettingsCategory
  showImporter: boolean
  showTimeline: boolean
  showExplorer: boolean
  showVideoPlayer: boolean
  showAssistant: boolean
  showFPS: boolean
  followCursor: boolean
}

export type UIControls = {
  setHasBetaAccess: (hasBetaAccess: boolean) => void
  setShowApiKeys: (showApiKeys: boolean) => void
  setShowSettings: (showSettings: SettingsCategory) => void
  setShowImporter: (showImporter: boolean) => void
  setShowTimeline: (showTimeline: boolean) => void
  setShowExplorer: (showExplorer: boolean) => void
  setShowVideoPlayer: (showVideoPlayer: boolean) => void
  setShowAssistant: (showAssistant: boolean) => void
  setShowFPS: (showFPS: boolean) => void
  setFollowCursor: (followCursor: boolean) => void
}

export type UIStore =
  UIState &
  UIControls