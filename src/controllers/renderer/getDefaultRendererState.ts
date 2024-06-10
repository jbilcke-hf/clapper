import { getDefaultBufferedSegments } from "./getDefaultBufferedSegments"
import { RendererState } from "./types"

export function getDefaultRendererState(): RendererState {
  const state: RendererState = {
    bufferedSegments: getDefaultBufferedSegments(),

    // put more stuff here
  }
  return state
}
