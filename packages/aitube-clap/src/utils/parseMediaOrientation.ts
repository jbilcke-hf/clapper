import { defaultMediaOrientation } from "@/constants/defaultValues"
import { ClapMediaOrientation } from "@/types"

export function parseMediaOrientation(input: any, defaultToUse?: ClapMediaOrientation): ClapMediaOrientation {
  
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ClapMediaOrientation).includes(unknownString as ClapMediaOrientation)) {
    return unknownString as ClapMediaOrientation
  }

  let orientation: ClapMediaOrientation = defaultToUse || defaultMediaOrientation

  unknownString = unknownString.toUpperCase()

  if (
    unknownString === "LANDSCAPE" || 
    unknownString === "HORIZONTAL"
  ) {
    orientation = ClapMediaOrientation.LANDSCAPE
  }

  if (
    unknownString === "PORTRAIT" || 
    unknownString === "VERTICAL" ||
    unknownString === "MOBILE"
  ) {
    orientation = ClapMediaOrientation.PORTRAIT
  }

  if (
    unknownString === "SQUARE"
  ) {
    orientation = ClapMediaOrientation.PORTRAIT
  }

  return orientation
}