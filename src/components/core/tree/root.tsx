// adapted from joshuawootonn/react-components-from-scratch
import React, { ReactNode, useReducer, useMemo, useCallback } from "react"

import { cn } from "@/lib/utils"
import { RovingTabindexRoot } from "./roving"
import { treeviewReducer, TreeViewContext } from "./tree-state"
import { ChainableMap } from "./chainable-map"

export function Root<S,T>({ children, onChange, value, label, className }: {
  children: ReactNode | ReactNode[]
  label: string
  className?: string
  value: string | null
  onChange: (id: string | null, nodeType?: S, data?: T) => void
}) {

  const [open, dispatch] = useReducer(treeviewReducer, new ChainableMap<string, boolean>())

  const select = useCallback(
    (selectedId: string | null, nodeType?: any, data?: any) => {
      onChange(selectedId, nodeType as S, data as T)
    },
    [onChange],
  )

  const providerValue = useMemo(
    () => ({ dispatch, open, select, selectedId: value }),
    [open, select, value],
  )

  return (
    <TreeViewContext.Provider value={providerValue}>
      <RovingTabindexRoot
        className={cn(`flex flex-col overflow-auto`, className)}
        active={providerValue.selectedId ?? null}
        as="ul"
        aria-label={label}
        aria-multiselectable="false"
        role="tree"
      >
        {children}
      </RovingTabindexRoot>
    </TreeViewContext.Provider>
  )
}