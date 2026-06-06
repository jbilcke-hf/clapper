import { ClapWorkflowProvider } from "@/types"

export function parseWorkflowProvider(input: any, defaultToUse?: ClapWorkflowProvider): ClapWorkflowProvider {
    
  let unknownString = `${input || ""}`.trim()

  // Backward compatibility for workflows saved before the COMFYUI provider
  // string was corrected.
  if (unknownString === "COMFUI") {
    return ClapWorkflowProvider.COMFYUI
  }

  unknownString = unknownString.toUpperCase()

  // the "normal" case
  if (Object.values(ClapWorkflowProvider).includes(unknownString as ClapWorkflowProvider)) {
    return unknownString as ClapWorkflowProvider
  }

  let provider: ClapWorkflowProvider = defaultToUse || ClapWorkflowProvider.NONE

  return provider
}
