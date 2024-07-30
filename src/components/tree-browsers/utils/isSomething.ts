import { ClapEntity } from '@aitube/clap'
import {
  CommunityEntityCollection,
  CommunityFileOrFolder,
  TreeNodeItem,
  LibraryNodeType,
  DeviceCollection,
  DeviceFileOrFolder,
} from '../types'
import { Filter, FilterWithParams } from '@aitube/clapper-services'

////////////////////////////////////
//          TYPEGUARDS            //
////////////////////////////////////

// a tree can mix nodes of various nature (list, leaf) and type (segment, entity, filter, filter with preset params..)
// the purpose of all those type guards is to be able to rect the type of a node,
// and make sure we are within the right type context

export const isFSCollection = (
  nodeType: LibraryNodeType,
  data: TreeNodeItem
): data is DeviceCollection => {
  return nodeType === 'TREE_ROOT_DEVICE'
}

export const isFSFileOrFolder = (
  nodeType: LibraryNodeType,
  data: TreeNodeItem
): data is DeviceFileOrFolder => {
  return (
    nodeType === 'DEVICE_TREE_NODE_LIST_FOLDER' ||
    nodeType === 'DEVICE_TREE_NODE_ITEM_FILE'
  )
}

export const isCommunityEntityCollection = (
  nodeType: LibraryNodeType,
  data: TreeNodeItem
): data is CommunityEntityCollection => {
  return nodeType === 'COMMUNITY_TREE_NODE_LIST_DATASET'
}

export const isCommunityFileOrFolder = (
  nodeType: LibraryNodeType,
  data: TreeNodeItem
): data is CommunityFileOrFolder => {
  return (
    nodeType === 'COMMUNITY_TREE_NODE_LIST_FOLDER' ||
    nodeType === 'COMMUNITY_TREE_NODE_ITEM_FILE'
  )
}

export const isClapEntity = (
  nodeType: LibraryNodeType,
  data: TreeNodeItem
): data is ClapEntity => {
  return nodeType === 'ENTITY_TREE_NODE_ITEM_ENTITY'
}

export const isFilter = (
  nodeType: LibraryNodeType,
  data: TreeNodeItem
): data is Filter => {
  return nodeType === 'FILTER_TREE_NODE_ITEM_FILTER'
}

export const isFilterWithParams = (
  nodeType: LibraryNodeType,
  data: TreeNodeItem
): data is FilterWithParams => {
  return nodeType === 'FILTER_TREE_NODE_ITEM_FILTER_PRESET'
}
