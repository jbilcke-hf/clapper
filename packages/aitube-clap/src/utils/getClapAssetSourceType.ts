import { ClapAssetSource } from "@/types"

export function getClapAssetSourceType(input: string = ""): ClapAssetSource {
  
  const str = `${input || ""}`.trim()

  if (!str || !str.length) {
    return ClapAssetSource.EMPTY
  }

  if (str.startsWith("https://") || str.startsWith("http://")) {
    return ClapAssetSource.REMOTE
  }

  // note that "path" assets are potentially a security risk, they need to be treated with care
  if (str.startsWith("/") || str.startsWith("../") || str.startsWith("./")) {
    return ClapAssetSource.PATH
  }

  if (str.startsWith("data:")) {
    return ClapAssetSource.DATA
  }

  return ClapAssetSource.PROMPT
}