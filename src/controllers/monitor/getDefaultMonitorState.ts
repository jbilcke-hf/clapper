import { MonitoringMode, MonitorState } from "./types"

export function getDefaultMonitorState(): MonitorState {
  const state: MonitorState = {
    mode: MonitoringMode.NONE,
    isPlaying: false,
    staticVideoRef: undefined
  }

  return state
}
