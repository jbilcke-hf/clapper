'use client'

import { create } from 'zustand'
import { ClapEntity, ClapSegmentCategory, UUID } from '@aitube/clap'
import {
  CivitaiCollection,
  LibraryNodeItem,
  LibraryNodeType,
  LibraryTreeNode,
  ReplicateCollection,
} from '../types'
import { icons } from '@/components/icons'
import { getAppropriateIcon } from '@/components/icons/getAppropriateIcon'

// TODO: this isn't the best place for this as this is style,
// and we are in a state manager
const libraryClassName = 'text-base font-semibold'

const collectionClassName = `text-base font-normal`

const itemClassName =
  'text-sm font-light text-gray-200/60 hover:text-gray-200/100'

export const useEntityLibrary = create<{
  teamLibraryTreeNodeId: string
  communityLibraryTreeNodeId: string
  civitaiLibraryTreeNodeId: string
  huggingfaceLibraryTreeNodeId: string
  replicateLibraryTreeNodeId: string
  libraryTreeRoot: LibraryTreeNode[]
  init: () => void

  /**
   * Load Replicate collections (API models) into the tree
   *
   * @param collections
   * @returns
   */
  setReplicateCollections: (collections: ReplicateCollection[]) => void

  /**
   * Load Replicate collections (LoRA models) into the tree
   *
   * @param collections
   * @returns
   */
  setCivitaiCollections: (collections: CivitaiCollection[]) => void

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
  localUserLibraryTreeNodeId: '',
  huggingfaceUserLibraryTreeNodeId: '',
  teamLibraryTreeNodeId: '',
  communityLibraryTreeNodeId: '',
  civitaiLibraryTreeNodeId: '',
  huggingfaceLibraryTreeNodeId: '',
  replicateLibraryTreeNodeId: '',
  libraryTreeRoot: [],
  init: () => {
    const teamLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_TEAM_COLLECTION',
      label: 'Team models',
      icon: icons.team,
      className: libraryClassName,
      isExpanded: true,
      children: [
        {
          id: UUID(),
          nodeType: 'LIB_NODE_GENERIC_EMPTY',
          label: 'A - 2',
          icon: icons.team,
          className: collectionClassName,
        },
      ],
    }

    const civitaiLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_CIVITAI_COLLECTION',
      label: 'Civitai models',
      icon: icons.community,
      className: libraryClassName,
      children: [],
    }

    const communityLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_COMMUNITY_COLLECTION',
      label: 'Community models',
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

    const huggingfaceLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_HUGGINGFACE_COLLECTION',
      label: 'Hugging Face',
      icon: icons.vendor,
      className: libraryClassName,
      children: [],
    }

    const replicateLibrary: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_REPLICATE_COLLECTION',
      label: 'Replicate',
      icon: icons.vendor,
      isExpanded: false, // This node is expanded by default
      className: libraryClassName,
      children: [],
    }

    const libraryTreeRoot = [
      // teamLibrary,
      // communityLibrary,
      civitaiLibrary,
      // huggingfaceLibrary,
      replicateLibrary,
    ]

    set({
      teamLibraryTreeNodeId: teamLibrary.id,
      civitaiLibraryTreeNodeId: civitaiLibrary.id,
      communityLibraryTreeNodeId: communityLibrary.id,
      huggingfaceLibraryTreeNodeId: huggingfaceLibrary.id,
      replicateLibraryTreeNodeId: replicateLibrary.id,
      libraryTreeRoot,
      selectedNodeItem: undefined,
      selectedTreeNodeId: null,
    })
  },

  setProjectEntities: async (entities: ClapEntity[]) => {
    const characters: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_GENERIC_COLLECTION',
      data: undefined,
      label: 'Characters',
      icon: icons.characters,
      className: collectionClassName,
      isExpanded: true, // This node is expanded by default
      children: [],
    }

    const locations: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_GENERIC_COLLECTION',
      data: undefined,
      label: 'Locations',
      icon: icons.location,
      className: collectionClassName,
      isExpanded: false, // This node is expanded by default
      children: [],
    }

    const misc: LibraryTreeNode = {
      id: UUID(),
      nodeType: 'LIB_NODE_GENERIC_COLLECTION',
      data: undefined,
      label: 'Misc',
      icon: icons.misc,
      className: collectionClassName,
      isExpanded: false, // This node is expanded by default
      children: [],
    }

    entities.forEach((entity) => {
      const node: LibraryTreeNode = {
        nodeType: 'LIB_NODE_REPLICATE_MODEL',
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

  setReplicateCollections: (collections: ReplicateCollection[]) => {
    const { replicateLibraryTreeNodeId, libraryTreeRoot } = get()

    set({
      libraryTreeRoot: libraryTreeRoot.map((node) => {
        if (node.id !== replicateLibraryTreeNodeId) {
          return node
        }

        return {
          ...node,

          children:
            // only keep non-empty models
            collections
              .filter((c) => c.models.length)

              // only visual or sound oriented models
              .filter((c) => {
                const name = c.name.toLowerCase()

                // ignore captioning models, we don't need this right now
                if (name.includes('to text') || name.includes('to-text')) {
                  return false
                }

                if (
                  name.includes('image') ||
                  name.includes('video') ||
                  name.includes('style') ||
                  name.includes('audio') ||
                  name.includes('sound') ||
                  name.includes('music') ||
                  name.includes('speech') ||
                  name.includes('voice') ||
                  name.includes('resolution') ||
                  name.includes('upscale') ||
                  name.includes('upscaling') ||
                  name.includes('interpolate') ||
                  name.includes('interpolation')
                ) {
                  return true
                }
                return false
              })
              .map<LibraryTreeNode>((c) => ({
                id: UUID(),
                data: c,
                nodeType: 'LIB_NODE_REPLICATE_COLLECTION',
                label: c.name,
                icon: getAppropriateIcon(c.name),
                className: collectionClassName, // `${collectionClassName} ${getCollectionColor(c.name)}`,
                isExpanded: false, // This node is expanded by default
                children: c.models.map<LibraryTreeNode>((m) => ({
                  nodeType: 'LIB_NODE_REPLICATE_MODEL',
                  id: m.id,
                  data: m,
                  label: m.label,
                  icon: getAppropriateIcon(m.label, getAppropriateIcon(c.name)),
                  className: itemClassName, // `${itemClassName} ${getItemColor(m.label, getItemColor(c.name))}`,
                })),
              })),
        }
      }),
    })
  },

  setCivitaiCollections: (collections: CivitaiCollection[]) => {
    const { civitaiLibraryTreeNodeId, libraryTreeRoot } = get()

    set({
      libraryTreeRoot: libraryTreeRoot.map((node) => {
        if (node.id !== civitaiLibraryTreeNodeId) {
          return node
        }

        return {
          ...node,

          children: collections.map<LibraryTreeNode>((c) => ({
            id: UUID(),
            data: c,
            nodeType: 'LIB_NODE_CIVITAI_COLLECTION',
            label: c.name,
            icon: getAppropriateIcon(c.name),
            className: collectionClassName, // `${collectionClassName} ${getCollectionColor(c.name)}`,
            isExpanded: false, // This node is expanded by default
            children: c.models.map<LibraryTreeNode>((m) => ({
              nodeType: 'LIB_NODE_CIVITAI_MODEL',
              id: m.id,
              data: m,
              label: m.label,
              icon: getAppropriateIcon(m.label, getAppropriateIcon(c.name)),
              className: itemClassName, // `${itemClassName} ${getItemColor(m.label, getItemColor(c.name))}`,
            })),
          })),
        }
      }),
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

useEntityLibrary.getState().init()
