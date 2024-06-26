"use client"

import { useState, useTransition } from "react"

import { useAssistant } from "@/services/assistant/useAssistant"

import { ChatBubble } from "./ChatBubble"
import { Input } from "../ui/input"
import { useTheme } from "@/services/ui/useTheme"

export function ChatView() {
  const [_isPending, startTransition] = useTransition()
  const theme = useTheme()
  
  const [draft, setDraft] = useState("")
  const history = useAssistant((s) => s.history)
  const processMessage = useAssistant((s) => s.processMessage)

  const handleSubmit = () => {
    const message = draft.trim()

    if (!message) {
      return
    }

    setDraft("")
    processMessage(draft.trim())
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center pt-8"
      style={{
        background: theme.assistantBgColor || theme.defaultBgColor || ""
      }}>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-grow overflow-y-scroll">
          <div className="flex flex-col space-y-6 p-2 w-full">
            {history.map(event => (
                <ChatBubble
                  key={event.eventId}
                  {...event}
                />
            ))}
          </div>
        </div>
        <div>
          <Input
            placeholder="Ask something (a red car, etc)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
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
