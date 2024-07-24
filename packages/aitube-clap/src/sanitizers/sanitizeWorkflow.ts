import { ClapWorkflow, ClapWorkflowEngine } from "@/types";
import { parseWorkflowEngine, UUID } from "@/utils";

export function sanitizeWorkflow({
    id,
    label,
    description,
    tags,
    author,
    thumbnailUrl,
    engine,
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
    data: typeof data === "string" ? data : "",
    inputFields: Array.isArray(inputFields) ? inputFields : [],
    inputValues: typeof inputValues === "object" ? inputValues : {},
  }
}