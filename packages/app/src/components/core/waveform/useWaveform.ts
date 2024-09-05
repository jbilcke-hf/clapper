'use client'

import { useLayoutEffect, useState } from 'react'

import { useDebounce } from '@/lib/hooks'

import { WaveformRenderingMode } from './types'

// global cache definition
const cache: Record<string, ImageData> = {}

/**
 * This component renders a waveform for the given audio buffer
 *
 * @param { string } id - Unique id
 * @param { AudioBuffer } audioBuffer - Audio buffer for the waveform
 * @param { number } width - The width of the canvas
 * @param { number } height - The height of the canvas
 * @param { number } zoom - The zoom level of the waveform
 * @param { string } color - The color of the waveform
 * @param { WaveformRenderingMode } mode - The rendering mode (mono or stereo)
 * @param { Function } onDone - Callback function to call when done
 * @param { number } gain - Additional gain to increase the visibility
 */
export function useWaveform({
  id,
  audioBuffer,
  width = 500,
  height = 100,
  zoom = 1,
  color = '#000000',
  mode = WaveformRenderingMode.MONO,
  onDone,
  gain = 1.2,
}: {
  id: string
  audioBuffer: AudioBuffer
  width: number
  height: number
  zoom?: number
  color?: string
  mode?: WaveformRenderingMode
  onDone?: () => void
  gain?: number
}): {
  canvas: HTMLCanvasElement
  canvasRenderingContext: CanvasRenderingContext2D
  width: number
  height: number
  error: boolean
} {
  const [canvas, setCanvas] = useState(document.createElement('canvas'))
  const [canvasRenderingContext, setCanvasRenderingContext] = useState(
    canvas.getContext('2d') as CanvasRenderingContext2D
  )

  const error =
    !canvas ||
    !canvasRenderingContext ||
    !isFinite(width) ||
    isNaN(width) ||
    !isFinite(height) ||
    isNaN(height)

  const cacheKey = `${id}:${width}:${height}:${zoom}:${color}:${gain}`

  const debounceSize = useDebounce(cacheKey, 300)

  useLayoutEffect(() => {
    if (error) {
      return
    }

    const cachedImage = cache[cacheKey]

    // console.log(`redraw() for cache key "${cacheKey}"`)
    if (canvasRenderingContext) {
      if (cachedImage) {
        // console.log('redraw() we have a cached image:', cachedImage)
        // If we have cached data
        canvasRenderingContext.putImageData(cachedImage, 0, 0)
      } else {
        // console.log('redraw() no cached image')
        const middle = mode === WaveformRenderingMode.MONO ? height : height / 2
        const channelData = audioBuffer.getChannelData(0)
        const step = Math.ceil(channelData.length / (width * zoom))
        canvasRenderingContext.fillStyle = color

        for (let i = 0; i < width; i += 1) {
          let min = 1.0
          let max = -1.0

          for (let j = 0; j < step; j += 1) {
            const datum = channelData[i * step + j]

            if (datum < min) {
              min = datum
            } else if (datum > max) {
              max = datum
            }

            canvasRenderingContext.fillRect(
              i,
              (1 + min * gain) * middle,
              1,
              Math.max(1, (max - min * gain) * middle)
            )
          }
        }

        // cache the drawn data
        const imgData = canvasRenderingContext.getImageData(
          0,
          0,
          width * zoom,
          height
        )
        cache[cacheKey] = imgData
      }

      onDone?.()
    } else {
      console.error('redraw(): no canvasRenderingContext')
    }
  }, [
    id,
    debounceSize,
    zoom,
    color,
    onDone,
    gain,
    error,
    height,
    width,
    mode,
    cacheKey,
  ])

  return {
    canvas,
    canvasRenderingContext,
    width: width * zoom,
    height: height,
    error,
  }
}
