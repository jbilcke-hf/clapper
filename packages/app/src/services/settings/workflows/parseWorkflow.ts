import { convertComfyUiWorkflowApiToClapWorkflow } from '@/app/api/resolve/providers/comfyui/utils'

import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

export function parseWorkflow(
  input: string,
  category: ClapWorkflowCategory
): ClapWorkflow {
  const noWorkflow: ClapWorkflow = {
    id: `empty://${category}`,
    label: 'No workflow',
    description: '',
    tags: [],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.DEFAULT,
    category,
    provider: ClapWorkflowProvider.NONE,
    data: '',
    schema: '',
    inputFields: [],
    inputValues: {},
  }

  // console.log("parseWorkflow:", { input })

  try {
    const maybeWorkflow =
      typeof input === 'string'
        ? (JSON.parse(input) as ClapWorkflow)
        : (input as ClapWorkflow) // fallback in case some users had a bad version which didn't serialize to JSON
    // console.log("maybeWorkflow:", { maybeWorkflow })
    const looksValid =
      typeof maybeWorkflow?.id === 'string' &&
      typeof maybeWorkflow?.label === 'string' &&
      typeof maybeWorkflow?.description === 'string' &&
      typeof maybeWorkflow?.author === 'string' &&
      typeof maybeWorkflow?.thumbnailUrl === 'string' &&
      typeof maybeWorkflow?.data === 'string' &&
      Array.isArray(maybeWorkflow?.inputFields) &&
      typeof maybeWorkflow?.inputValues === 'object'
    if (!looksValid) {
      throw new Error(`the workflow data seems invalid`)
    }
    if (maybeWorkflow.engine == ClapWorkflowEngine.COMFYUI_WORKFLOW) {
      // The `data` comfyui workflow doesn't have info about custom
      // inputFields/inputValues, it gets only the default ones based on the nodes
      const {
        inputFields: defaultInputFields,
        inputValues: defaultInputValues,
      } = convertComfyUiWorkflowApiToClapWorkflow(maybeWorkflow.data)
      // Use the already existing inputFields/inputValues, otherwise use the default
      // ones based on the raw comfyui workflow data
      maybeWorkflow.inputFields =
        maybeWorkflow.inputFields || defaultInputFields
      maybeWorkflow.inputValues =
        maybeWorkflow.inputValues || defaultInputValues
    }
    return maybeWorkflow
  } catch (err) {
    return noWorkflow
  }
}
