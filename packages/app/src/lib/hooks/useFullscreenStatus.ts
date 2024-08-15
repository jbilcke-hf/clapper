'use client'

import React, {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useCallback,
} from 'react'

interface FullscreenElement {
  fullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitFullscreenElement?: Element | null
}

declare global {
  interface Document extends FullscreenElement {}
}

export function useFullscreenStatus(): [
  boolean,
  (requestedValue?: boolean) => Promise<void>,
  MutableRefObject<Element | null>,
] {
  const elRef = useRef<Element | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const getFullscreenElement = useCallback((): Element | null => {
    if (typeof document === 'undefined') return null
    const fullscreenProp = getBrowserFullscreenElementProp()
    return document[fullscreenProp] || null
  }, [])

  const updateFullscreenStatus = useCallback(() => {
    const fullscreenElement = getFullscreenElement()
    setIsFullscreen(
      !!elRef.current &&
        !!fullscreenElement &&
        fullscreenElement === elRef.current
    )
  }, [getFullscreenElement])

  const setFullscreen = useCallback(
    async (requestedValue?: boolean) => {
      if (!elRef.current) return

      const isCurrentlyFullscreen = getFullscreenElement() === elRef.current
      const shouldBeFullScreen = requestedValue ?? !isCurrentlyFullscreen

      if (isCurrentlyFullscreen === shouldBeFullScreen) return

      try {
        if (shouldBeFullScreen) {
          await elRef.current.requestFullscreen()
        } else if (document.fullscreenElement) {
          await document.exitFullscreen()
        }
      } catch (error) {
        console.error('Fullscreen error:', error)
      }

      // Wait for the next frame before updating status
      requestAnimationFrame(updateFullscreenStatus)
    },
    [getFullscreenElement, updateFullscreenStatus]
  )

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      requestAnimationFrame(updateFullscreenStatus)
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', fullscreenChangeHandler)

      // Initial status update
      updateFullscreenStatus()

      return () => {
        document.removeEventListener(
          'fullscreenchange',
          fullscreenChangeHandler
        )
      }
    }
  }, [updateFullscreenStatus])

  return [isFullscreen, setFullscreen, elRef]
}

function getBrowserFullscreenElementProp(): keyof FullscreenElement {
  if (typeof document === 'undefined') return 'fullscreenElement'

  const props: (keyof FullscreenElement)[] = [
    'fullscreenElement',
    'mozFullScreenElement',
    'msFullscreenElement',
    'webkitFullscreenElement',
  ]

  for (const prop of props) {
    if (prop in document) {
      return prop
    }
  }

  return 'fullscreenElement'
}
