import { ClapInputValues, ClapWorkflow } from "@aitube/clap"

export function getWorkflowInputValues(workflow: ClapWorkflow): {
  workflowDefaultValues: ClapInputValues
  workflowValues: ClapInputValues
} {
  const workflowDefaultValues =
  workflow.inputFields.reduce(
    (acc, field) => ({
      ...acc,
      [field.id]: field.defaultValue,
    }),
    {} as ClapInputValues
  )

const workflowValues = workflow
  .inputValues as ClapInputValues

  return {
    workflowDefaultValues,
    workflowValues
  }
}