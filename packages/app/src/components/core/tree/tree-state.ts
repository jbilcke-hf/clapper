// adapted from joshuawootonn/react-components-from-scratch
import { createContext, Dispatch } from 'react'

import { ChainableMap } from './chainable-map'
import { OpenState, TreeViewActions, TreeViewActionTypes } from './types'

export const TREE_VIEW_ROOT_ID = 'TREE_VIEW_ROOT_ID'

export function treeviewReducer(
  state: OpenState,
  action: TreeViewActions
): OpenState {
  switch (action.type) {
    case TreeViewActionTypes.OPEN:
      return new ChainableMap(state).set(action.id, true)

    case TreeViewActionTypes.CLOSE:
      return new ChainableMap(state).set(action.id, false)

    default:
      throw new Error('Tree Reducer received an unknown action')
  }
}

export type TreeViewContextType = {
  open: OpenState
  dispatch: Dispatch<TreeViewActions>
  selectedId: string | null
  select: (id: string | null, nodeType?: any, data?: any) => void
}

export const TreeViewContext = createContext<TreeViewContextType>({
  open: new ChainableMap<string, boolean>(),
  dispatch: () => {},
  selectedId: null,
  select: () => {},
})
