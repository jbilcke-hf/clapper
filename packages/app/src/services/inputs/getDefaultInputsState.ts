import { InputsState } from './types'

export function getDefaultInputsState(): InputsState {
  const state: InputsState = {
    hasGamepads: false,
    gamepads: {},
    animationFrame: 0,
  }

  return state
}
