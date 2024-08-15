import { ClapMeta } from "@/types";
import { getValidNumber, parseMediaOrientation, UUID } from "@/utils";

export function sanitizeMeta({
  id,
  title,
  description,
  synopsis,
  licence,
  tags,
  thumbnailUrl,
  orientation,
  durationInMs,
  width,
  height,
  defaultVideoModel,
  extraPositivePrompt,
  screenplay,
  isLoop,
  isInteractive,
}: Partial<ClapMeta> = {}): ClapMeta {
  return {
    id: typeof id === "string" ? id : UUID(),
    title: typeof title === "string" ? title : "",
    description: typeof description === "string" ? description : "",
    synopsis: typeof synopsis === "string" ? synopsis : "",
    licence: typeof licence === "string" ? licence : "",
    tags: Array.isArray(tags) ?  tags : [],
    thumbnailUrl: typeof thumbnailUrl === "string" ? thumbnailUrl : "",
    orientation: parseMediaOrientation(orientation),
    durationInMs: getValidNumber(durationInMs, 1000, Number.MAX_SAFE_INTEGER, 4000),
    width: getValidNumber(width, 128, 8192, 1024),
    height: getValidNumber(height, 128, 8192, 576),
    defaultVideoModel: typeof defaultVideoModel === "string" ? defaultVideoModel : "SVD",
    extraPositivePrompt: Array.isArray(extraPositivePrompt) ? extraPositivePrompt : [],
    screenplay: typeof screenplay === "string" ? screenplay : "",
    isLoop: typeof isLoop === "boolean" ? isLoop : false,
    isInteractive: typeof isInteractive === "boolean" ? isInteractive : false,
  }
}