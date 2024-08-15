'use client'

import { cn } from '@/lib/utils'
import { isClapEntity } from '@/components/tree-browsers/utils/isSomething'
import { TreeNodeItem, LibraryNodeType } from '@/components/tree-browsers/types'
import { Tree } from '@/components/core/tree'

import { useWorkflowTree } from './useWorkflowTree'

export function WorkflowTree({
  className = '',
}: {
  className?: string
} = {}) {
  const libraryTreeRoot = useWorkflowTree((s) => s.libraryTreeRoot)
  const selectTreeNode = useWorkflowTree((s) => s.selectTreeNode)
  const selectedTreeNodeId = useWorkflowTree((s) => s.selectedTreeNodeId)

  // TODO: allow selecting a workflow (see example of filter/entity tree)

  return (
    <Tree.Root<LibraryNodeType, TreeNodeItem>
      value={selectedTreeNodeId}
      onChange={selectTreeNode}
      className={cn(`not-prose h-full w-full px-2 pt-2`, className)}
      label="Workflows"
    >
      {libraryTreeRoot.map((node) => (
        <Tree.Node node={node} key={node.id} />
      ))}
    </Tree.Root>
  )
}
