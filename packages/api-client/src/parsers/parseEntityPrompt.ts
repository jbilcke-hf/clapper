

import { ClapEntityPrompt } from "@/constants/types"

import { parseString } from "./parseString"
import { ClapSegmentCategory } from "@aitube/clap"

export function parseEntityPrompt(entityPrompt: Partial<ClapEntityPrompt> = {}): ClapEntityPrompt {

  return {
    name: parseString(entityPrompt?.name),

    category: parseString(entityPrompt?.category) as ClapSegmentCategory,

    // age of the person, animal or entity (eg. robot, talking spaceship etc)
    age: parseString(entityPrompt?.age),

    // characterization of the person, animal or entity (texture, hair color, gender etc)
    variant: parseString(entityPrompt?.variant),

    // region from where the person, animal or entity is coming from (human, mechanical, alien planet, european, south-american etc)
    region: parseString(entityPrompt?.region),

    // identity picture
    identityImage: parseString(entityPrompt?.identityImage),

    // identity voice
    identityVoice: parseString(entityPrompt?.identityVoice),
  }
}