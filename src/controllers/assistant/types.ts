export type ChatEvent = {
  eventId: string
  senderId: string
  senderName: string
  roomId: string
  roomName: string
  sentAt: string
  message: string
  isCurrentUser: boolean
}

export type ChatHistory = ChatEvent[]


/**
 * Assistant 
 */
export type AssistantState = {
  isVoiceEnabled: boolean

  /**
   * The last transcript detected by the speech-to-text engine
   */
  transcript: string

  /**
   * the chat history
   */
  history: ChatHistory

  // those are used to stream the results to the backend
  stream?: MediaStream
  recorder?: MediaRecorder
  socket?: WebSocket
}
export type AssistantControls = {

  /**
   * Toggle the speech to text on or off
   * 
   * @returns true if operation succeeded, false otherwise
   */
  // toggleVoice: () => Promise<boolean>

  /**
   * Run a prompt command (which can come from a transcript or somewhere else)
   * 
   * This returns true in case of success (if something happened, and we don't need to do anything anymore)
   * @param prompt 
   * @returns 
   */
  runCommand: (prompt: string) => boolean

  /**
   * Add a chat event to the history
   * 
   * @param event 
   * @returns 
   */
  addEventToHistory: (event: Partial<ChatEvent>) => ChatEvent

  clearHistory: () => void

  processMessage: (input: string) => void
}

export type AssistantStore =
  AssistantState &
  AssistantControls
