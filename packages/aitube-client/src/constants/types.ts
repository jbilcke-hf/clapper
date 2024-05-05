import { ClapSegmentCategory } from "@aitube/clap"

export type SupportedExportFormat = "mp4" | "webm"

export enum ClapCompletionMode {
  /**
   * the API and the client will return a full clap file.
   * This is a very convenient and simple mode, but it is also very ineficient,
   * so it should not be used for intensive applications.
   */
  FULL = "full",

  /**
   * the API and the client will return a partial clap file containing only the changes,
   * containing only the new values and changes.
   * This is useful for real-time applications and streaming.
   */
  PARTIAL = "partial",

  /**
   * the API will return a partial clap file containing only the changes,
   * and the client will return a merge of the original with the new values.
   * This is safe to run, there are no side-effects.
   */
  MERGE = "merge",

  /**
   * the API will return a partial clap file, and the client will replace the original.
   * This is the most efficient mode, but it relies on side-effects and inline object updates.
   */
  REPLACE = "replace"
}


export type ClapEntityPrompt = {
  name: string

  // eg. "character", "location"
  category: ClapSegmentCategory

  // age of the person, animal or entity (eg. robot, talking spaceship etc)
  age: string

  // characterization of the person, animal or entity (texture, hair color, gender etc)
  variant: string

  // region from where the person, animal or entity is coming from (human, mechanical, alien planet, european, south-american etc)
  region: string

  // identity picture
  identityImage: string

  // identity voice
  identityVoice: string
}