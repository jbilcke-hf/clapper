import { ClapSegmentCategory } from "@aitube/clap"

export type SupportedExportFormat = "mp4" | "webm"

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