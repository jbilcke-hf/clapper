import { UIState } from "./types"

export function getDefaultUIState(): UIState {
  const state: UIState = {
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
