
export type BroadcastState = {
  isBroadcasting: boolean
}

export type BroadcastControls = {
  /**
   * Toggles the broadcast on or off
   * @param forceValue 
   * @returns 
   */
  toggleBroadcast: (forceValue?: boolean) => boolean
}

export type BroadcastStore = BroadcastState & BroadcastControls