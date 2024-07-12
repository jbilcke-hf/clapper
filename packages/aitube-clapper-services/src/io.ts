import { ClapEntity } from "@aitube/clap"

/**
 * Describe a resource file type that has been uploaded and attached to a project
 *
 */
export type ResourceType =
| "audio"
| "video"
| "image"
| "text"
| "misc"

/**
 * Describe a resource file category that has been uploaded and attached to a project
 */
export type ResourceCategory =
  | "control_image"
  | "control_mask"
  | "character_face"
  | "character_voice"
  | "background_music"
  | "character_dialogue"
  | "text_prompt"
  | "sound"
  | "misc"


export type IOState = {
  
}

export type IOControls = {

  clear: () => void

  openFiles: (files: File[]) => Promise<void>

  openScreenplay: (projectName: string, fileName: string, fileContent: string | Blob) => Promise<void>
  openScreenplayUrl: (url: string) => Promise<void>
  saveAnyFile: (blob: Blob, fileName: string) => void
  openClapUrl: (url: string) => Promise<void>
  openClapBlob: (projectName: string, fileName: string, blob: Blob) => Promise<void>
  saveClap: () => Promise<void>
  saveVideoFile: () => Promise<void>
  saveZipFile: () => Promise<void>

  openMLT: (file: File) => Promise<void>
  saveMLT: () => Promise<void>
  generateMLT: () => Promise<string>

  openKdenline: (file: File) => Promise<void>
  saveKdenline: () => Promise<void>

  openOpenTimelineIO: (file: File) => Promise<void>
  saveOpenTimelineIO: () => Promise<void>

  saveEntitiesToClap: (entities: ClapEntity[]) => Promise<void>
  openEntitiesFromClap: (file: File) => Promise<ClapEntity[]> 
}

export type IOStore = IOState & IOControls