import { ClapMeta, ClapEntity, ClapProject, ClapScene, ClapSegment, ClapWorkflow } from "@/types"
import { buildEntityIndex } from "@/helpers/buildEntityIndex"
import { sanitizeMeta } from "@/sanitizers/sanitizeMeta"
import { sanitizeWorkflows } from "@/sanitizers/sanitizeWorkflows"
import { sanitizeEntities } from "@/sanitizers/sanitizeEntities"
import { sanitizeSegments } from "@/sanitizers/sanitizeSegments"

// generate an empty clap file, or copy one from a source
export function newClap(clap: {
    meta?: Partial<ClapMeta>
    workflows?: ClapWorkflow[]
    entities?: ClapEntity[]
    scenes?: ClapScene[]
    segments?: ClapSegment[]
  } = {}): ClapProject {

  const meta = sanitizeMeta(clap?.meta)

  const workflows: ClapWorkflow[] =  clap?.workflows && Array.isArray(clap.workflows) ? sanitizeWorkflows(clap.workflows) : []
  const entities: ClapEntity[] = clap?.entities && Array.isArray(clap.entities) ? sanitizeEntities(clap.entities) : []
  const scenes: ClapScene[] =  clap?.scenes && Array.isArray(clap.scenes) ? clap.scenes : []
  const segments: ClapSegment[] =  clap?.segments && Array.isArray(clap.segments) ? sanitizeSegments(clap.segments) : []
  const entityIndex = buildEntityIndex(entities)

  return { meta, workflows, entities, entityIndex, scenes, segments }
}
