import { ClapWorkflow, ClapWorkflowEngine } from '@aitube/clap'

import { ReactWorkflow } from './types'
import { glifToReactWorkflow } from './formats/glif/glifToReactWorkflow'

export function clapWorkflowToReactWorkflow(
  clapWorkflow: ClapWorkflow
): ReactWorkflow {
  if (clapWorkflow.engine === ClapWorkflowEngine.GLIF_WORKFLOW) {
    return glifToReactWorkflow(JSON.parse(clapWorkflow.data))
  }
  return { nodes: [], edges: [] }
}
