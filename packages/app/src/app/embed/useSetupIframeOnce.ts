'use client'

import { useEffect } from 'react'

import { useMonitor } from '@/services'
import { useParentController } from './useParentController'

/**
 * You should only call this once, at the root of the react tree
 */
export function useSetupIframeOnce(isEnabled = false) {
  const canUseBellhop = useParentController((s) => s.canUseBellhop)
  const setCanUseBellhop = useParentController((s) => s.setCanUseBellhop)
  const hasLoadedBellhop = useParentController((s) => s.hasLoadedBellhop)
  const setHasLoadedBellhop = useParentController((s) => s.setHasLoadedBellhop)
  const onMessage = useParentController((s) => s.onMessage)
  const sendMessage = useParentController((s) => s.sendMessage)
  const isPlaying = useMonitor((s) => s.isPlaying)
  const togglePlayback = useMonitor((s) => s.togglePlayback)

  // TODO: maybe we should add a JWT token to secure this, make it only embeddable
  // on a certain website (eg. AiTube.at), and if people want to
  // embed the player somewhere's else they will have to deploy their own

  useEffect(() => {
    if (!isEnabled) {
      // when we are detecting that we are not in an iframe

      if (canUseBellhop) {
        setCanUseBellhop(false)
      }
      return
    }

    if (!canUseBellhop) {
      setCanUseBellhop(true)
    }

    if (hasLoadedBellhop) {
      // no need to connect twice
      // but we can update the "isPlaying" status
      sendMessage('status', { isPlaying })
      return
    } else {
      // we only try this once
      try {
        setHasLoadedBellhop(true)

        onMessage('togglePlayback', function (event) {
          const { isPlaying } = event.data as { isPlaying: boolean }
          togglePlayback(isPlaying)
        })

        onMessage('loadPrompt', function (event) {
          console.log('loadPrompt:', event)
          // generate the first scene of an OpenClap file from the prompt
        })

        onMessage('loadClap', function (event) {
          // we need to be careful here in how to transmit the ClapProject
          // to the iframe
          // we are going to want to encode it somehow, eg using:
          // function base64_encode(s) {
          //   return btoa(unescape(encodeURIComponent(s)));
          // }
          // function base64_decode(s) {
          //   return decodeURIComponent(escape(atob(s)));
          // }
        })

        sendMessage('status', { isReady: true })
      } catch (err) {
        console.error(`failed to initialize bellhop`)
        setHasLoadedBellhop(false)
        setCanUseBellhop(false)
      }
    }
  }, [
    canUseBellhop,
    isEnabled,
    hasLoadedBellhop,
    isPlaying,
    onMessage,
    sendMessage,
    setCanUseBellhop,
    setHasLoadedBellhop,
    togglePlayback,
  ])
}
