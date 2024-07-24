import { WorkflowEditorState } from '@aitube/clapper-services'

export function getDefaultWorkflowEditorState(): WorkflowEditorState {
  const state: WorkflowEditorState = {
    current: undefined,
    version: 0,
    history: [],
  }

  return state
}
