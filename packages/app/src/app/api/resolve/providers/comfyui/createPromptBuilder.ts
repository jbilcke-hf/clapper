import { PromptBuilder } from '@saintno/comfyui-sdk'

import { ClapperComfyUiInputIds } from './types'
import { ComfyUIWorkflowApiGraph } from './graph'

/**
 * Takes a workflow graph and converts it to PromptBuilder
 */
export function createPromptBuilder(
  workflowApiGraph: ComfyUIWorkflowApiGraph
): PromptBuilder<any, any, any> {
  const inputs = workflowApiGraph.getInputs()
  const outputNode = workflowApiGraph.getOutputNode()

  const inputKeys = Object.values(inputs)
    .map((input) => input.id)
    .concat([
      ClapperComfyUiInputIds.PROMPT,
      ClapperComfyUiInputIds.NEGATIVE_PROMPT,
      ClapperComfyUiInputIds.WIDTH,
      ClapperComfyUiInputIds.HEIGHT,
      ClapperComfyUiInputIds.SEED,
    ])

  const promptBuilder = new PromptBuilder(
    workflowApiGraph.toJson(),
    inputKeys,
    [ClapperComfyUiInputIds.OUTPUT]
  )

  // We don't need proper names for input keys,
  // as we just use PromptBuilder for its websocket api
  inputKeys.forEach((inputKey) => {
    promptBuilder.setInputNode(inputKey, inputKey)
  })

  if (outputNode) {
    promptBuilder.setOutputNode(ClapperComfyUiInputIds.OUTPUT, outputNode.id)
  }

  return promptBuilder
}
