"use client"

import { cn } from "@/lib/utils"
import { isClapEntity } from "../utils/isSomething"
import { useProjectLibrary } from "../stores/useProjectLibrary"
import { LibraryNodeItem, LibraryNodeType } from "../types"
import { Tree } from "@/components/core/tree"

export function ProjectTreeBrowser() {
  const libraryTreeRoot = useProjectLibrary(s => s.libraryTreeRoot)
  const selectTreeNode = useProjectLibrary(s => s.selectTreeNode)
  const selectedTreeNodeId = useProjectLibrary(s => s.selectedTreeNodeId)

  /**
   * handle click on tree node
   * yes, this is where the magic happens!
   * 
   * @param id 
   * @param nodeType 
   * @param node 
   * @returns 
   */
  const handleOnChange = async (id: string | null, nodeType?: LibraryNodeType, nodeItem?: LibraryNodeItem) => {
    console.log(`calling selectTreeNodeById(id)`)
    selectTreeNode(id, nodeType, nodeItem)

    if (!nodeType || !nodeItem) {
      console.log("tree-browser: clicked on an undefined node")
      return
    }
    if (isClapEntity(nodeType, nodeItem)) {
      // ClapEntity
    } else {
      console.log(`tree-browser: no action attached to ${nodeType}, so skipping`)
      return
    }
    console.log(`tree-browser: clicked on a ${nodeType}`, nodeItem)
  }

  return (

    <div className={cn(
    )}>
      <Tree.Root<LibraryNodeType, LibraryNodeItem>
        value={selectedTreeNodeId}
        onChange={handleOnChange}

        className="w-full h-full not-prose px-2 pt-8"
        label="Project Library"
      >
      {libraryTreeRoot.map(node => (
        <Tree.Node node={node} key={node.id} />
      ))}
      </Tree.Root>
    </div>
  )
}