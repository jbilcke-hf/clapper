"use client"

import { create } from "zustand"

import { getDefaultBroadcastState } from "./getDefaultBroadcastState"

import { BroadcastStore } from "./types"

export const useBroadcast = create<BroadcastStore>((set, get) => ({
  ...getDefaultBroadcastState(),

  /**
   * Toggles the broadcast on or off
   * @param forceValue 
   * @returns 
   */
  toggleBroadcast: (forceValue?: boolean) => {
    const { isBroadcasting: wasBroadcasting } = get()
    const isBroadcasting = typeof forceValue === "boolean"
      ? forceValue
      : !wasBroadcasting

    set({ isBroadcasting })
    return isBroadcasting
  },
}))

if (typeof window !== "undefined") {
  (window as any).useBroadcast = useBroadcast
}