import { ClapWorkflowProvider } from "@/types"

export function parseWorkflowProvider(input: any, defaultToUse?: ClapWorkflowProvider): ClapWorkflowProvider {
    
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ClapWorkflowProvider).includes(unknownString as ClapWorkflowProvider)) {
    return unknownString as ClapWorkflowProvider
  }

  let provider: ClapWorkflowProvider = defaultToUse || ClapWorkflowProvider.NONE

  return provider
}