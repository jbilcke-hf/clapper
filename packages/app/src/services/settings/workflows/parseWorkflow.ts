import {
  findWorkflows,
  WorkflowSearchResults,
} from '@/components/toolbars/top-menu/lists/getWorkflowProviders'
import { useWorkflowEditor } from '@/services/editors'
import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import { WorkflowEditorStore } from '@aitube/clapper-services'

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
    return maybeWorkflow
  } catch (err) {
    // console.log("error:", err)
    // MIGRATION OF OLDER SETTINGS
    // in case the user has an old version of the settings, the "workflow"
    // will be a simple ID. So we try to recover that
    const results: WorkflowSearchResults = findWorkflows(
      useWorkflowEditor.getState().availableWorkflows,
      { workflowId: input }
    )

    if (results.workflow) {
      return results.workflow
    }

    // for now let's assume we ave two cases:
    // 1. the user has an old version of the settings, and we need to migrate it
    // 2. the user has an empty
    return noWorkflow
  }
}
