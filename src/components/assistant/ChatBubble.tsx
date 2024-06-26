
import { ChatEvent } from "@aitube/clapper-services"
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
          isCurrentUser ? `bg-sky-800 text-sky-200` : `bg-indigo-800 text-indigo-200`,
          `rounded-lg`
        )}>
          <p className={cn(`text-sm select-text`)}>{message}</p>
        </div>
        <div className={cn(
          `text-sm select-text`,
          isCurrentUser ? ` text-sky-100/60` : `text-indigo-100/60`,
        )}>{senderName}</div>
      </div>
    </div>
  )
}