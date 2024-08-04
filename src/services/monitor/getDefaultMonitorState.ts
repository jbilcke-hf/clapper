import { MonitorState } from '@aitube/clapper-services'

export function getDefaultMonitorState(): MonitorState {
  const state: MonitorState = {
    shortcutsAreBound: false,
    lastTimelineUpdateAtInMs: 0,
    isPlaying: false,
    staticVideoRef: undefined,
  }

  return state
}
