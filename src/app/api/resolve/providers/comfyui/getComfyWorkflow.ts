import { ClapSegmentCategory } from '@aitube/clap'
import { getVideoPrompt } from '@aitube/engine'

import { ComfyNode, ResolveRequest } from '@aitube/clapper-services'

// TODO move this to @aitube/engine or @aitube/engine-comfy
export function getComfyWorkflow(request: ResolveRequest) {
  let comfyWorkflow = '{}'

  if (request.segment.category === ClapSegmentCategory.STORYBOARD) {
    comfyWorkflow = request.settings.comfyWorkflowForImage
  } else if (request.segment.category === ClapSegmentCategory.VIDEO) {
    comfyWorkflow = request.settings.comfyWorkflowForVideo
  }

  // parse the node array from the ComfyUI workflow
  const nodes = Object.values(JSON.parse(comfyWorkflow)) as ComfyNode[]

  const visualPrompt = getVideoPrompt(request.segments, request.entities)

  const output: Record<string, ComfyNode> = {}

  nodes.forEach((node, i) => {
    if (typeof node.inputs.text === 'string') {
      if (node._meta.title.includes('Prompt')) {
        node.inputs.text = visualPrompt
      }
    }
    output[`${i}`] = node
  })

  return JSON.stringify(output)
}
