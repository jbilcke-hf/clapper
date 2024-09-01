import {
  ClapInputCategory,
  ClapInputField,
  ClapInputFields,
  ClapInputValues,
  ClapWorkflowCategory,
} from '@aitube/clap'

import { MainClapWorkflowInputsLabels } from './utils'
import { getMainInputsFromComfyUiWorkflow } from './getMainInputsFromComfyUiWorkflow'
import { ComfyUIWorkflowApiGraph } from './graph'

/**
 * Returns input fields / input values required by ComfyUi
 * @param workflow
 */
export function getInputsFromComfyUiWorkflow(
  workflowString: string,
  category: ClapWorkflowCategory
): {
  inputFields: ClapInputFields
  inputValues: ClapInputValues
} {
  const workflowGraph = ComfyUIWorkflowApiGraph.fromString(workflowString)
  const { inputFields: mainInputFields, inputValues: mainInputValues } =
    getMainInputsFromComfyUiWorkflow(workflowString, category)

  const inputValues = {
    ...mainInputValues,
  } as any

  const inputFields: ClapInputField<{
    options?: {
      id: string
      label: string
      value: any
    }[]
    tooltip?: {
      type: string
      message: string
    }
  }>[] = [
    // Required fields that should be available in the workflow, otherwise
    // Clapper doesn't know how to input its settings (prompts, dimensions, etc)
    {
      id: '@clapper/mainInputs',
      label: 'Main settings',
      type: 'group' as any,
      category: ClapInputCategory.UNKNOWN,
      description: 'Main inputs',
      defaultValue: '',
      inputFields: mainInputFields,
    },
    // Other input fields based on the workflow nodes
    {
      id: '@clapper/otherInputs',
      label: 'Node settings',
      type: 'group' as any,
      category: ClapInputCategory.UNKNOWN,
      description: 'Main inputs',
      defaultValue: '',
      inputFields: workflowGraph
        .getNodesWithInputs()
        // Discard nodes with only inputs connections
        .filter(({ id }) => workflowGraph.getInputsByNodeId(id)?.length)
        .map(({ id, _meta }) => {
          return {
            id: '@clapper/node/' + id,
            label: `${_meta?.title} (id: ${id})`,
            type: 'group' as any,
            category: ClapInputCategory.UNKNOWN,
            description: `Settings for ${_meta?.title}`,
            defaultValue: '',
            inputFields: workflowGraph.getInputsByNodeId(id)?.map((input) => {
              const mainInputKey = Object.keys(inputValues).find(
                (key) => inputValues[key]?.id == input.id
              )
              inputValues[input.id] = input.value
              return {
                id: input.id,
                label: input.name,
                type: input.type as any,
                category: ClapInputCategory.UNKNOWN,
                description: '',
                defaultValue: input.value,
                metadata: {
                  tooltip: MainClapWorkflowInputsLabels[mainInputKey as string]
                    ? {
                        type: 'warning',
                        message: `This value will be overwritten by Clapper because it is
                      used as "${MainClapWorkflowInputsLabels[mainInputKey as string]}".`,
                      }
                    : undefined,
                },
              }
            }),
          }
        }),
    },
  ]

  return {
    inputFields,
    inputValues,
  }
}
