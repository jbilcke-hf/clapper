import YAML from "yaml"

import { ClapFormat, ClapHeader, ClapMeta, ClapEntity, ClapScene, ClapSegment, ClapMediaOrientation, getValidNumber, UUID, ClapWorkflow, sanitizeEntities, sanitizeSegment, sanitizeWorkflows } from "@aitube/clap"
import { MovieScript, Screenplay } from "@/types"

/**
 * export a Clap blob
 * 
 * Optionally the blob can be downloaded, if we are in a browser environment
 * 
 * however, note that for some reason YAML stringify is a blocking call like for JSON,
 * they is no async version although we are now in the 20s not 90s
 * 
 * in the future we might want to use an alternative implementation of YAML
 */
export async function generateClap({
  script,
  screenplay,
  projectInfo = "",
  workflows = [],
  segments = [],
  entities = [],
  embedded = false,
}: {
  script: MovieScript
  screenplay: Screenplay
  projectInfo: string
  workflows: ClapWorkflow[]
  segments: ClapSegment[]
  entities: ClapEntity[]

  // if embedded is true, the file will be larger, as all the content,
  // image, video, audio..
  // will be embedded into it (except the last big video)
  embedded?: boolean
}): Promise<Blob> {

  const clapScenes: ClapScene[] = screenplay.sequences.flatMap(sequence => sequence.scenes)

  const clapWorkflows = sanitizeWorkflows(workflows)

  const clapEntities = sanitizeEntities(entities)

  const useCompactMode = !embedded

  // const win = (window as any)
  // win.debugJulian = segments

  let highestEndTimeInMs = 0

  const clapSegments: ClapSegment[] = segments.map(maybeSegment => {
    const segment = sanitizeSegment(maybeSegment)
    if (segment.endTimeInMs > highestEndTimeInMs) {
      highestEndTimeInMs = segment.endTimeInMs
    }
    return segment
  })

  const clapHeader: ClapHeader = {
    format: ClapFormat.CLAP_0,
    numberOfWorkflows: clapWorkflows.length,
    numberOfEntities: clapEntities.length,
    numberOfScenes: clapScenes.length,
    numberOfSegments: clapSegments.length,
  }

  const clapMeta: ClapMeta = {
    id: UUID(),
    title: script.meta.title,
    description: "",
    synopsis: "",
    licence: "",
    tags: [],
    thumbnailUrl: "",
    orientation: ClapMediaOrientation.LANDSCAPE,
    durationInMs: highestEndTimeInMs,
    isLoop: false,
    isInteractive: false,
    // TODO read this from the project config
    width: getValidNumber(1024, 256, 8192, 1024),
    height: getValidNumber(576, 256, 8192, 576),
    defaultVideoModel: "SVD",
    extraPositivePrompt: [],
    screenplay: screenplay.fullText,
  }

  const entries = [
    clapHeader,
    clapMeta,
    ...clapWorkflows,
    ...clapEntities,
    ...clapScenes,
    ...clapSegments
  ]

  const strigifiedResult = YAML.stringify(entries)

  // Convert the string to a Blob
  const blobResult = new Blob([strigifiedResult], { type: "application/x-yaml" })

   // Create a stream for the blob
   const readableStream = blobResult.stream();

   // Compress the stream using gzip
   const compressionStream = new CompressionStream('gzip');
   const compressedStream = readableStream.pipeThrough(compressionStream);

   // Create a new blob from the compressed stream
   const compressedBlob = await new Response(compressedStream).blob();

  return compressedBlob
}