import { ClapInputCategory, ClapWorkflow } from '@aitube/clap/dist/types'

export function canWorkflowUseLora(workflow: ClapWorkflow): boolean {
  return workflow.inputFields.some(
    ({ category }) => category === ClapInputCategory.LORA
    // category === ClapInputCategory.LORA_HF_MODEL ||
    // category === ClapInputCategory.LORA_WEIGHT_URL
  )
}
