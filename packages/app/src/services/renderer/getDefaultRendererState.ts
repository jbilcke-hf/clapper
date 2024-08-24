import { RenderingStrategy } from '@aitube/timeline'

import {
  RendererState,
  RenderingBufferSizes,
  RenderingStrategies,
} from '@aitube/clapper-services'

import { getDefaultBufferedSegments } from './getDefaultBufferedSegments'

export function getDefaultRendererState(): RendererState {
  const renderingStrategies: RenderingStrategies = {
    imageRenderingStrategy: RenderingStrategy.BUFFERED_PLAYBACK_STREAMING,
    videoRenderingStrategy: RenderingStrategy.BUFFERED_PLAYBACK_STREAMING,
    soundRenderingStrategy: RenderingStrategy.BUFFERED_PLAYBACK_STREAMING,
    voiceRenderingStrategy: RenderingStrategy.BUFFERED_PLAYBACK_STREAMING,
    musicRenderingStrategy: RenderingStrategy.BUFFERED_PLAYBACK_STREAMING,
  }

  /**
   * Tells how many segments should be renderer in advanced during playback, for each segment category
   */
  const bufferSizes: RenderingBufferSizes = {
    imageBufferSize: 32,
    videoBufferSize: 32,
    soundBufferSize: 32,
    voiceBufferSize: 32,
    musicBufferSize: 8, // music segments are longer, so no need to generate that many
  }

  const state: RendererState = {
    ...bufferSizes,

    ...renderingStrategies,

    bufferedSegments: getDefaultBufferedSegments(),

    dataUriBuffer1: undefined,
    dataUriBuffer2: undefined,
    activeBufferNumber: 1,
    currentSegment: undefined,
    preloadSegment: undefined,
    currentSegmentKey: '',
    preloadSegmentKey: '',
    dataUriBuffer1Key: '',
    dataUriBuffer2Key: '',
  }
  return state
}
