import { defaultImageRatio } from "@/constants/defaultValues"
import { ClapImageRatio } from "@/types"

export function parseImageRatio(input: any, defaultToUse?: ClapImageRatio): ClapImageRatio {
  
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ClapImageRatio).includes(unknownString as ClapImageRatio)) {
    return unknownString as ClapImageRatio
  }

  let imageRatio: ClapImageRatio = defaultToUse || defaultImageRatio

  unknownString = unknownString.toUpperCase()

  if (
    unknownString === "16:9" || 
    unknownString === "LANDSCAPE" || 
    unknownString === "HORIZONTAL"
  ) {
    imageRatio = ClapImageRatio.LANDSCAPE
  }

  if (
    unknownString === "9:16" || 
    unknownString === "PORTRAIT" || 
    unknownString === "VERTICAL" ||
    unknownString === "MOBILE"
  ) {
    imageRatio = ClapImageRatio.PORTRAIT
  }

  if (
    unknownString === "1:1" ||
    unknownString === "SQUARE"
  ) {
    imageRatio = ClapImageRatio.PORTRAIT
  }

  return imageRatio
}