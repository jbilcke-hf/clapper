import { ClapSegment } from "@aitube/clap"

export type ResolverState = {
  // this indicate the status of the loop
  // normally once it is running it is never stopped,
  // since this is used to check if we have pending tasks
  isRunning: boolean

  // used to "pause" the resolution
  // request have have already be sent to the API providers
  // will still be honored, which is why the number of pending
  // requests won't drop to 0 immediately
  isPaused: boolean

  defaultParallelismQuotas: {
    video: number
    image: number
    voice: number
    sound: number
    music: number
  }

  // used for UI display, show some metrics
  currentParallelismQuotaForVideo: number
  currentParallelismQuotaForImage: number
  currentParallelismQuotaForVoice: number
  currentParallelismQuotaForSound: number
  currentParallelismQuotaForMusic: number

  // just some aliases for convenience,
  // used for UI display, show some metrics
  nbPendingRequestsForVideo: number
  nbPendingRequestsForImage: number
  nbPendingRequestsForVoice: number
  nbPendingRequestsForSound: number
  nbPendingRequestsForMusic: number
  nbRequestsRunningInParallel: number
  isBusyResolving: boolean
}

export type ResolverControls = {
  startLoop: () => void
  runLoop: () => Promise<void>

  togglePause: (isPaused?: boolean) => boolean

    /**
   * This resolve a segment
   * 
   * Note: while we return a clap segment, the original will be replaced, too
   * 
   * @param segment 
   * @returns 
   */
  resolveSegment: (segment: ClapSegment) => Promise<ClapSegment>
}

export type ResolverStore = ResolverState & ResolverControls