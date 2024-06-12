import { AssistantRequest, AssistantResponse } from "@/types"

export async function askAssistant(request: AssistantRequest) {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request)
  })

  const response = (await res.json()) as AssistantResponse
  return response
}