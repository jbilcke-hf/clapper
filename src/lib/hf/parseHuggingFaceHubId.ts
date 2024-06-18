import { HFHubCategory } from "./types"

export function parseHuggingFaceHubId(input?: any, defaultCategory: HFHubCategory = "models"): {
  category: HFHubCategory
  owner: string
  id: string
  categoryAndOwnerAndId: string
  ownerAndId: string
} {
  let inputStr = `${input || ""}`
  
  if (inputStr.includes(".co/")) {
    inputStr = inputStr.split(".co/").pop() || ""
  } else if (inputStr.includes(".com/")) {
    inputStr = inputStr.split(".com/").pop() || ""
  }

  let parts = inputStr.split("/")
  if (parts.length < 2 || parts.length > 3) { throw new Error(`input seems invalid, cannot extract chunks`) }

  if (parts.length === 2) {
    parts = [defaultCategory, parts[0], parts[1]]
  }
  
  const [category, owner, id] = parts
  

  return {
    category: category as HFHubCategory,
    owner,
    id,
    categoryAndOwnerAndId: `${category}/${owner}/${id}`,
    ownerAndId: `${owner}/${id}`,
  }
}