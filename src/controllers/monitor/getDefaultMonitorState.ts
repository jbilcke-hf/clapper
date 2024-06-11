import { MonitoringMode, MonitorState } from "./types"

export function getDefaultMonitorState(): MonitorState {
  const state: MonitorState = {
    shortcutsAreBound: false,
    mode: MonitoringMode.NONE,
    lastTimelineUpdateAtInMs: 0,
    isPlaying: false,
    staticVideoRef: undefined
  }

  return state
}
