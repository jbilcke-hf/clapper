import { WorkflowEditorState } from '@aitube/clapper-services'

import { staticWorkflows } from './workflows'

export function getDefaultWorkflowEditorState(): WorkflowEditorState {
  const state: WorkflowEditorState = {
    before: [],
    current: undefined,
    after: [],
    version: 0,

    // we clone
    availableWorkflows: staticWorkflows.map((w) => ({ ...w })),
  }

  return state
}
