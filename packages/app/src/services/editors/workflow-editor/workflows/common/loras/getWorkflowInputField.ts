import { ClapInputCategory, ClapInputField, ClapWorkflow } from '@aitube/clap'

export function getWorkflowInputField(
  workflow: ClapWorkflow,
  category: ClapInputCategory
): ClapInputField | undefined {
  return workflow.inputFields.find((field) => field.category === category)
}
