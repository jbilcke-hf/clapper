// import { ClapSegmentCategory } from "@aitube/clap"

import { NamedEntity } from "@/types"

export const getParserItemFromLabel = (database: NamedEntity[]) => {
  
  return (label: string): NamedEntity => {
    const defaultEmptyItem: NamedEntity = {
      label: "",
      aliases: {
        en: []
      },
      prompts: {
        CHARACTER: [],
        TRANSITION: [],
        LOCATION: [],
        TIME: [],
        ERA: [],
        LIGHTING: [],
        WEATHER: [],
        ACTION: [],
        MUSIC: [],
        SOUND: [],
        DIALOGUE: [],
        STYLE: [],
        CAMERA: [],
      }
    }

    const item = database.find(item => item.label === label)

    if (!item) {
      return defaultEmptyItem
    }

    const prompts: Partial<Record<any, string[]>> =
      typeof item.prompts === "undefined" ?  defaultEmptyItem.prompts! : item.prompts

    return {
      ...defaultEmptyItem,
      prompts: {
        CHARACTER: Array.isArray(prompts?.CHARACTER) ? prompts.CHARACTER : [],
        TRANSITION: Array.isArray(prompts?.TRANSITION) ? prompts.TRANSITION : [],
        LOCATION: Array.isArray(prompts?.LOCATION) ? prompts.LOCATION : [],
        TIME: Array.isArray(prompts?.TIME) ? prompts.TIME : [],
        ERA: Array.isArray(prompts?.ERA) ? prompts.ERA : [],
        LIGHTING: Array.isArray(prompts?.LIGHTING) ? prompts.LIGHTING : [],
        WEATHER: Array.isArray(prompts?.WEATHER) ? prompts.WEATHER : [],
        ACTION: Array.isArray(prompts?.ACTION) ? prompts.ACTION : [],
        MUSIC: Array.isArray(prompts?.MUSIC) ? prompts.MUSIC : [],
        SOUND: Array.isArray(prompts?.SOUND) ? prompts.SOUND : [],
        DIALOGUE: Array.isArray(prompts?.DIALOGUE) ? prompts.DIALOGUE : [],
        STYLE: Array.isArray(prompts?.STYLE) ? prompts.STYLE : [],
        CAMERA: Array.isArray(prompts?.CAMERA) ? prompts.CAMERA : [],
      }
    }
  }
}