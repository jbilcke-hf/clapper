import { BroadcastState } from "./types"

export function getDefaultBroadcastState(): BroadcastState {
  const state: BroadcastState = {
    isBroadcasting: false,
  }
  return state
}