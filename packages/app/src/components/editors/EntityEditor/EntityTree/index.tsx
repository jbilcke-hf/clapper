'use client'

import { useEffect } from 'react'
import { useTimeline } from '@aitube/timeline'

import { cn } from '@/lib/utils'
import { isClapEntity } from '@/components/tree-browsers/utils/isSomething'
import { TreeNodeItem, LibraryNodeType } from '@/components/tree-browsers/types'
import { Tree } from '@/components/core/tree'

import { useEntityTree } from './useEntityTree'
import { ClapEntity } from '@aitube/clap'
import { useEntityEditor } from '@/services'

export function EntityTree({
  className = '',
}: {
  className?: string
} = {}) {
  const libraryTreeRoot = useEntityTree((s) => s.libraryTreeRoot)
  const selectTreeNode = useEntityTree((s) => s.selectTreeNode)
  const selectedTreeNodeId = useEntityTree((s) => s.selectedTreeNodeId)
  const setProjectEntities = useEntityTree((s) => s.setProjectEntities)

  const entitiesChanged: number = useTimeline((s) => s.entitiesChanged)
  const entities: ClapEntity[] = useTimeline((s) => s.entities)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setProjectEntities(entities)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitiesChanged, setProjectEntities, entities.map((e) => e.id).join(',')])

  const setCurrent = useEntityEditor((s) => s.setCurrent)
  const selectedNodeItem = useEntityTree((s) => s.selectedNodeItem)
  const selectedNodeType = useEntityTree((s) => s.selectedNodeType)

  useEffect(() => {
    if (!selectedNodeType || !selectedNodeItem) {
      setCurrent(undefined)
      return
    }

    if (isClapEntity(selectedNodeType, selectedNodeItem)) {
      const entity: ClapEntity = selectedNodeItem

      setCurrent(entity)
    } else {
      // must be a different kind of node (eg. a collection, list or folder)
    }
  }, [selectedNodeType, selectedNodeItem, setCurrent])

  return (
    <Tree.Root<LibraryNodeType, TreeNodeItem>
      value={selectedTreeNodeId}
      onChange={selectTreeNode}
      className={cn(`not-prose h-full w-full px-2 pt-2`, className)}
      label="Entities"
    >
      {libraryTreeRoot.map((node) => (
        <Tree.Node node={node} key={node.id} />
      ))}
    </Tree.Root>
  )
}
