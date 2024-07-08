import { SimulatorState } from "@aitube/clapper-services"

export function getDefaultSimulatorState(): SimulatorState {
  const state: SimulatorState = {
    isRunning: false,
  }
  return state
}