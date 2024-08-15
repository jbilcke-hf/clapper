'use client'

import { create } from 'zustand'

import { InputsStore } from './types'
import { getDefaultInputsState } from './getDefaultInputsState'

export const useInputs = create<InputsStore>((set, get) => ({
  ...getDefaultInputsState(),
  init: () => {
    const { scanGamepads } = get()

    window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
      console.log(
        'Gamepad connected, has index %d: %s',
        event.gamepad.index,
        event.gamepad.id
      )
      const { gamepads } = get()

      set({
        gamepads: {
          ...gamepads,
          [event.gamepad.index]: event.gamepad,
        },
      })
    })

    window.addEventListener('gamepaddisconnected', (event: GamepadEvent) => {
      console.log(
        'Gamepad disconnected, had index %d: %s',
        event.gamepad.index,
        event.gamepad.id
      )
      const { gamepads } = get()
      delete gamepads[event.gamepad.index]
      set({
        gamepads,
      })
    })

    function loop() {
      const hasGamepads = 'ongamepadconnected' in window
      set({ hasGamepads })

      if (!hasGamepads) {
        scanGamepads()
      }

      set({ animationFrame: requestAnimationFrame(loop) })
    }

    set({ animationFrame: requestAnimationFrame(loop) })
  },
  scanGamepads: () => {
    const nav = navigator as Navigator & {
      webkitGetGamepads?: () => Gamepad[]
    }
    set({
      gamepads: (nav.getGamepads
        ? nav.getGamepads()
        : nav.webkitGetGamepads
          ? nav.webkitGetGamepads()
          : []
      ).reduce(
        (acc, gamepad) => {
          if (gamepad && gamepad !== null) {
            return { ...acc, [gamepad.index]: gamepad }
          }
          return acc
        },
        {} as Record<number, Gamepad>
      ),
    })
  },
}))
