import { ClapEntity } from "@aitube/clap"

export function getCharacterPrompt(entity: ClapEntity): string {

  let characterPrompt = ""
  if (entity.description) {
    characterPrompt = [
      // the label (character name) can help making the prompt more unique
      // this might backfires however, if the name is
      // something like "SUN", "SILVER" etc
      // I'm not sure stable diffusion really needs this,
      // so let's skip it for now (might still be useful for locations, though)
      // we also want to avoid triggering "famous people" (BARBOSSA etc)
      // entity.label,

      entity.description
    ].join(", ")
  } else {
    characterPrompt = [
      entity.gender !== "object" ? entity.gender : "",
      entity.age ? `aged ${entity.age}yo` : '',
      entity.label ? `named ${entity.label}` : '',
    ].map(i => i.trim()).filter(i => i).join(", ")
  }
  return characterPrompt
}