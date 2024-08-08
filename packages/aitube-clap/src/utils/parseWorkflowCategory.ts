import { ClapWorkflowCategory } from "@/types"

export function parseWorkflowCategory(input: any, defaultToUse?: ClapWorkflowCategory): ClapWorkflowCategory {
    
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ClapWorkflowCategory).includes(unknownString as ClapWorkflowCategory)) {
    return unknownString as ClapWorkflowCategory
  }

  let category: ClapWorkflowCategory = defaultToUse || ClapWorkflowCategory.IMAGE_GENERATION

  return category
}