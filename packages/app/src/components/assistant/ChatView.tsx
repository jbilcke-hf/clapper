'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatEventVisibility } from '@aitube/clapper-services'

import { useAssistant, useTheme } from '@/services'

import { ChatBubble } from './ChatBubble'
import { Input } from '../ui/input'

export function ChatView() {
  const theme = useTheme()

  const [draft, setDraft] = useState('')
  const history = useAssistant((s) => s.history)
  const processUserMessage = useAssistant((s) => s.processUserMessage)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  const handleSubmit = () => {
    const message = draft.trim()

    if (!message) {
      return
    }

    setDraft('')
    processUserMessage(message)
  }

  const visibleHistory = history.filter(
    (event) => event.visibility !== ChatEventVisibility.TO_ASSISTANT_ONLY
  )

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [visibleHistory])

  return (
    <div
      className="flex h-full w-full items-center justify-center pt-8"
      style={{
        background: theme.assistantBgColor || theme.defaultBgColor || '',
      }}
    >
      <div className="flex h-full w-full flex-col">
        <div
          ref={chatContainerRef}
          className="flex flex-grow overflow-y-scroll"
        >
          <div className="flex w-full flex-col space-y-6 p-2">
            {visibleHistory.map((event) => (
              <ChatBubble key={event.eventId} {...event} />
            ))}
          </div>
        </div>
        <div>
          <Input
            placeholder="Ask something (a red car, etc)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="rounded-none border-t border-none"
            onKeyDown={({ key }) => {
              if (key === 'Enter') {
                handleSubmit()
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
