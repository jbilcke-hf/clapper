import { ClapSegment } from "@aitube/clap"

export type ResolverState = {
  isRunning: boolean

  defaultParallelismQuotas: {
    video: number
    image: number
    voice: number
    sound: number
    music: number
  }

  // used for UI display, show some metrics
  currentParallelismQuotas: {
    video: number
    image: number
    voice: number
    sound: number
    music: number
  }

  // used for UI display, show some metrics
  nbRequestsRunningInParallel: number
}

export type ResolverControls = {
  startLoop: () => void
  runLoop: () => Promise<void>

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