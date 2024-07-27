/*
    as you can see, we try to make some data structure generic a bit,
    for instance we have a single data structure for AI models ("clap model"),
    and a single data structure for files ("item")
*/

import { ClapEntity } from '@aitube/clap'
import {
  CommunityEntityCollection,
  CommunityFileOrFolder,
  TreeNodeItem,
  LibraryNodeType,
  DeviceCollection,
  DeviceFileOrFolder,
} from '../types'

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
