import { ClapSegmentCategory } from "@aitube/clap"

import { NamedEntity } from "@/types"

export const getParserItemFromLabel = (database: NamedEntity[]) => {
  
  return (label: string): NamedEntity => {
    const defaultEmptyItem: NamedEntity = {
      label: "",
      aliases: {
        en: []
      },
      prompts: {
        character: [],
        transition: [],
        location: [],
        time: [],
        era: [],
        lighting: [],
        weather: [],
        action: [],
        music: [],
        sound: [],
        dialogue: [],
        style: [],
        camera: [],
      }
    }

    const item = database.find(item => item.label === label)

    if (!item) {
      return defaultEmptyItem
    }

    const prompts: Partial<Record<ClapSegmentCategory, string[]>> =
      typeof item.prompts === "undefined" ?  defaultEmptyItem.prompts! : item.prompts

    return {
      ...defaultEmptyItem,
      prompts: {
        character: Array.isArray(prompts?.character) ? prompts.character : [],
        transition: Array.isArray(prompts?.transition) ? prompts.transition : [],
        location: Array.isArray(prompts?.location) ? prompts.location : [],
        time: Array.isArray(prompts?.time) ? prompts.time : [],
        era: Array.isArray(prompts?.era) ? prompts.era : [],
        lighting: Array.isArray(prompts?.lighting) ? prompts.lighting : [],
        weather: Array.isArray(prompts?.weather) ? prompts.weather : [],
        action: Array.isArray(prompts?.action) ? prompts.action : [],
        music: Array.isArray(prompts?.music) ? prompts.music : [],
        sound: Array.isArray(prompts?.sound) ? prompts.sound : [],
        dialogue: Array.isArray(prompts?.dialogue) ? prompts.dialogue : [],
        style: Array.isArray(prompts?.style) ? prompts.style : [],
        camera: Array.isArray(prompts?.camera) ? prompts.camera : [],
      }
    }
  }
}