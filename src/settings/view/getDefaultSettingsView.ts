import { SettingsViewState } from "./types"

export function getDefaultSettingsView(): SettingsViewState {
  const state: SettingsViewState = {
    showSettings: false,
    showImporter: false,
    showTimeline: true,
    showExplorer: true,
    showVideoPlayer: true,
    showChat: true,
    showFPS: true,
    followCursor: true,
  }

  return state
}
