import { AssistantState } from "@aitube/clapper-services"

export function getDefaultAssistantState(): AssistantState {
  const state: AssistantState = {
    isVoiceEnabled: false,
    transcript: "",

    history: [],
  }

  return state
}
