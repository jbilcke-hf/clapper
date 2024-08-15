import { ClapWorkflow } from "@/types";
import { sanitizeWorkflow } from "./sanitizeWorkflow";

export function sanitizeWorkflows(maybeWorkflows: ClapWorkflow[] = []): ClapWorkflow[] {
  return maybeWorkflows.map(workflow => sanitizeWorkflow(workflow))
}