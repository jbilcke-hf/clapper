'use client'

import React, {
  useState,
  useLayoutEffect,
  useRef,
  MutableRefObject,
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
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined'
      ? Boolean(
          (document as FullscreenElement)[getBrowserFullscreenElementProp()]
        )
      : false
  )

  const setFullscreen = (maybeValue?: boolean) => {
    if (!elRef.current) return

    const isFullScreen =
      typeof document !== 'undefined'
        ? Boolean(
            (document as FullscreenElement)[getBrowserFullscreenElementProp()]
          )
        : false

    const shouldBeFullScreen =
      typeof maybeValue === 'boolean' ? maybeValue : !isFullScreen

    // nothing to do
    if (isFullScreen === shouldBeFullScreen) {
      return
    }

    const operation = shouldBeFullScreen
      ? elRef.current.requestFullscreen()
      : typeof document !== 'undefined'
        ? document.exitFullscreen()
        : Promise.resolve(true)

    operation
      .then(() => {
        setIsFullscreen(shouldBeFullScreen)
      })
      .catch(() => {
        if (typeof document !== 'undefined') {
          // make sure we grab a fresh value here
          const isFullScreen = Boolean(
            (document as FullscreenElement)[getBrowserFullscreenElementProp()]
          )
          setIsFullscreen(isFullScreen)
        }
      })
  }

  useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      document.onfullscreenchange = () =>
        setIsFullscreen(
          Boolean(
            (document as FullscreenElement)[getBrowserFullscreenElementProp()]
          )
        )

      return () => {
        document.onfullscreenchange = null
      }
    }
  }, [])

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
