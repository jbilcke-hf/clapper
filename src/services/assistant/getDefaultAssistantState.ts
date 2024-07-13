import { AssistantState } from "@aitube/clapper-services"

export function getDefaultAssistantState(): AssistantState {
  const state: AssistantState = {
    history: [],
  }

  return state
}
