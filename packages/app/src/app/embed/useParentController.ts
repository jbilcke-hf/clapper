'use client'

import { create } from 'zustand'
import { Bellhop } from 'bellhop-iframe'

export const useParentController = create<{
  bellhop: Bellhop

  /**
   * Whether the communication pipeline seems to be working or not
   *
   * Initially we assume that it is, but this can be invalidated
   * if we know for certain it is not, or in case of exception
   */
  canUseBellhop: boolean

  /**
   * Whether Clapper is ready to receive instructions
   */
  hasLoadedBellhop: boolean

  setCanUseBellhop: (canUseBellhop: boolean) => void
  setHasLoadedBellhop: (hasLoadedBellhop: boolean) => void
  onMessage: (name: string, callback: Function, priority?: number) => void
  sendMessage: (type: string, data?: any) => void
}>((set, get) => ({
  bellhop: undefined as unknown as Bellhop,
  canUseBellhop: true,
  hasLoadedBellhop: false,
  setCanUseBellhop: (canUseBellhop: boolean) => {
    set({
      canUseBellhop,
    })
  },
  setHasLoadedBellhop: (hasLoadedBellhop: boolean) => {
    set({
      bellhop: hasLoadedBellhop
        ? new Bellhop()
        : (undefined as unknown as Bellhop),
      hasLoadedBellhop,
    })
  },
  onMessage: (name: string, callback: Function, priority?: number) => {
    const { bellhop } = get()
    try {
      bellhop.on(name, callback, priority)
    } catch (err) {
      console.log(`failed to subscribe to parent iframe messages:`, err)
    }
  },
  sendMessage: (type: string, data?: any) => {
    const { bellhop } = get()
    try {
      bellhop.send(type, data)
    } catch (err) {
      console.log(`failed to send a message to parent iframe:`, err)
    }
  },
}))
