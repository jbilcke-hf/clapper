import { ClapEntity } from "@aitube/clap"

import { getCharacterPrompt } from "./getCharacterPrompt"

/**
 * Return a prompt for a "formal" picture, centered, neutral etc
 * 
 * @param entity 
 * @returns 
 */
export function getCharacterReferencePrompt(entity: ClapEntity) {
  const characterPrompt = [
    `beautiful`,
    `close-up`,
    `photo portrait`,
    `id photo`,
    getCharacterPrompt(entity),
    `neutral expression`,
    `neutral background`,
    `frontal`,
    `photo studio`,
    `crisp`,
    `sharp`,
    `intricate details`,
    `centered`,
    // `aligned`
  ].map(i => i.trim()).filter(i => i).join(", ")
  
  return characterPrompt
}