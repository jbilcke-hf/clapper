import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatEvent } from '@aitube/clapper-services'

import { cn } from '@/lib/utils'
import { useTheme } from '@/services'

export function ChatBubble({
  eventId,
  senderId,
  senderName,
  roomId,
  roomName,
  sentAt,
  isCurrentUser,
  message,
}: ChatEvent) {
  const theme = useTheme()
  return (
    <div
      className={cn(`flex`, isCurrentUser ? `justify-end` : `justify-start`)}
    >
      <div
        className={cn(
          `flex flex-col space-y-2`,
          isCurrentUser ? `items-end` : `items-start`
        )}
      >
        <div
          className={cn(
            `flex flex-col p-4`,
            `rounded-lg`,
            `text-sm select-text`
          )}
          style={{
            background: isCurrentUser
              ? theme.assistantUserBgColor || theme.defaultBgColor || ''
              : theme.assistantRobotBgColor || theme.defaultPrimaryColor || '',
            color: isCurrentUser
              ? theme.assistantUserTextColor || theme.defaultTextColor || ''
              : theme.assistantRobotTextColor || theme.defaultTextColor || '',
          }}
        >
          <Markdown remarkPlugins={[remarkGfm]}>{message}</Markdown>
        </div>
        <div
          className={cn(
            `text-sm select-text`,
            isCurrentUser ? `text-sky-100/60` : `text-indigo-100/60`
          )}
        >
          {senderName}
        </div>
      </div>
    </div>
  )
}
