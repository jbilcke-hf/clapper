import { NextResponse, NextRequest } from "next/server"

import { AssistantRequest, AssistantResponse } from "@aitube/clapper-services"
import { askAnyAssistant } from "./askAnyAssistant"

export async function POST(req: NextRequest) {
  // do we really need to secure it?
  // I mean.. in the end, the user is using their own credentials,
  // so they cannot siphon free OpenAI, HF, Replicate tokens
  // console.log(`TODO Julian: secure the endpoint`)
  // await throwIfInvalidToken(req.headers.get("Authorization"))
  const request = (await req.json()) as AssistantRequest

  const response: AssistantResponse = await askAnyAssistant(request)

  return NextResponse.json(response)
}
