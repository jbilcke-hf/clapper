import { ClapWorkflow } from "@/types";
import { sanitizeWorkflow } from "@/sanitizers/sanitizeWorkflow";

export function sanitizeWorkflows(maybeWorkflows: ClapWorkflow[] = []): ClapWorkflow[] {
  return maybeWorkflows.map(workflow => sanitizeWorkflow(workflow))
}