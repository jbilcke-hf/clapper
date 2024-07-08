

// note: we only keep simplified representations of provider data structures

import { ScreenplaySequence } from "@aitube/broadway"
import { ClapEntity, ClapSegment } from "@aitube/clap"
import { TreeNodeType } from "../core/tree/types"


  // not sure if we should also sort them into data type categories,
  // as vendors like to be on multiple kind of models

  export type LibraryNodeLocalFileType =
  | "LIB_NODE_LOCAL_USER_FILE"
  | "LIB_NODE_LOCAL_USER_FOLDER"

export type LibraryNodeRemoteFileType =
  | "LIB_NODE_HUGGINGFACE_USER_FOLDER"
  | "LIB_NODE_HUGGINGFACE_USER_FILE"

export type LibraryNodeFileType =
  | LibraryNodeLocalFileType
  | LibraryNodeRemoteFileType

/**
 * a collection always correspond to the root category displayed in the tree menu
 * 
 * we could use "LIB_NODE_GENERIC_COLLECTION",
 * but I think it can also be useful to keep specific types,
 * that way we can show a custom collection UI panel on the right of the explorer
 */
export type LibraryNodeType =
  | "LIB_NODE_LOCAL_USER_COLLECTION"
  | LibraryNodeLocalFileType

  | "LIB_NODE_HUGGINGFACE_USER_COLLECTION"
  | "LIB_NODE_HUGGINGFACE_USER_DATASET"
  | LibraryNodeRemoteFileType

  | "LIB_NODE_PROJECT_COLLECTION"
  | "LIB_NODE_PROJECT_ARCHIVE"
  | "LIB_NODE_PROJECT_ASSET" // image, sound file..
  | "LIB_NODE_PROJECT_ENTITY_GENERIC"
  | "LIB_NODE_PROJECT_ENTITY_CHARACTER"
  | "LIB_NODE_PROJECT_ENTITY_LOCATION"

  | "LIB_NODE_TEAM_COLLECTION"
  | "LIB_NODE_TEAM_MODEL"

  | "LIB_NODE_COMMUNITY_COLLECTION"
  | "LIB_NODE_COMMUNITY_MODEL"

  | "LIB_NODE_HUGGINGFACE_COLLECTION"
  | "LIB_NODE_HUGGINGFACE_MODEL"

  | "LIB_NODE_REPLICATE_COLLECTION"
  | "LIB_NODE_REPLICATE_MODEL"

  | "LIB_NODE_CIVITAI_COLLECTION"
  | "LIB_NODE_CIVITAI_MODEL"

  | "LIB_NODE_GENERIC_COLLECTION"
  | "LIB_NODE_GENERIC_MODEL"
  | "LIB_NODE_GENERIC_ITEM"
  | "LIB_NODE_GENERIC_EMPTY"
  
// can be a file or folder
export type LocalUserItem = {
  id: string // can be the path for now
  path: string // path to the file content
  fileName: string
  sizeInBytes: number
  createdAt: string
  extension: string
  mimetype: string
  isDirectory: boolean
  items: LocalUserItem[]
}

export type LocalUserCollection = {
  id: string
  name: string
  description: string
  path: string // path to the root directory (eg "~/Clapper")
  items: LocalUserItem[] // files or folders
}


// can be a file or folder
export type HuggingFaceUserItem = {
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
  items: HuggingFaceUserItem[]
}

export type HuggingFaceUserCollection = {
  id: string // huggingface ud (not a uuid)
  name: string
  description: string
  userName: string
  datasetName: string
  repository: string
  url: string
  items: HuggingFaceUserItem[] // files or folders
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


// TODO unify this a bit, at least in the naming scheme
export type LibraryNodeFileItem = 
  | LocalUserItem 
  | HuggingFaceUserItem

// TODO unify this a bit, at least in the naming scheme
export type LibraryNodeItem = 
  | ClapEntity
  | ReplicateCollection | ReplicateModel
  | CivitaiCollection | CivitaiModel
  | LocalUserCollection | LocalUserItem 
  | HuggingFaceUserCollection | HuggingFaceUserItem
  | ScreenplaySequence | ClapSegment

// a model library is a collection of models
// this collection can itself include sub-models
export type LibraryTreeNode =
  TreeNodeType<
    LibraryNodeType,
    LibraryNodeItem
  >