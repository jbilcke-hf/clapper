import { ClapEntity } from "@aitube/clap"

export function getCharacterPrompt(entity: ClapEntity): string {
  const characterPrompt = [
    entity.age ? `${entity.age}yo` : '', // 34yo
    entity.region ? `${entity.region}` : '', // american
    entity.gender !== "object" ? entity.gender : 'person', // woman
    entity.label ? `named ${entity.label}` : '', // Jessica
    entity.appearance ? `${entity.appearance}` : 'speaking', // blond hair
    // entity.description ? `${entity.description}` : '', // blond hair
  ].map(i => i.trim()).filter(i => i).join(" ").trim()

  return characterPrompt
}