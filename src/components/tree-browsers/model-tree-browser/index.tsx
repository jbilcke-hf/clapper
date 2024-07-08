"use client"

import { useEffect } from "react"

import { cn } from "@/lib/utils"
import { useEntityLibrary } from "../stores/useEntityLibrary"
import { LibraryNodeItem, LibraryNodeType } from "../types"
import { Tree } from "@/components/core/tree"

import { isClapEntity, isReplicateCollection } from "../utils/isSomething"
import { useCivitaiCollections } from "../stores/useCivitaiCollections"
import { useReplicateCollections } from "../stores/useReplicateCollections"

export function ModelTreeBrowser() {
  const libraryTreeRoot = useEntityLibrary(s => s.libraryTreeRoot)
  const selectTreeNode = useEntityLibrary(s => s.selectTreeNode)
  const selectedTreeNodeId = useEntityLibrary(s => s.selectedTreeNodeId)
  const setReplicateCollections = useEntityLibrary(s => s.setReplicateCollections)
  const setCivitaiCollections = useEntityLibrary(s => s.setCivitaiCollections)
 
  // TODO: we are forced to do this because the api "endpoint" is a server action
  // however we could rewrite it so that we can pull the collections directly
  // from the Zustand store

  const newReplicateCollections = useReplicateCollections()
  useEffect(() => {
    setReplicateCollections(newReplicateCollections)
  }, [
    JSON.stringify(newReplicateCollections) // ... yeah, I know, I know..
  ])
  
  const newCivitaiCollections = useCivitaiCollections()
  useEffect(() => {
    setCivitaiCollections(newCivitaiCollections)
  }, [
    JSON.stringify(newCivitaiCollections) // ... yeah, I know, I know..
  ])
  

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

    if (isReplicateCollection(nodeType, nodeItem)) {
      // ReplicateCollection
    } else if (isClapEntity(nodeType, nodeItem)) {
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
        label="Model Library"
      >
      {libraryTreeRoot.map(node => (
        <Tree.Node node={node} key={node.id} />
      ))}
      </Tree.Root>
    </div>
  )
}