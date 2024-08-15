import { ClapWorkflow, ClapWorkflowCategory, ClapWorkflowEngine, ClapWorkflowProvider } from "@/types"
import { parseWorkflowCategory, parseWorkflowEngine, parseWorkflowProvider } from "@/utils"
import { UUID } from "@/utils/uuid"

export function newWorkflow(maybeWorkflow?: Partial<ClapWorkflow>) {

  const workflow: ClapWorkflow = {
    id: typeof maybeWorkflow?.id === "string" ? maybeWorkflow.id : UUID(),
    label: typeof maybeWorkflow?.label === "string" ? maybeWorkflow.label : "",
    description: typeof maybeWorkflow?.description === "string" ? maybeWorkflow.description : "",
    tags: Array.isArray(maybeWorkflow?.tags) ? maybeWorkflow?.tags : [],
    author: typeof maybeWorkflow?.author === "string" ? maybeWorkflow.author : "",
    thumbnailUrl: typeof maybeWorkflow?.thumbnailUrl === "string" ? maybeWorkflow.thumbnailUrl : "",
    engine: parseWorkflowEngine(maybeWorkflow?.engine, ClapWorkflowEngine.DEFAULT),
    category: parseWorkflowCategory(maybeWorkflow?.category, ClapWorkflowCategory.IMAGE_GENERATION),
    provider: parseWorkflowProvider(maybeWorkflow?.provider, ClapWorkflowProvider.NONE),
    data: typeof maybeWorkflow?.data === "string" ? maybeWorkflow.data : "",
    inputFields: Array.isArray(maybeWorkflow?.inputFields) ? maybeWorkflow.inputFields : [],
    inputValues: typeof maybeWorkflow?.inputValues === "object" ? maybeWorkflow.inputValues : {},
  }

  return workflow
}
