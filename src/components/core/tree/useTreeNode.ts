import {
  useContext,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
  ComponentPropsWithoutRef,
  ElementType,
  useMemo,
  useEffect,
  useRef,
} from "react"
import isHotkey from "is-hotkey"

import {
  getFirstFocusableId,
  getLastFocusableId,
  getNextFocusableId,
  getNextFocusableIdByTypeahead,
  getParentFocusableId,
  getPrevFocusableId,
  NOT_FOCUSABLE_SELECTOR,
  useRovingTabindex,
} from "./roving"

import {
  TreeViewContextType,
  TreeViewContext,
} from "./tree-state"
import { RovingTabindexItem, TreeViewActionTypes } from "./types"

export function useTreeNode<T extends ElementType>(
  id: string,
  options: {
    selectionType: 'followFocus' | 'distinct'
    isFolder: boolean
    isExpanded?: boolean // Add this field to the options
    data?: any
  } = {
    selectionType: 'followFocus',
    isFolder: false,
    isExpanded: false,
    data: undefined,
  },
): {
  isOpen: boolean
  open: () => void
  close: () => void
  isFocusable: boolean
  isSelected: boolean
  isExpanded: boolean
  getTreeNodeProps: (props: ComponentPropsWithoutRef<T>) => {
    ref: (current: HTMLElement | null) => void
    tabIndex: number
    ['aria-expanded']: boolean
    ['aria-selected']: boolean
    role: 'treeitem'
    onMouseDown: (event: MouseEvent) => void
    onKeyDown: (event: KeyboardEvent) => void
    onFocus: (event: FocusEvent) => void
  }
  treeGroupProps: {
    role: 'group'
  }
} {
  const { open, selectedId, select, dispatch } =
    useContext<TreeViewContextType>(TreeViewContext)

  const { isFocusable, getOrderedItems, getRovingProps } =
    useRovingTabindex(id)

  const dispatchOnce = useRef(false) // Add a ref to track initial dispatch of the default expander

  useEffect(() => {
    if (options.isExpanded && !open.get(id) && !dispatchOnce.current) {
      dispatch({ type: TreeViewActionTypes.OPEN, id })

      // Ensure the action is dispatched only once, otherwise we wouldn't be able to collapse the node
      dispatchOnce.current = true
    }
  }, [id, options.isExpanded, open, dispatch])

  return useMemo(() => {
    const isOpen = open.get(id) ?? false

    return {
      isOpen,
      isFocusable,
      isSelected: selectedId === id,
      isExpanded: Boolean(options.isExpanded),
      open: function () {
        dispatch({ type: TreeViewActionTypes.OPEN, id })
      },
      close: function () {
        dispatch({ type: TreeViewActionTypes.CLOSE, id })
      },
      getTreeNodeProps: (props: ComponentPropsWithoutRef<T>) => ({
        ['aria-expanded']: isOpen,
        ['aria-selected']: selectedId === id,
        role: 'treeitem',
        ...getRovingProps<T>({
          ...props,
          [NOT_FOCUSABLE_SELECTOR]: !isOpen,
          onMouseDown: function (e: MouseEvent) {
            e.stopPropagation()
            props?.onMouseDown?.(e)
            if (e.button === 0) {
              if (options.isFolder) {
                isOpen
                  ? dispatch({
                      type: TreeViewActionTypes.CLOSE,
                      id,
                    })
                  : dispatch({
                      type: TreeViewActionTypes.OPEN,
                      id,
                    })
              } else {
                // openOpen?.()
              }
              select(id, options?.data?.nodeType, options?.data?.data)
            }
          },
          onKeyDown: function (e: KeyboardEvent) {
            e.stopPropagation()
            props.onKeyDown?.(e)

            let nextItemToFocus: RovingTabindexItem | undefined
            const items = getOrderedItems()

            if (isHotkey('up', e)) {
              e.preventDefault()
              nextItemToFocus = getPrevFocusableId(items, id)
            } else if (isHotkey('down', e)) {
              e.preventDefault()
              nextItemToFocus = getNextFocusableId(items, id)
            } else if (isHotkey('left', e)) {
              if (isOpen && options.isFolder) {
                dispatch({
                  type: TreeViewActionTypes.CLOSE,
                  id,
                })
              } else {
                nextItemToFocus = getParentFocusableId(
                  items,
                  id,
                )
              }
            } else if (isHotkey('right', e)) {
              if (isOpen && options.isFolder) {
                nextItemToFocus = getNextFocusableId(items, id)
              } else {
                dispatch({ type: TreeViewActionTypes.OPEN, id })
              }
            } else if (isHotkey('home', e)) {
              e.preventDefault()
              nextItemToFocus = getFirstFocusableId(items)
            } else if (isHotkey('end', e)) {
              e.preventDefault()
              nextItemToFocus = getLastFocusableId(items)
            } else if (isHotkey('space', e)) {
              e.preventDefault()
              select(id, options?.data?.nodeType, options?.data?.data)
            } else if (/^[a-z]$/i.test(e.key)) {
              nextItemToFocus = getNextFocusableIdByTypeahead(
                items,
                id,
                e.key,
              )
            }

            if (nextItemToFocus != null) {
              nextItemToFocus.element.focus()
              options.selectionType === 'followFocus' &&
                select(nextItemToFocus.id)
            }
          },
        }),
      }),
      treeGroupProps: {
        role: 'group',
      },
    }
  }, [
    dispatch,
    getOrderedItems,
    getRovingProps,
    id,
    isFocusable,
    open,
    options.isFolder,
    options.selectionType,
    options.isExpanded,
    select,
    selectedId,
  ])
}