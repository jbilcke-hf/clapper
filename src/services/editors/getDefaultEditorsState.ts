import { EditorsState, EditorView } from '@aitube/clapper-services'

export function getDefaultEditorsState(): EditorsState {
  const state: EditorsState = {
    view: EditorView.SCRIPT,
  }

  return state
}
