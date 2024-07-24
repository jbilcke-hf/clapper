'use client'

import { create } from 'zustand'
import { ClapEntity, UUID } from '@aitube/clap'
import { LibraryNodeItem, LibraryNodeType, LibraryTreeNode } from '../types'
import { icons } from '@/components/icons'
import { collectionClassName, libraryClassName } from './treeNodeStyles'

export const useWorkflowLibrary = create<{
  builtInLibraryTreeNodeId: string
  communityLibraryTreeNodeId: string
  libraryTreeRoot: LibraryTreeNode[]
  init: () => void

  /**
   * Load built-in collections into the tree
   *
   * @param collections
   * @returns
   */
  //setBuiltInCollections: (collections: WorkflowCollection[]) => void

  /**
   * Load community collections into the tree
   *
   * @param collections
   * @returns
   */
  //setCommunityCollections: (collections: WorkflowCollection[]) => void

  // we support those all selection modes for convenience - please keep them!
  selectedNodeItem?: LibraryNodeItem
  selectedNodeType?: LibraryNodeType
  selectTreeNode: (
    treeNodeId?: string | null,
    nodeType?: LibraryNodeType,
    nodeItem?: LibraryNodeItem
  ) => void
  selectedTreeNodeId: string | null
}>((set, get) => ({
  builtInLibraryTreeNodeId: '',
  communityLibraryTreeNodeId: '',
  libraryTreeRoot: [],
  init: () => {
    const builtInLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_WORKFLOWS',
      label: 'Built-in workflows',
      icon: icons.project,
      className: libraryClassName,
      isExpanded: true,
      children: [
        {
          id: UUID(),
          nodeType: 'LIB_NODE_GENERIC_EMPTY',
          label: 'A - 2',
          icon: icons.project,
          className: collectionClassName,
        },
      ],
    }

    const communityLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_COMMUNITY_COLLECTION',
      label: 'Community workflows',
      icon: icons.community,
      className: libraryClassName,
      children: [
        {
          id: UUID(),
          nodeType: 'LIB_NODE_GENERIC_EMPTY',
          label: 'A - 2',
          icon: icons.community,
          className: collectionClassName,
        },
      ],
    }

    const libraryTreeRoot = [builtInLibrary, communityLibrary]

    set({
      builtInLibraryTreeNodeId: builtInLibrary.id,
      communityLibraryTreeNodeId: communityLibrary.id,
      libraryTreeRoot,
      selectedNodeItem: undefined,
      selectedTreeNodeId: null,
    })
  },

  selectedNodeItem: undefined,
  selectEntity: (entity?: ClapEntity) => {
    if (entity) {
      console.log(
        'TODO julian: change this code to search in the entity collections'
      )
      const selectedTreeNode = get().libraryTreeRoot.find(
        (node) => node.data?.id === entity.id
      )

      // set({ selectedTreeNode })
      set({ selectedTreeNodeId: selectedTreeNode?.id || null })
      set({ selectedNodeItem: entity })
    } else {
      // set({ selectedTreeNode: undefined })
      set({ selectedTreeNodeId: null })
      set({ selectedNodeItem: undefined })
    }
  },

  // selectedTreeNode: undefined,
  selectedTreeNodeId: null,
  selectTreeNode: (
    treeNodeId?: string | null,
    nodeType?: LibraryNodeType,
    nodeItem?: LibraryNodeItem
  ) => {
    set({ selectedTreeNodeId: treeNodeId ? treeNodeId : undefined })
    set({ selectedNodeType: nodeType ? nodeType : undefined })
    set({ selectedNodeItem: nodeItem ? nodeItem : undefined })
  },
}))

useWorkflowLibrary.getState().init()
