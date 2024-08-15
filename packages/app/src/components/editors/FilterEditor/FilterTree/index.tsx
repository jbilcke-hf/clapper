'use client'

import { useEffect } from 'react'

import { cn } from '@/lib/utils'
import {
  isClapEntity,
  isFilter,
  isFilterWithParams,
} from '@/components/tree-browsers/utils/isSomething'
import { TreeNodeItem, LibraryNodeType } from '@/components/tree-browsers/types'
import { Tree } from '@/components/core/tree'

import { useFilterTree } from './useFilterTree'
import { useFilterEditor } from '@/services/editors/filter-editor/useFilterEditor'
import {
  Filter,
  FilterParams,
  FilterWithParams,
} from '@aitube/clapper-services'

export function FilterTree({
  className = '',
}: {
  className?: string
} = {}) {
  const libraryTreeRoot = useFilterTree((s) => s.libraryTreeRoot)
  const selectTreeNode = useFilterTree((s) => s.selectTreeNode)
  const selectedTreeNodeId = useFilterTree((s) => s.selectedTreeNodeId)
  const setAvailableFilters = useFilterTree((s) => s.setAvailableFilters)

  const availableFilters = useFilterEditor((s) => s.availableFilters)
  const activeFilters = useFilterEditor((s) => s.activeFilters)
  const current = useFilterEditor((s) => s.current)
  const setCurrent = useFilterEditor((s) => s.setCurrent)

  useEffect(() => {
    setAvailableFilters(availableFilters)
  }, [availableFilters.map((f) => f.id).join(',')])

  const selectedNodeItem = useFilterTree((s) => s.selectedNodeItem)
  const selectedNodeType = useFilterTree((s) => s.selectedNodeType)

  useEffect(() => {
    console.log('FilterTree:', {
      selectedNodeType,
      selectedNodeItem,
    })
    if (!selectedNodeType || !selectedNodeItem) {
      setCurrent(undefined)
      return
    }

    if (isFilter(selectedNodeType, selectedNodeItem)) {
      console.log('is Filter!')
      const filter: Filter = selectedNodeItem

      const parameters: FilterParams = {}
      for (const field of filter.parameters) {
        parameters[field.id] = field.defaultValue
      }

      const filterWithParams: FilterWithParams = {
        filter,
        parameters,
      }

      const pipeline = [filterWithParams]

      setCurrent(pipeline)
    } else if (isFilterWithParams(selectedNodeType, selectedNodeItem)) {
      console.log('is FilterWithParams!')
      const filterWithParams: FilterWithParams = selectedNodeItem

      const pipeline = [filterWithParams]

      setCurrent(pipeline)
    } else {
      console.log('is not a filter..')
      // must be a different kind of node (eg. a collection, list or folder)
    }
  }, [selectedNodeType, selectedNodeItem])

  return (
    <Tree.Root<LibraryNodeType, TreeNodeItem>
      value={selectedTreeNodeId}
      onChange={selectTreeNode}
      className={cn(`not-prose h-full w-full px-2 pt-2`, className)}
      label="Filters"
    >
      {libraryTreeRoot.map((node) => (
        <Tree.Node node={node} key={node.id} />
      ))}
    </Tree.Root>
  )
}
