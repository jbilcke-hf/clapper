'use client'

import { create } from 'zustand'
import { BroadcastStore } from '@aitube/clapper-services'

import { getDefaultBroadcastState } from './getDefaultBroadcastState'

export const useBroadcast = create<BroadcastStore>((set, get) => ({
  ...getDefaultBroadcastState(),

  /**
   * Toggles the broadcast on or off
   * @param forceValue
   * @returns
   */
  toggleBroadcast: (forceValue?: boolean) => {
    const { isBroadcasting: wasBroadcasting } = get()
    const isBroadcasting =
      typeof forceValue === 'boolean' ? forceValue : !wasBroadcasting

    set({ isBroadcasting })
    return isBroadcasting
  },
}))
