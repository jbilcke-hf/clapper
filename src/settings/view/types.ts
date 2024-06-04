export type SettingsViewState = {
  showSettings: boolean
  showImporter: boolean
  showTimeline: boolean
  showExplorer: boolean
  showVideoPlayer: boolean
  showChat: boolean
  showFPS: boolean
  followCursor: boolean
}

export type SettingsViewControls = {
  setShowSettings: (showSettings: boolean) => void
  setShowImporter: (showImporter: boolean) => void
  setShowTimeline: (showTimeline: boolean) => void
  setShowExplorer: (showExplorer: boolean) => void
  setShowVideoPlayer: (showVideoPlayer: boolean) => void
  setShowChat: (showChat: boolean) => void
  setShowFPS: (showFPS: boolean) => void
  setFollowCursor: (followCursor: boolean) => void
}

export type SettingsViewStore =
  SettingsViewState &
  SettingsViewControls