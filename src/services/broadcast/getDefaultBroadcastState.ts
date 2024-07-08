import { BroadcastState } from "@aitube/clapper-services"

export function getDefaultBroadcastState(): BroadcastState {
  const state: BroadcastState = {
    isBroadcasting: false,
  }
  return state
}