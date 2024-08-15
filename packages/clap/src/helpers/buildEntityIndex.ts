import { ClapEntity } from "@/types"

export function buildEntityIndex(entities: ClapEntity[] = []): Record<string, ClapEntity> {
  const index: Record<string, ClapEntity> = {}
  for (const entity of entities) {
    index[entity.id] = entity
  }
  return index 
}