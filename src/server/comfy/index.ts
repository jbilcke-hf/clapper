"use server"

import { RenderRequest } from "@/types"

import { run as runWithReplicate } from "./replicate"
import { run as runWithHuggingFace } from "./huggingface"
import { getComfyWorkflow } from "./getComfyWorkflow"

// TODO: at some point in the future we will 
// move src/server/comfy to @aitube/engine
export async function render(request: RenderRequest): Promise<string> {

  const workflow = getComfyWorkflow(request)

  // TODO support Hugging Face as well
  // const await runWithHuggingFace({

  const result = await runWithReplicate({
    apiKey: request.comfyUiApiKey,
    workflow,
  })

  return result
}