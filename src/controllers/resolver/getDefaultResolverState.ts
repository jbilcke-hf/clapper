import { ResolverState } from "./types"

export function getDefaultResolverState(): ResolverState {
  const state: ResolverState = {
    isRunning: false,
    isPaused: false,

    defaultParallelismQuotas: {
      video: 1,
      image: 1,
      voice: 1,
      sound: 1,
      music: 1,
    },
  
    // used for UI display, show some metrics
    currentParallelismQuotaForVideo: 1,
    currentParallelismQuotaForImage: 1,
    currentParallelismQuotaForVoice: 1,
    currentParallelismQuotaForSound: 1,
    currentParallelismQuotaForMusic: 1,
    
    // just some aliases for convenience
    nbPendingRequestsForVideo: 0,
    nbPendingRequestsForImage: 0,
    nbPendingRequestsForVoice: 0,
    nbPendingRequestsForSound: 0,
    nbPendingRequestsForMusic: 0,

    nbRequestsRunningInParallel: 0,

    isBusyResolving: false,
  }
  return state
}