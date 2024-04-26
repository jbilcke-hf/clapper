import { ClapAssetSource } from "@/types"

export function getClapAssetSourceType(input: string = ""): ClapAssetSource {
  
  const str = `${input || ""}`.trim()

  if (!str || !str.length) {
    return "EMPTY"
  }

  if (str.startsWith("https://") || str.startsWith("http://")) {
    return "REMOTE"
  }

  // note that "path" assets are potentially a security risk, they need to be treated with care
  if (str.startsWith("/") || str.startsWith("../") || str.startsWith("./")) {
    return "PATH"
  }

  if (str.startsWith("data:")) {
    return "DATA"
  }

  return "PROMPT"
}