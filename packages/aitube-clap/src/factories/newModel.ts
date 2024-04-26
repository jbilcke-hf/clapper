import { ClapAssetSource, ClapModel, ClapModelAppearance, ClapModelAudioEngine, ClapModelGender, ClapModelRegion, ClapSegmentCategory } from "@/types"
import { generateSeed } from "@/utils/generateSeed"
import { isValidNumber } from "@/utils/isValidNumber"
import { UUID } from "@/utils/uuid"

export function newModel(maybeModel?: Partial<ClapModel>) {

  const model: ClapModel = {
    id: typeof maybeModel?.id === "string" ? maybeModel.id : UUID(),
    category: typeof maybeModel?.category === "string" ? (maybeModel.category as ClapSegmentCategory) : "character",
    triggerName: typeof maybeModel?.triggerName === "string" ? maybeModel.triggerName : "",
    label: typeof maybeModel?.label === "string" ? maybeModel.label : "",
    description: typeof maybeModel?.description === "string" ? maybeModel.description : "",
    author: typeof maybeModel?.author === "string" ? maybeModel.author : "",
    thumbnailUrl: typeof maybeModel?.thumbnailUrl === "string" ? maybeModel.thumbnailUrl : "",
    seed: isValidNumber(maybeModel?.seed) ? (maybeModel?.seed || 0) : generateSeed(),
   
    imagePrompt: typeof maybeModel?.imagePrompt === "string" ? maybeModel.imagePrompt : "",
    imageSourceType: typeof maybeModel?.imageSourceType === "string" ? (maybeModel.imageSourceType as ClapAssetSource) : "EMPTY",
    imageEngine: typeof maybeModel?.imageEngine === "string" ? maybeModel.imageEngine : "", 
    imageId: typeof maybeModel?.imageId === "string" ? maybeModel.imageId : "",
    audioPrompt: typeof maybeModel?.audioPrompt === "string" ? maybeModel.audioPrompt : "",
    audioSourceType: typeof maybeModel?.audioSourceType === "string" ? (maybeModel.audioSourceType as ClapAssetSource) : "EMPTY",
    audioEngine: typeof maybeModel?.audioEngine === "string" ? (maybeModel.audioEngine as ClapModelAudioEngine) : "Parler-TTS",
    audioId: typeof maybeModel?.audioId === "string" ? maybeModel.audioId : "",

    // those are only used by certain types of models
    age:  isValidNumber(maybeModel?.age) ? (maybeModel?.age || 0) : 25,

    // TODO find a way to validate those, using lists
    gender: typeof maybeModel?.gender === "string" ? (maybeModel.gender as ClapModelGender) : "object",
    region: typeof maybeModel?.region === "string" ? (maybeModel.region as ClapModelRegion) : "global",
    appearance: typeof maybeModel?.appearance === "string" ? (maybeModel.appearance as ClapModelAppearance) : "neutral",
  }

  return model
}
