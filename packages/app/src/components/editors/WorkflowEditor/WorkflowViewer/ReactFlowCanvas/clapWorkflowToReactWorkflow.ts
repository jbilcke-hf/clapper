import { ClapWorkflow, ClapWorkflowEngine } from '@aitube/clap'

import { ReactWorkflow } from './types'
import { glifToReactWorkflow } from './formats/glif/glifToReactWorkflow'
import { comfyUiToReactWorkflow } from './formats/comfyui/comfyUiToReactWorkflow'

export function clapWorkflowToReactWorkflow(
  clapWorkflow?: ClapWorkflow
): ReactWorkflow {
  if (!clapWorkflow || !clapWorkflow.data) {
    return { nodes: [], edges: [] }
  }
  if (clapWorkflow.engine === ClapWorkflowEngine.GLIF_WORKFLOW) {
    return glifToReactWorkflow(JSON.parse(clapWorkflow.data))
  }
  if (clapWorkflow.engine === ClapWorkflowEngine.COMFYUI_WORKFLOW) {
    return comfyUiToReactWorkflow(clapWorkflow.data)
  }
  return { nodes: [], edges: [] }
}
