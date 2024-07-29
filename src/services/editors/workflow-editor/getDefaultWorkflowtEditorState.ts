import { WorkflowEditorState } from '@aitube/clapper-services'

export function getDefaultWorkflowEditorState(): WorkflowEditorState {
  const state: WorkflowEditorState = {
    before: [],
    current: undefined,
    after: [],
    version: 0,
  }

  return state
}
