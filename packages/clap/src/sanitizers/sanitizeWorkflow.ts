import { ClapWorkflow, ClapWorkflowCategory, ClapWorkflowEngine, ClapWorkflowProvider } from "@/types";
import { parseWorkflowCategory, parseWorkflowEngine, parseWorkflowProvider, UUID } from "@/utils";

export function sanitizeWorkflow({
    id,
    label,
    description,
    tags,
    author,
    thumbnailUrl,
    engine,
    category,
    provider,
    data,
    inputFields,
    inputValues,
  }: Partial<ClapWorkflow> = {}): ClapWorkflow {
    return {
    id: typeof id === "string" ? id : UUID(),
    label: typeof label === "string" ? label : "",
    description: typeof description === "string" ? description : "",
    tags: Array.isArray(tags) ? tags : [],
    author: typeof author === "string" ? author : "",
    thumbnailUrl: typeof thumbnailUrl === "string" ? thumbnailUrl : "",
    engine: parseWorkflowEngine(engine, ClapWorkflowEngine.DEFAULT),
    category: parseWorkflowCategory(category, ClapWorkflowCategory.IMAGE_GENERATION),
    provider: parseWorkflowProvider(provider, ClapWorkflowProvider.NONE),
    data: typeof data === "string" ? data : "",
    inputFields: Array.isArray(inputFields) ? inputFields : [],
    inputValues: typeof inputValues === "object" ? inputValues : {},
  }
}