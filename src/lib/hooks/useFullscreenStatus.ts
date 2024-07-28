'use client'

import React, {
  useState,
  useLayoutEffect,
  useRef,
  MutableRefObject,
  useCallback,
} from 'react'

interface FullscreenElement {
  fullscreenElement?: Element
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
  webkitFullscreenElement?: Element
}

declare global {
  interface Document extends FullscreenElement {}
}

export function useFullscreenStatus(): [
  boolean,
  (requestedValue?: boolean) => void,
  MutableRefObject<Element | null>,
] {
  const elRef = useRef<Element | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const getFullscreenStatus = useCallback(() => {
    return typeof document !== 'undefined'
      ? Boolean(
          (document as FullscreenElement)[getBrowserFullscreenElementProp()]
        )
      : false
  }, [])

  const updateFullscreenStatus = useCallback(() => {
    setIsFullscreen(getFullscreenStatus())
  }, [getFullscreenStatus])

  const setFullscreen = useCallback(
    (maybeValue?: boolean) => {
      if (!elRef.current) return

      const isFullScreen = getFullscreenStatus()
      const shouldBeFullScreen =
        typeof maybeValue === 'boolean' ? maybeValue : !isFullScreen

      if (isFullScreen === shouldBeFullScreen) {
        return
      }

      const operation = shouldBeFullScreen
        ? elRef.current.requestFullscreen()
        : typeof document !== 'undefined'
          ? document.exitFullscreen()
          : Promise.resolve(true)

      operation.then(updateFullscreenStatus).catch(updateFullscreenStatus)
    },
    [getFullscreenStatus, updateFullscreenStatus]
  )

  useLayoutEffect(() => {
    updateFullscreenStatus()

    const fullscreenChangeHandler = () => {
      updateFullscreenStatus()
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', fullscreenChangeHandler)

      // Polling mechanism
      const intervalId = setInterval(updateFullscreenStatus, 100)

      return () => {
        document.removeEventListener(
          'fullscreenchange',
          fullscreenChangeHandler
        )
        clearInterval(intervalId)
      }
    }
  }, [updateFullscreenStatus])

  return [isFullscreen, setFullscreen, elRef]
}

function getBrowserFullscreenElementProp(): keyof FullscreenElement {
  if (typeof document.fullscreenElement !== 'undefined') {
    return 'fullscreenElement'
  } else if (typeof document.mozFullScreenElement !== 'undefined') {
    return 'mozFullScreenElement'
  } else if (typeof document.msFullscreenElement !== 'undefined') {
    return 'msFullscreenElement'
  } else if (typeof document.webkitFullscreenElement !== 'undefined') {
    return 'webkitFullscreenElement'
  } else {
    throw new Error('fullscreenElement is not supported by this browser')
  }
}
