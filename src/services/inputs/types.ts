export type InputsState = {
  hasGamepads: boolean
  gamepads: Record<number, Gamepad>
  animationFrame: number
}
export type InputsControls = {
  init: () => void
  scanGamepads: () => void
}
export type InputsStore = InputsState & InputsControls
