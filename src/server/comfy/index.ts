"use server"

import { RenderRequest } from "@/types"

import { run as runWithReplicate } from "./replicate"
import { run as runWithHuggingFace } from "./huggingface"
import { formatStoryboardWorkflow } from "./formatStoryboardWorkflow"

export async function run(request: RenderRequest): Promise<string> {

  const workflow = formatStoryboardWorkflow(request)

  // TODO support Hugging Face as well
  // const await runWithHuggingFace({
  const result = await runWithReplicate({
    apiKey: request.comfyApiKey,
    workflow,
  })

  return result
}