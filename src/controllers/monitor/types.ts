export enum MonitoringMode {
  NONE = "NONE",
  STATIC = "STATIC",
  DYNAMIC = "DYNAMIC"
}

export type MonitorState = {
  mode: MonitoringMode
  lastTimelineUpdateAtInMs: number
  isPlaying: boolean
  staticVideoRef?: HTMLVideoElement
}

export type MonitorControls = {
  setMonitoringMode: (mode: MonitoringMode) => void

  setStaticVideoRef: (staticVideoRef: HTMLVideoElement) => void

  checkIfPlaying: () => boolean
  /**
   *  Play/pause the project timeline (video and audio)
   * 
   * @param forcePlaying 
   * @returns 
   */
  togglePlayback: (forcePlaying?: boolean) => {
    wasPlaying: boolean
    isPlaying: boolean
  }

  /**
   * Seek to a specific timestamp
   * 
   * @param timeInMs 
   * @returns 
   */
  jumpAt: (timeInMs?: number) => void

  setLastTimelineUpdateAtInMs: (lastTimelineUpdateAtInMs: number) => void
}
export type MonitorStore = MonitorState & MonitorControls