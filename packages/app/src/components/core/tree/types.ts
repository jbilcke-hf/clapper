import { ReactNode } from 'react'

import { ChainableMap } from './chainable-map'
import { IconType } from 'react-icons/lib'

export type OpenState = ChainableMap<string, boolean>

export enum TreeViewActionTypes {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export type TreeViewActions =
  | {
      type: TreeViewActionTypes.OPEN
      id: string
    }
  | {
      type: TreeViewActionTypes.CLOSE
      id: string
    }

export type RovingTabindexItem = {
  id: string
  element: HTMLElement
}

export type TreeNodeType<S, T> = {
  id: string
  nodeType?: S
  label: ReactNode
  children?: TreeNodeType<S, T>[]
  isFolder?: boolean
  isExpanded?: boolean
  icon?: IconType
  className?: string
  data?: T
}
