import { ClapSegmentCategory } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"

import { ComfyNode, RenderRequest } from "@/types"

// TODO move this to @aitube/engine or @aitube/engine-comfy
export function getComfyWorkflow(request: RenderRequest) {

  let comfyWorkflow = "{}"

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
    comfyWorkflow = request.storyboardWorkflow
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    comfyWorkflow = request.videoWorkflow
  }

  // parse the node array from the ComfyUI workflow
  const nodes = Object.values(JSON.parse(comfyWorkflow)) as ComfyNode[]

  const visualPrompt = getVideoPrompt(
    request.segments,
    request.entities
  )

  for (const node of nodes) {
    if (typeof node.inputs.text === "string") {
      if (node._meta.title.includes("Prompt")) {
        node.inputs.text = visualPrompt
      }
    }
  }

  return JSON.stringify(nodes)
}