import { ClapOutputType } from "@/types"

export function parseOutputType(input: any, defaultToUse?: ClapOutputType): ClapOutputType {
    
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ClapOutputType).includes(unknownString as ClapOutputType)) {
    return unknownString as ClapOutputType
  }

  let output: ClapOutputType = defaultToUse || ClapOutputType.TEXT

  // sometimes we want to use a LLM to generate the categories,
  // but those aren't very precise and can hallucinate
  // for instance they like to use plural
  // so we need to be a bit flexible in how we detect those

  unknownString = unknownString.toUpperCase()

  if (unknownString === "TEXT") {
    output = ClapOutputType.TEXT
  }
  else if (unknownString === "ANIMATION") {
    output = ClapOutputType.ANIMATION
  }
  else if (unknownString === "INTERFACE") {
    output = ClapOutputType.INTERFACE
  }
  else if (unknownString === "EVENT") {
    output = ClapOutputType.EVENT
  }
  else if (unknownString === "PHENOMENON") {
    output = ClapOutputType.PHENOMENON
  }
  else if (unknownString === "TRANSITION") {
    output = ClapOutputType.TRANSITION
  }
  else if (unknownString === "IMAGE") {
    output = ClapOutputType.IMAGE
  }
  else if (unknownString === "IMAGE_SEGMENTATION") {
    output = ClapOutputType.IMAGE_SEGMENTATION
  }
  else if (unknownString === "IMAGE_DEPTH") {
    output = ClapOutputType.IMAGE_DEPTH
  }
  else if (unknownString === "VIDEO") {
    output = ClapOutputType.VIDEO
  }
  else if (unknownString === "VIDEO_SEGMENTATION") {
    output = ClapOutputType.VIDEO_SEGMENTATION
  }
  else if (unknownString === "VIDEO_DEPTH") {
    output = ClapOutputType.VIDEO_DEPTH
  }
  else if (unknownString === "AUDIO") {
    output = ClapOutputType.AUDIO
  }
  return output
}