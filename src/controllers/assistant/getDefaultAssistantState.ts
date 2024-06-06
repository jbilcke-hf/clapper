import { AssistantState } from "./types"

export function getDefaultAssistantState(): AssistantState {
  const state: AssistantState = {
    isVoiceEnabled: false,
    transcript: "",

    history: [],
  }

  return state
}
