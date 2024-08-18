import { ClapInputCategory, ClapWorkflow } from '@aitube/clap'
import { Lora } from '@/services/editors/workflow-editor/workflows/common/types'
import { defaultLoraModels } from '@/services/editors/workflow-editor/workflows/common/loras'

import { getWorkflowInputField } from './getWorkflowInputField'

export function getWorkflowLora(workflow: ClapWorkflow): Lora | undefined {
  const inputField = getWorkflowInputField(workflow, ClapInputCategory.LORA)

  if (!inputField) {
    return undefined
  }

  const loraRepoOrUrl: string = workflow.inputValues[inputField.id]

  if (!loraRepoOrUrl) {
    return undefined
  }

  const loraModel = defaultLoraModels.find((lora) => (
    lora.repoOrUrl === loraRepoOrUrl
  ))

  if (!loraModel) {
    return undefined
  }
  return loraModel
}
