import { ChatEvent, ChatHistory } from "./base-types"

/**
 * Assistant 
 */
export type AssistantState = {
  /**
   * the chat history
   */
  history: ChatHistory
}
export type AssistantControls = {
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
