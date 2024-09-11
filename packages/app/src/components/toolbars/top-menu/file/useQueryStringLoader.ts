'use client'

import { useEffect } from 'react'

import { useQueryStringParams } from '@/lib/hooks'
import { useAssistant, useIO } from '@/services'

export function useQueryStringLoader() {
  const { fileUrl, startAt, interactive, prompt, imageStrategy } =
    useQueryStringParams({
      // clapUrl: `/samples/test.clap`,
      // clapUrl: `/samples/Afterglow%20v10%20X%20Rewrite%20Bryan%20E.%20Harris%202023.clap`,
    })

  const processUserMessage = useAssistant((s) => s.processUserMessage)
  const openClapUrl = useIO((s) => s.openClapUrl)
  const openScreenplayUrl = useIO((s) => s.openScreenplayUrl)
  useEffect(() => {
    ;(async () => {
      if (prompt.length > 2) {
        const message = `please create the first scene's segments of a new story, based on this simple pitch (you can expand it): ${prompt}`

        console.log('initializing using message', prompt)
        processUserMessage(message)
      } else if (fileUrl) {
        console.log(`loading ${fileUrl}`)
        if (fileUrl.toLocaleLowerCase().includes('.clap')) {
          console.log(`loading clap file`)
          await openClapUrl(fileUrl)
        } else {
          console.log(`loading screenplay file`)
          await openScreenplayUrl(fileUrl)
        }
      } else {
        console.log('No clap URL provided')
        return
      }
    })()
  }, [
    prompt,
    openClapUrl,
    openScreenplayUrl,
    processUserMessage,
    fileUrl,
    interactive,
    imageStrategy,
  ])
}
