export type SimulatorState = {
  isRunning: boolean
}

export type  SimulatorControls = {
  startLoop: () => void
  runLoop: () => Promise<void>

  togglePause: (isPaused?: boolean) => boolean
}

export type SimulatorStore = SimulatorState & SimulatorControls