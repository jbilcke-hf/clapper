import { ClapOutputType } from "@/types"

export function parseOutputType(input: any, defaultToUse?: ClapOutputType): ClapOutputType {
  
  let unknownString = `${input || ""}`.trim() || (defaultToUse || ClapOutputType.TEXT)

  // the "normal" case
  if (Object.values(ClapOutputType).includes(unknownString as ClapOutputType)) {
    return unknownString as ClapOutputType
  }

  throw new Error(`unsupported output type "${unknownString}"`)
}