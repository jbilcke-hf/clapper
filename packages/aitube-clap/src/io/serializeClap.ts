import YAML from "yaml"

import { getValidNumber } from "@/utils/getValidNumber"

import { ClapHeader, ClapMeta, ClapEntity, ClapProject, ClapScene, ClapSegment, ClapFormat, ClapWorkflow, ClapWorkflowEngine } from "@/types"
import { UUID } from "@/utils/uuid"
import { parseMediaOrientation } from "@/utils/parseMediaOrientation"
import { isValidNumber, parseWorkflowEngine } from "@/utils"
import { sanitizeWorkflows } from "@/sanitizers/sanitizeWorkflows"
import { sanitizeEntities } from "@/sanitizers/sanitizeEntities"
import { sanitizeSegments } from "@/sanitizers/sanitizeSegments"
import { sanitizeMeta } from "@/sanitizers/sanitizeMeta"

export async function serializeClap({
  meta, // ClapMeta
  workflows, // ClapWorkflow[]
  entities, // ClapEntity[]
  scenes, // ClapScene[]
  segments, // ClapSegment[]
}: ClapProject): Promise<Blob> {
  
  const clapWorkflows = sanitizeWorkflows(workflows)
  const clapEntities = sanitizeEntities(entities)

  const clapScenes: ClapScene[] = scenes.map(({
    id,
    scene,
    line,
    rawLine,
    sequenceFullText,
    sequenceStartAtLine,
    sequenceEndAtLine,
    startAtLine,
    endAtLine,
    events,
  }) => ({
    id,
    scene,
    line,
    rawLine,
    sequenceFullText,
    sequenceStartAtLine,
    sequenceEndAtLine,
    startAtLine,
    endAtLine,
    events: events.map(e => e)
  }))

  const clapSegments = sanitizeSegments(segments)

  const clapHeader: ClapHeader = {
    format: ClapFormat.CLAP_0,
    numberOfWorkflows: isValidNumber(clapWorkflows?.length) ? clapWorkflows.length : 0,
    numberOfEntities: isValidNumber(clapEntities.length) ? clapEntities.length : 0,
    numberOfScenes: isValidNumber(clapScenes.length) ? clapScenes.length : 0,
    numberOfSegments: isValidNumber(clapSegments.length) ? clapSegments.length : 0,
  }

  const clapMeta = sanitizeMeta(meta)

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
   const readableStream = blobResult.stream()

   // Compress the stream using gzip
   const compressionStream = new CompressionStream('gzip')
   const compressedStream = readableStream.pipeThrough(compressionStream)

   // Create a new blob from the compressed stream
   const response = new Response(compressedStream)
   
   response.headers.set("Content-Type", "application/x-gzip")

   const compressedBlob = await response.blob()

  return compressedBlob
}