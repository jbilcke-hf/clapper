import { getVideoPrompt } from "@aitube/engine"

import { ComfyNode, RenderRequest } from "@/types"

export function formatStoryboardWorkflow(request: RenderRequest) {
  // parse the node array from the ComfyUI workflow
  const nodes = Object.values(JSON.parse(request.comfyWorkflow)) as ComfyNode[]

  const storyboardPrompt = getVideoPrompt(
    request.segments,
    request.entities
  )

  for (const node of nodes) {
    if (typeof node.inputs.text === "string") {
      if (node._meta.title.includes("Prompt")) {
        node.inputs.text = storyboardPrompt
      }
    }
  }

  return JSON.stringify(nodes)
}