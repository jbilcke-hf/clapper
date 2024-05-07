import { ClapAssetSource, ClapEntity, ClapEntityAppearance, ClapEntityAudioEngine, ClapEntityGender, ClapEntityRegion, ClapSegmentCategory } from "@/types"
import { generateSeed } from "@/utils/generateSeed"
import { isValidNumber } from "@/utils/isValidNumber"
import { parseSegmentCategory } from "@/utils/parseSegmentCategory"
import { UUID } from "@/utils/uuid"

export function newEntity(maybeEntity?: Partial<ClapEntity>) {

  const entity: ClapEntity = {
    id: typeof maybeEntity?.id === "string" ? maybeEntity.id : UUID(),
    category: parseSegmentCategory(maybeEntity?.category, ClapSegmentCategory.CHARACTER),
    triggerName: typeof maybeEntity?.triggerName === "string" ? maybeEntity.triggerName : "",
    label: typeof maybeEntity?.label === "string" ? maybeEntity.label : "",
    description: typeof maybeEntity?.description === "string" ? maybeEntity.description : "",
    author: typeof maybeEntity?.author === "string" ? maybeEntity.author : "",
    thumbnailUrl: typeof maybeEntity?.thumbnailUrl === "string" ? maybeEntity.thumbnailUrl : "",
    seed: isValidNumber(maybeEntity?.seed) ? (maybeEntity?.seed || 0) : generateSeed(),
   
    imagePrompt: typeof maybeEntity?.imagePrompt === "string" ? maybeEntity.imagePrompt : "",
    imageSourceType: typeof maybeEntity?.imageSourceType === "string" ? (maybeEntity.imageSourceType as ClapAssetSource) : "EMPTY",
    imageEngine: typeof maybeEntity?.imageEngine === "string" ? maybeEntity.imageEngine : "", 
    imageId: typeof maybeEntity?.imageId === "string" ? maybeEntity.imageId : "",
    audioPrompt: typeof maybeEntity?.audioPrompt === "string" ? maybeEntity.audioPrompt : "",
    audioSourceType: typeof maybeEntity?.audioSourceType === "string" ? (maybeEntity.audioSourceType as ClapAssetSource) : "EMPTY",
    audioEngine: typeof maybeEntity?.audioEngine === "string" ? (maybeEntity.audioEngine as ClapEntityAudioEngine) : "Parler-TTS",
    audioId: typeof maybeEntity?.audioId === "string" ? maybeEntity.audioId : "",

    // those are only used by certain types of entities
    age:  isValidNumber(maybeEntity?.age) ? (maybeEntity?.age || 0) : 25,

    // TODO find a way to validate those, using lists
    // TODO: we are going to use `variant: ClapEntityVariant` instead, which is gonna be an arbitrary string
    gender: typeof maybeEntity?.gender === "string" ? (maybeEntity.gender as ClapEntityGender) : "object",
    region: typeof maybeEntity?.region === "string" ? (maybeEntity.region as ClapEntityRegion) : "global",
    appearance: typeof maybeEntity?.appearance === "string" ? (maybeEntity.appearance as ClapEntityAppearance) : "neutral",
  }

  return entity
}
