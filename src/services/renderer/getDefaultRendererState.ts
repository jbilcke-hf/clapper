import { RendererState } from "@aitube/clapper-services"

import { getDefaultBufferedSegments } from "./getDefaultBufferedSegments"

export function getDefaultRendererState(): RendererState {
  const state: RendererState = {
    bufferedSegments: getDefaultBufferedSegments(),

    dataUriBuffer1: undefined,
    dataUriBuffer2: undefined,
    activeBufferNumber: 1,
    currentSegment: undefined,
    preloadSegment: undefined,
    currentSegmentKey: "",
    preloadSegmentKey: "",
    dataUriBuffer1Key: "",
    dataUriBuffer2Key: "",
  }
  return state
}
