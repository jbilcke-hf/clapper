import { defaultMediaOrientation } from "@/constants/defaultValues"
import { ClapMediaOrientation } from "@/types"

export function parseMediaOrientation(input: any, defaultToUse?: ClapMediaOrientation): ClapMediaOrientation {
  
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ClapMediaOrientation).includes(unknownString as ClapMediaOrientation)) {
    return unknownString as ClapMediaOrientation
  }

  let orientation: ClapMediaOrientation = defaultToUse || defaultMediaOrientation

  unknownString = unknownString.toLowerCase()

  if (
    unknownString === "landscape" || 
    unknownString === "horizontal"
  ) {
    orientation = ClapMediaOrientation.LANDSCAPE
  }

  if (
    unknownString === "portrait" || 
    unknownString === "vertical" ||
    unknownString === "mobile"
  ) {
    orientation = ClapMediaOrientation.PORTRAIT
  }

  if (
    unknownString === "square"
  ) {
    orientation = ClapMediaOrientation.PORTRAIT
  }

  return orientation
}