/*
    as you can see, we try to make some data structure generic a bit,
    for instance we have a single data structure for AI models ("clap model"),
    and a single data structure for files ("item")
*/

import { ClapEntity } from '@aitube/clap'
import {
  HuggingFaceUserCollection,
  HuggingFaceUserItem,
  LibraryNodeItem,
  LibraryNodeType,
  LocalUserCollection,
  LocalUserItem,
  ReplicateCollection,
} from '../types'

export const isLocalUserCollection = (
  nodeType: LibraryNodeType,
  data: LibraryNodeItem
): data is LocalUserCollection => {
  return nodeType === 'LIB_NODE_LOCAL_USER_COLLECTION'
}

export const isLocalUserItem = (
  nodeType: LibraryNodeType,
  data: LibraryNodeItem
): data is LocalUserItem => {
  return (
    nodeType === 'LIB_NODE_LOCAL_USER_FILE' ||
    nodeType === 'LIB_NODE_LOCAL_USER_FOLDER'
  )
}

export const isHuggingFaceUserCollection = (
  nodeType: LibraryNodeType,
  data: LibraryNodeItem
): data is HuggingFaceUserCollection => {
  return nodeType === 'LIB_NODE_HUGGINGFACE_USER_COLLECTION'
}

export const isHuggingFaceUserItem = (
  nodeType: LibraryNodeType,
  data: LibraryNodeItem
): data is HuggingFaceUserItem => {
  return (
    nodeType === 'LIB_NODE_HUGGINGFACE_USER_FILE' ||
    nodeType === 'LIB_NODE_HUGGINGFACE_USER_FOLDER'
  )
}

export const isReplicateCollection = (
  nodeType: LibraryNodeType,
  data: LibraryNodeItem
): data is ReplicateCollection => {
  return nodeType === 'LIB_NODE_REPLICATE_COLLECTION'
}

export const isClapEntity = (
  nodeType: LibraryNodeType,
  data: LibraryNodeItem
): data is ClapEntity => {
  return (
    nodeType === 'LIB_NODE_REPLICATE_MODEL' ||
    nodeType === 'LIB_NODE_HUGGINGFACE_MODEL' ||
    nodeType === 'LIB_NODE_GENERIC_MODEL'
  )
}
