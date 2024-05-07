import { ClapMeta, ClapEntity, ClapProject, ClapScene, ClapSegment } from "@/types"
import { getValidNumber } from "@/utils/getValidNumber"
import { UUID } from "@/utils/uuid"
import { buildEntityIndex } from "@/helpers/buildEntityIndex"
import { parseMediaOrientation } from "@/utils"

// generate an empty clap file, or copy one from a source
export function newClap(clap: {
    meta?: Partial<ClapMeta>
    entities?: ClapEntity[]
    scenes?: ClapScene[]
    segments?: ClapSegment[]
  } = {}): ClapProject {

  const meta: ClapMeta = {
    id: clap?.meta?.id === "string" ? clap.meta.id : UUID(),
    title: clap?.meta?.title === "string" ? clap.meta.title : "",
    description: typeof clap?.meta?.description === "string" ? clap.meta.description : "",
    synopsis: typeof clap?.meta?.synopsis === "string" ? clap.meta.synopsis : "",
    licence: typeof clap?.meta?.licence === "string" ? clap.meta.licence : "",
    orientation: parseMediaOrientation(clap?.meta?.orientation),
    durationInMs: getValidNumber(clap?.meta?.durationInMs, 1000, Number.MAX_SAFE_INTEGER, 4000),
    width: getValidNumber(clap?.meta?.width, 256, 8192, 1024),
    height: getValidNumber(clap?.meta?.height, 256, 8192, 576),
    defaultVideoModel: typeof clap?.meta?.defaultVideoModel === "string" ? clap.meta.defaultVideoModel : "SVD",
    extraPositivePrompt: Array.isArray(clap?.meta?.extraPositivePrompt) ? clap.meta.extraPositivePrompt : [],
    screenplay: typeof clap?.meta?.screenplay === "string" ? clap.meta.screenplay : "",
    isLoop: typeof clap?.meta?.isLoop === "boolean" ? clap.meta.isLoop : false,
    isInteractive: typeof clap?.meta?.isInteractive === "boolean" ? clap.meta.isInteractive : false,
  }

  const entities: ClapEntity[] = clap?.entities && Array.isArray(clap.entities) ? clap.entities : []
  const scenes: ClapScene[] =  clap?.scenes && Array.isArray(clap.scenes) ? clap.scenes : []
  const segments: ClapSegment[] =  clap?.segments && Array.isArray(clap.segments) ? clap.segments : []
  const entityIndex = buildEntityIndex(entities)

  return { meta, entities, entityIndex, scenes, segments }
}
