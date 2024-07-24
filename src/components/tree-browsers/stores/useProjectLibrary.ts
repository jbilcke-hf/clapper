'use client'

import { create } from 'zustand'
import { ClapEntity, ClapSegmentCategory, UUID } from '@aitube/clap'

import { icons } from '@/components/icons'

import { LibraryNodeItem, LibraryNodeType, LibraryTreeNode } from '../types'
import {
  collectionClassName,
  itemClassName,
  libraryClassName,
} from './treeNodeStyles'

export const useProjectLibrary = create<{
  libraryTreeRoot: LibraryTreeNode[]
  init: () => void
  setProjectEntities: (entities: ClapEntity[]) => Promise<void>
  selectedNodeItem?: LibraryNodeItem
  selectedNodeType?: LibraryNodeType
  selectEntity: (entity?: ClapEntity) => void
  selectTreeNode: (
    treeNodeId?: string | null,
    nodeType?: LibraryNodeType,
    nodeItem?: LibraryNodeItem
  ) => void
  selectedTreeNodeId: string | null
}>((set, get) => ({
  libraryTreeRoot: [],
  init: () => {
    set({
      libraryTreeRoot: [],
      selectedNodeItem: undefined,
      selectedTreeNodeId: null,
      // selectedTreeNode: undefined,
    })
  },

  setProjectEntities: async (entities: ClapEntity[]) => {
    const { libraryTreeRoot } = get()

    const characters: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_GENERIC_COLLECTION',
      data: undefined,
      label: 'Characters',
      icon: icons.characters,
      className: libraryClassName,
      isExpanded: true, // This node is expanded by default
      children: [],
    }

    const locations: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_GENERIC_COLLECTION',
      data: undefined,
      label: 'Locations',
      icon: icons.location,
      className: libraryClassName,
      isExpanded: true, // This node is expanded by default
      children: [],
    }

    const misc: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_GENERIC_COLLECTION',
      data: undefined,
      label: 'Misc',
      icon: icons.misc,
      className: libraryClassName,
      isExpanded: true, // This node is expanded by default
      children: [],
    }

    entities.forEach((entity) => {
      const node: LibraryTreeNode = {
        nodeType: 'LIB_NODE_PROJECT_ENTITY_GENERIC',
        id: entity.id,
        data: entity,
        label: entity.label,
        icon: icons.misc,
        className: collectionClassName,
      }
      if (entity.category === ClapSegmentCategory.CHARACTER) {
        node.icon = icons.character
        node.nodeType = 'LIB_NODE_PROJECT_ENTITY_CHARACTER'
        characters.children!.push(node)
      } else if (entity.category === ClapSegmentCategory.LOCATION) {
        node.icon = icons.location
        node.nodeType = 'LIB_NODE_PROJECT_ENTITY_LOCATION'
        locations.children!.push(node)
      } else {
        misc.children!.push(node)
      }
    })

    set({
      libraryTreeRoot: [
        characters,
        locations,
        misc,
        // displaying an empty collection isn't very useful,
        // so let's just clean them out
      ].filter((node) => node.children?.length),
    })
  },

  selectedNodeItem: undefined,
  selectEntity: (entity?: ClapEntity) => {
    if (entity) {
      console.log(
        'TODO julian: change this code to search in the model collections'
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

useProjectLibrary.getState().init()
