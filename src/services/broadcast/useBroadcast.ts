'use client'

import { create } from 'zustand'
import { BroadcastStore } from '@aitube/clapper-services'

import { getDefaultBroadcastState } from './getDefaultBroadcastState'

/**
 * Service to manage streaming
 *
 * Ideally this should be down on the client side, to keep the backend
 * able to scale to thousand of users
 *
 * Here are some useful pointers and discussions regarding client-side:
 * - https://github.com/ffmpegwasm/ffmpeg.wasm/issues/100
 * - https://github.com/Kagami/ffmpeg.js/pull/166
 * - https://github.com/davedoesdev/streamana
 */
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
