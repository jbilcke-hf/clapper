import { ClapMeta } from "@/types";
import { getValidNumber, parseImageRatio, UUID } from "@/utils";

export function sanitizeMeta({
  id,
  title,
  description,
  synopsis,
  licence,
  tags,
  thumbnailUrl,
  durationInMs,
  width,
  height,
  imageRatio,
  imagePrompt,
  systemPrompt,
  storyPrompt,
  isLoop,
  isInteractive,
  bpm,
  frameRate,

   // old fields from an older version of the file format
  orientation,
  extraPositivePrompt,
  screenplay
}: Partial<ClapMeta> & {
  // old fields from an older version of the file format
  orientation?: 'LANDSCAPE' | 'PORTRAIT' | 'SQUARE'
  extraPositivePrompt?: string[]
  screenplay?: string
} = {}): ClapMeta {
  return {
    id: typeof id === "string" ? id : UUID(),
    title: typeof title === "string" ? title : "",
    description: typeof description === "string" ? description : "",
    synopsis: typeof synopsis === "string" ? synopsis : "",
    licence: typeof licence === "string" ? licence : "",
    tags: Array.isArray(tags) ?  tags : [],
    thumbnailUrl: typeof thumbnailUrl === "string" ? thumbnailUrl : "",
    imageRatio: parseImageRatio(imageRatio || orientation),
    durationInMs: getValidNumber(durationInMs, 1000, Number.MAX_SAFE_INTEGER, 4000),
    width: getValidNumber(width, 128, 8192, 1024),
    height: getValidNumber(height, 128, 8192, 576),
    imagePrompt:
      typeof imagePrompt === "string" && imagePrompt.length > 0 ? imagePrompt :

      // we upgrade previous versions
      Array.isArray(extraPositivePrompt) ? extraPositivePrompt.join(', ') : '',

    systemPrompt:
      typeof systemPrompt === "string" && systemPrompt.length > 0 ? systemPrompt : '',

    storyPrompt:
      typeof storyPrompt === "string" && storyPrompt.length > 0 ? storyPrompt

      // we upgrade previous versions
      : typeof screenplay === "string" ? screenplay : "",

    isLoop: typeof isLoop === "boolean" ? isLoop : false,
    isInteractive: typeof isInteractive === "boolean" ? isInteractive : false,

    bpm: getValidNumber(bpm, 1, 500, 120),

    /* Number of frames per second
    * 
    * 24 FPS: standard for most movies and streaming video content
    * 25 FPS (UK & Europe) and 30 FPS (the US & elsewhere): standard frame rate for TV video
    * 
    */
    frameRate: getValidNumber(frameRate, 1, 1000, 24),
  }
}