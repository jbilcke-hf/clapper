import { ClapEntity } from "@/types";
import { sanitizeEntity } from "@/sanitizers/sanitizeEntity";

export function sanitizeEntities(maybeEntities: ClapEntity[] = []): ClapEntity[] {
  return maybeEntities.map(entity => sanitizeEntity(entity))
}