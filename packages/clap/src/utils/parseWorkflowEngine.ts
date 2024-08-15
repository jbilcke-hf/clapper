import { ClapWorkflowEngine } from "@/types"

export function parseWorkflowEngine(input: any, defaultToUse?: ClapWorkflowEngine): ClapWorkflowEngine {
    
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ClapWorkflowEngine).includes(unknownString as ClapWorkflowEngine)) {
    return unknownString as ClapWorkflowEngine
  }

  let engine: ClapWorkflowEngine = defaultToUse || ClapWorkflowEngine.DEFAULT

  // sometimes we want to use a LLM to generate the categories,
  // but those aren't very precise and can hallucinate
  // for instance they like to use plural
  // so we need to be a bit flexible in how we detect those

  unknownString = unknownString.toUpperCase()

  if (unknownString === "DEFAULT") {
    engine = ClapWorkflowEngine.DEFAULT
  }
  else if (unknownString === "COMFYUI_WORKFLOW") {
    engine = ClapWorkflowEngine.COMFYUI_WORKFLOW
  }
  else if (unknownString === "FALAI_WORKFLOW") {
    engine = ClapWorkflowEngine.FALAI_WORKFLOW
  }
  else if (unknownString === "GLIF_WORKFLOW") {
    engine = ClapWorkflowEngine.GLIF_WORKFLOW
  }
  else if (unknownString === "VISUALBLOCKS_WORKFLOW") {
    engine = ClapWorkflowEngine.VISUALBLOCKS_WORKFLOW
  }
  return engine
}