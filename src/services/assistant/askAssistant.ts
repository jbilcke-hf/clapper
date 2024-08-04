import { AssistantRequest, AssistantMessage } from '@aitube/clapper-services'

export async function askAssistant(request: AssistantRequest) {
  return (await (
    await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
  ).json()) as AssistantMessage
}
