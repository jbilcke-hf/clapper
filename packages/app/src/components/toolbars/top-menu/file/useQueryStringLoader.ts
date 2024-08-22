'use client'

import { useEffect } from 'react'

import { useQueryStringParams } from '@/lib/hooks'
import { useIO } from '@/services'

export function useQueryStringLoader() {
  const { clapUrl } = useQueryStringParams({
    // clapUrl: `/samples/test.clap`,
    // clapUrl: `/samples/Afterglow%20v10%20X%20Rewrite%20Bryan%20E.%20Harris%202023.clap`,
    clapUrl: '',
  })
  const openClapUrl = useIO((s) => s.openClapUrl)

  useEffect(() => {
    ;(async () => {
      if (!clapUrl) {
        console.log('No clap URL provided')
        return
      }
      await openClapUrl(clapUrl)
    })()
  }, [openClapUrl, clapUrl])

}