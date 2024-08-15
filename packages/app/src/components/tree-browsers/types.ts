// note: we only keep simplified representations of provider data structures

import { ScreenplaySequence } from '@aitube/broadway'
import { ClapEntity, ClapSegment, ClapWorkflow } from '@aitube/clap'
import { TreeNodeType } from '../core/tree/types'
import { Filter, FilterWithParams } from '@aitube/clapper-services'

export type DefaultTreeNodeList = 'DEFAULT_TREE_NODE_LIST'
export type DefaultTreeNodeItem = 'DEFAULT_TREE_NODE_ITEM'
export type DefaultTreeNodeEmpty = 'DEFAULT_TREE_NODE_EMPTY'

export type DefaultTreeNode =
  | DefaultTreeNodeList
  | DefaultTreeNodeItem
  | DefaultTreeNodeEmpty

// ------------------------------------------
export type CommunityTreeNodeDataset = 'COMMUNITY_TREE_NODE_LIST_DATASET'
export type CommunityTreeNodeList = 'COMMUNITY_TREE_NODE_LIST_FOLDER'
export type CommunityTreeNodeItem = 'COMMUNITY_TREE_NODE_ITEM_FILE'

export type CommunityTreeNode =
  | CommunityTreeNodeDataset
  | CommunityTreeNodeList
  | CommunityTreeNodeItem

// ------------------------------------------

export type DeviceTreeNodeList = 'DEVICE_TREE_NODE_LIST_FOLDER'
export type DeviceTreeNodeItem = 'DEVICE_TREE_NODE_ITEM_FILE'

export type DeviceTreeNode = DeviceTreeNodeList | DeviceTreeNodeItem

// ------------------------------------------

export type FlowTreeNodeList = 'FLOW_TREE_NODE_LIST_WORKFLOWS'
export type FlowTreeNodeItem = 'FLOW_TREE_NODE_ITEM_WORKFLOW'

export type FlowTreeNode = FlowTreeNodeList | FlowTreeNodeItem

// ------------------------------------------

export type EntityTreeNodeList = 'ENTITY_TREE_NODE_LIST_ENTITIES'
export type EntityTreeNodeItem = 'ENTITY_TREE_NODE_ITEM_ENTITY'

export type EntityTreeNode = EntityTreeNodeList | EntityTreeNodeItem

// ------------------------------------------

export type FilterTreeNodeList = 'FILTER_TREE_NODE_LIST_FILTERS'
export type FilterTreeNodeItem = 'FILTER_TREE_NODE_ITEM_FILTER'
export type FilterTreeNodeItemPreset = 'FILTER_TREE_NODE_ITEM_FILTER_PRESET'

export type FilterTreeNode =
  | FilterTreeNodeList
  | FilterTreeNodeItem
  | FilterTreeNodeItemPreset

// ------------------------------------------

// some specialized types

// TODO

// ------------------------------------------

// Root elements
export type TreeRootProject = 'TREE_ROOT_PROJECT'
export type TreeRootDevice = 'TREE_ROOT_DEVICE'
export type TreeRootTeam = 'TREE_ROOT_TEAM'
export type TreeRootCommunity = 'TREE_ROOT_COMMUNITY'
export type TreeRootBuiltin = 'TREE_ROOT_BUILTIN'

export type TreeRoot =
  | TreeRootProject
  | TreeRootDevice
  | TreeRootTeam
  | TreeRootCommunity
  | TreeRootBuiltin

// ------------------------------------------

// can be a file or folder
export type DeviceFileOrFolder = {
  id: string // can be the path for now
  path: string // path to the file content
  fileName: string
  sizeInBytes: number
  createdAt: string
  extension: string
  mimetype: string
  isDirectory: boolean
  items: DeviceFileOrFolder[]
}

export type DeviceCollection = {
  id: string
  name: string
  description: string
  path: string // path to the root directory (eg "~/Clapper")
  items: DeviceFileOrFolder[] // files or folders
}

// can be a file or folder
export type CommunityFileOrFolder = {
  id: string // can be the path for now (so not a uuid)
  assetUrl: string // full URL to download the content (eg. to use with wget)
  datasetName: string
  userName: string
  repository: string
  filePath: string
  fileName: string
  sizeInBytes: number
  updatedAt: string
  extension: string
  mimeType: string
  isDirectory: boolean
  isPrivate: boolean
  items: CommunityFileOrFolder[]
}

export type CommunityEntityCollection = {
  id: string // huggingface id (not a uuid)
  name: string
  description: string
  userName: string
  datasetName: string
  repository: string
  url: string
  items: ClapEntity[]
}

export type ProjectEntityCollection = {
  id: string
  name: string
  description: string
  items: ClapEntity[]
}

export type ReplicateModel = {
  id: string // let's use the slug as an ID
  // note: the API also exposes the created_at, although it is not in the types
  url: string
  label: string
  owner: string
  description: string
  thumbnailUrl: string
  version: string
  schema: Record<string, any> // will be stored as blob
  licenseUrl: string
  runs: number
}

export type ReplicateCollection = {
  id: string
  name: string
  description: string
  models: ReplicateModel[]
}

export type CivitaiModel = {
  id: string
  url: string
  label: string
  owner: string
  description: string
  thumbnailUrl: string
}

export type CivitaiCollection = {
  id: string
  name: string
  description: string
  models: CivitaiModel[]
}

export type WorkflowCollection = {
  id: string
  name: string
  description: string
  workflows: ClapWorkflow[]
}

// TODO unify this a bit, at least in the naming scheme
export type LibraryNodeFileItem = DeviceFileOrFolder | CommunityFileOrFolder

// ------------------------------------------

export type LibraryNodeType =
  | DefaultTreeNode
  | CommunityTreeNode
  | DeviceTreeNode
  | FlowTreeNode
  | EntityTreeNode
  | FilterTreeNode
  | TreeRoot

// TODO unify this a bit, at least in the naming scheme
export type TreeNodeItem =
  | ClapEntity
  | ClapSegment
  | ScreenplaySequence
  | ClapWorkflow
  | WorkflowCollection

  // TODO: if we keep them, then rename those to things like
  // ReplicateWorkflowCollection,
  // CivitaiWorkflowCollection etc
  // | ReplicateCollection
  // | ReplicateModel
  // | CivitaiCollection
  // | CivitaiModel
  | DeviceCollection
  | DeviceFileOrFolder
  | CommunityEntityCollection
  | CommunityFileOrFolder
  | Filter
  | FilterWithParams

// a model library is a collection of models
// this collection can itself include sub-models
export type LibraryTreeNode = TreeNodeType<LibraryNodeType, TreeNodeItem>
