
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
  openFiles: (files: File[]) => Promise<void>

  saveAnyFile: (blob: Blob, fileName: string) => void
  openClapUrl: (url: string) => Promise<void>
  saveClap: () => Promise<void>
  saveVideoFile: () => Promise<void>

  openMLT: (file: File) => Promise<void>
  saveMLT: () => Promise<void>

  openKdenline: (file: File) => Promise<void>
  saveKdenline: () => Promise<void>

  openOpenTimelineIO: (file: File) => Promise<void>
  saveOpenTimelineIO: () => Promise<void>
}

export type IOStore =
  IOState &
  IOControls