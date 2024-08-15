import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

/**
 * Helper to find workflows by id, category, provider or engine
 *
 * @param allWorkflows
 * @param filter
 * @returns
 */
export function findWorkflows(
  allWorkflows: ClapWorkflow[],
  filter?: {
    workflowId?: string
    workflowIds?: string[]
    category?: ClapWorkflowCategory
    provider?: ClapWorkflowProvider
    engine?: ClapWorkflowEngine
  }
): {
  workflow?: ClapWorkflow
  workflows: ClapWorkflow[]
  nbWorkflows: number
  providers: Partial<Record<ClapWorkflowProvider, ClapWorkflow[]>>
  nbProviders: number
  workflowIds: Record<string, ClapWorkflow>
} {
  const workflows: ClapWorkflow[] = []
  const providers: Partial<Record<ClapWorkflowProvider, ClapWorkflow[]>> = {}
  const workflowIds: Record<string, ClapWorkflow> = {}

  for (const workflow of allWorkflows) {
    if (filter?.workflowId && workflow.id !== filter.workflowId) {
      continue
    }
    if (Array.isArray(filter?.workflowIds) && filter.workflowIds.length) {
      // TODO: replace by a hashmap
      if (!filter.workflowIds.includes(workflow.id)) {
        continue
      }
    }
    if (filter?.category && workflow.category !== filter.category) {
      continue
    }
    if (filter?.engine && workflow.engine !== filter.engine) {
      continue
    }
    if (filter?.provider && workflow.provider !== filter.provider) {
      continue
    }
    workflows.push(workflow)
    workflowIds[workflow.id] = workflow
    if (!Array.isArray(providers[workflow.provider])) {
      providers[workflow.provider] = []
    }
    providers[workflow.provider]?.push(workflow)
  }

  return {
    workflow: workflows[0],
    workflowIds,
    workflows: workflows,
    nbWorkflows: workflows.length,
    providers,
    nbProviders: Object.keys(providers).length,
  }
}
