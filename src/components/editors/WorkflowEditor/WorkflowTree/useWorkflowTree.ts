'use client'

import { create } from 'zustand'
import { ClapEntity, UUID } from '@aitube/clap'

import { icons } from '@/components/icons'
import {
  TreeNodeItem,
  LibraryNodeType,
  LibraryTreeNode,
} from '@/components/tree-browsers/types'
import {
  collectionClassName,
  libraryClassName,
} from '@/components/tree-browsers/style/treeNodeStyles'

export const useWorkflowTree = create<{
  builtinLibraryTreeNodeId: string
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
  selectedNodeItem?: TreeNodeItem
  selectedNodeType?: LibraryNodeType
  selectTreeNode: (
    treeNodeId?: string | null,
    nodeType?: LibraryNodeType,
    nodeItem?: TreeNodeItem
  ) => void
  selectedTreeNodeId: string | null
}>((set, get) => ({
  builtinLibraryTreeNodeId: '',
  communityLibraryTreeNodeId: '',
  libraryTreeRoot: [],
  init: () => {
    const builtinLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'TREE_ROOT_BUILTIN',
      label: 'Default workflows',
      icon: icons.community,
      className: libraryClassName,
      isExpanded: true,
      children: [
        {
          id: UUID(),
          nodeType: 'DEFAULT_TREE_NODE_EMPTY',
          label: 'Empty',
          icon: icons.community,
          className: collectionClassName,
        },
      ],
    }

    const communityLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'TREE_ROOT_COMMUNITY',
      label: 'Community workflows',
      icon: icons.community,
      className: libraryClassName,
      children: [
        {
          id: UUID(),
          nodeType: 'DEFAULT_TREE_NODE_EMPTY',
          label: 'Empty',
          icon: icons.community,
          className: collectionClassName,
        },
      ],
    }

    const libraryTreeRoot = [builtinLibrary, communityLibrary]

    set({
      builtinLibraryTreeNodeId: builtinLibrary.id,
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
    nodeItem?: TreeNodeItem
  ) => {
    set({ selectedTreeNodeId: treeNodeId ? treeNodeId : undefined })
    set({ selectedNodeType: nodeType ? nodeType : undefined })
    set({ selectedNodeItem: nodeItem ? nodeItem : undefined })
  },
}))

useWorkflowTree.getState().init()
