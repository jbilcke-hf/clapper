export type MonitorState = {
  shortcutsAreBound: boolean
  lastTimelineUpdateAtInMs: number
  isPlaying: boolean
  staticVideoRef?: HTMLVideoElement
  isEmbedded: boolean
}

export type MonitorControls = {
  bindShortcuts: () => void

  setStaticVideoRef: (staticVideoRef: HTMLVideoElement) => void

  setIsEmbedded: (isEmbedded: boolean) => void
  
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