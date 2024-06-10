import { ResolverState } from "./types"

export function getDefaultResolverState(): ResolverState {
  const state: ResolverState = {
    isRunning: false,

    defaultParallelismQuotas: {
      video: 1,
      image: 1,
      voice: 1,
      sound: 1,
      music: 1,
    },
  
    currentParallelismQuotas: {
      video: 1,
      image: 1,
      voice: 1,
      sound: 1,
      music: 1,
    },
    
    nbRequestsRunningInParallel: 0
  }
  return state
}