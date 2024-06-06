
import { ChatEvent } from "@/controllers/assistant/types"
import { cn } from "@/lib/utils"

export function ChatBubble({
  eventId,
  senderId,
  senderName,
  roomId,
  roomName,
  sentAt,
  isCurrentUser,
  message
}: ChatEvent) {
  return (
    <div className={cn(
      `flex`,
      isCurrentUser ? ` justify-end` : ` justify-start`,
    )}>
      <div className={cn(
        `flex flex-col space-y-2`,
        isCurrentUser ? ` items-end` : ` items-start`,
        )}>
        <div className={cn(
          `flex flex-col p-4`,
          isCurrentUser ? `bg-sky-700/60 text-sky-100/80` : `bg-indigo-700/60 text-indigo-100/80`,
          `rounded-lg`
        )}>
          <p>{message}</p>
        </div>
        <div className={cn(
          `text-sm`,
          isCurrentUser ? ` text-sky-100/60` : `text-indigo-100/60`,
        )}>{senderName}</div>
      </div>
    </div>
  )
}