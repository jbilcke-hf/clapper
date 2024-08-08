import { WorkflowEditorState } from '@aitube/clapper-services'

import { workflows } from './workflows'

export function getDefaultWorkflowEditorState(): WorkflowEditorState {
  const state: WorkflowEditorState = {
    before: [],
    current: undefined,
    after: [],
    version: 0,

    // we clone
    availableWorkflows: workflows.map((w) => ({ ...w })),
  }

  return state
}
