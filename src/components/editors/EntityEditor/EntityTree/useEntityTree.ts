'use client'

import { create } from 'zustand'
import { ClapEntity, ClapSegmentCategory, UUID } from '@aitube/clap'
import {
  LibraryTreeNode,
  TreeNodeItem,
  LibraryNodeType,
} from '@/components/tree-browsers/types'
import { icons } from '@/components/icons'
import { getAppropriateIcon } from '@/components/icons/getAppropriateIcon'
import {
  collectionClassName,
  itemClassName,
  libraryClassName,
} from '@/components/tree-browsers/style/treeNodeStyles'

export const useEntityTree = create<{
  // project entities stored in the .clap
  projectLibraryTreeNodeId: string

  // in the future, we are going to put
  // <placeholder>

  // entities stored on the public database (Hugging Face datasets, tagged)
  communityLibraryTreeNodeId: string

  libraryTreeRoot: LibraryTreeNode[]
  init: () => void

  /**
   * Load entity collections (characters, locations..) from the clap project into the tree
   *
   * @param collections
   * @returns
   */
  setProjectEntities: (entities: ClapEntity[]) => Promise<void>

  /**
   * Load entity collections (characters, locations..) from the Clapper community into the tree
   *
   * @param collections
   * @returns
   */
  // setCommunityLibrary: (collections: CommunityEntityCollection[]) => void

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
  // project entities stored in the .clap
  projectLibraryTreeNodeId: '',

  // in the future, we are going to put
  // <placeholder>

  // entities stored on the public database (Hugging Face datasets, tagged)
  communityLibraryTreeNodeId: '',
  libraryTreeRoot: [],
  init: () => {
    const projectLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'TREE_ROOT_PROJECT',
      label: 'Project entities',
      icon: icons.project,
      className: libraryClassName,
      isExpanded: true,
      children: [
        {
          id: UUID(),
          nodeType: 'DEFAULT_TREE_NODE_EMPTY',
          label: 'Empty',
          icon: icons.project,
          className: collectionClassName,
        },
      ],
    }

    const communityLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'TREE_ROOT_COMMUNITY',
      label: 'Community entities',
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

    const libraryTreeRoot = [projectLibrary, communityLibrary]

    set({
      projectLibraryTreeNodeId: projectLibrary.id,
      communityLibraryTreeNodeId: communityLibrary.id,
      libraryTreeRoot,
      selectedNodeItem: undefined,
      selectedTreeNodeId: null,
    })
  },

  setProjectEntities: async (entities: ClapEntity[]) => {
    const characters: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'ENTITY_TREE_NODE_LIST_ENTITIES',
      data: undefined,
      label: 'Characters',
      icon: icons.characters,
      className: collectionClassName,
      isExpanded: true, // This node is expanded by default
      children: [],
    }

    const locations: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'ENTITY_TREE_NODE_LIST_ENTITIES',
      data: undefined,
      label: 'Locations',
      icon: icons.location,
      className: collectionClassName,
      isExpanded: false, // This node is expanded by default
      children: [],
    }

    const misc: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'ENTITY_TREE_NODE_LIST_ENTITIES',
      data: undefined,
      label: 'Misc',
      icon: icons.misc,
      className: collectionClassName,
      isExpanded: false, // This node is expanded by default
      children: [],
    }

    entities.forEach((entity) => {
      const node: LibraryTreeNode = {
        nodeType: 'ENTITY_TREE_NODE_ITEM_ENTITY',
        id: entity.id,
        data: entity,
        label: entity.label,
        icon: icons.misc,
        className: itemClassName,
      }
      if (entity.category === ClapSegmentCategory.CHARACTER) {
        node.icon = icons.character
        characters.children!.push(node)
      } else if (entity.category === ClapSegmentCategory.LOCATION) {
        node.icon = icons.location
        locations.children!.push(node)
      } else {
        misc.children!.push(node)
      }
    })
  },

  /*
  setCommunityCollections: (collections: CommunityEntityCollection[]) => {
    // TODO: implement this
   
  },
  */

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

useEntityTree.getState().init()
