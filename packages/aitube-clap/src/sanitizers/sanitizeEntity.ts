import { ClapAssetSource, ClapEntity, ClapEntityAppearance, ClapEntityAudioEngine, ClapEntityGender, ClapEntityRegion } from "@/types";
import { generateSeed, isValidNumber, parseSegmentCategory, UUID } from "@/utils";

export function sanitizeEntity({
    id,
    category,
    triggerName,
    label,
    description,
    tags,
    author,
    thumbnailUrl,
    seed,
    imagePrompt,
    imageSourceType,
    imageEngine,
    imageId,
    audioPrompt,
    audioSourceType,
    audioEngine,
    audioId,
    age,
    gender,
    region,
    appearance,
  }: Partial<ClapEntity> = {}): ClapEntity {
    return {
    id: typeof id === "string" ? id : UUID(),
    category: parseSegmentCategory(category),
    triggerName: typeof triggerName === "string" ? triggerName : "",
    label: typeof label === "string" ? label : "",
    description: typeof description === "string" ? description : "",
    tags: Array.isArray(tags) ? tags : [],
    author: typeof author === "string" ? author : "",
    thumbnailUrl: typeof thumbnailUrl === "string" ? thumbnailUrl : "",
    seed: isValidNumber(seed) ? (seed || 0) : generateSeed(),
    imagePrompt: typeof imagePrompt === "string" ? imagePrompt : "",
    imageSourceType: typeof imageSourceType === "string" ? (imageSourceType as ClapAssetSource) : ClapAssetSource.EMPTY,
    imageEngine: typeof imageEngine === "string" ? imageEngine : "", 
    imageId: typeof imageId === "string" ? imageId : "",
    audioPrompt: typeof audioPrompt === "string" ? audioPrompt : "",
    audioSourceType: typeof audioSourceType === "string" ? (audioSourceType as ClapAssetSource) : ClapAssetSource.EMPTY,
    audioEngine: typeof audioEngine === "string" ? (audioEngine as ClapEntityAudioEngine) : "Parler-TTS",
    audioId: typeof audioId === "string" ? audioId : "",
    // those are only used by certain types of entities
    age:  isValidNumber(age) ? (age || 0) : 25,

    // TODO find a way to validate those, using lists
    // TODO: we are going to use `variant: ClapEntityVariant` instead, which is gonna be an arbitrary string
    gender: typeof gender === "string" ? (gender as ClapEntityGender) : "object",
    region: typeof region === "string" ? (region as ClapEntityRegion) : "global",
    appearance: typeof appearance === "string" ? (appearance as ClapEntityAppearance) : "neutral",
  }
}