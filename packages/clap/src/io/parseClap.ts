import YAML from "yaml"

import { ClapHeader, ClapMeta, ClapEntity, ClapProject, ClapScene, ClapSegment, ClapFormat, ParseClapProgressUpdate, ClapWorkflow } from "@/types"
import { dataUriToBlob } from "@/converters/dataUriToBlob"
import { buildEntityIndex } from "@/helpers/buildEntityIndex"
import { sanitizeWorkflows } from "@/sanitizers/sanitizeWorkflows"
import { sanitizeEntities } from "@/sanitizers/sanitizeEntities"
import { sanitizeSegment } from "@/sanitizers/sanitizeSegment"
import { sanitizeMeta } from "@/sanitizers/sanitizeMeta"

type StringOrBlob = string | Blob

const defaultParseClapProgressUpdate: ParseClapProgressUpdate = async () => {}

/**
 * Import a clap file from various data sources into an ClapProject
 * 
 * Inputs can be:
 * - a Clap project (which is an object)
 * - an URL to a remote .clap file
 * - a string containing a YAML array
 * - a data uri containing a gzipped YAML array
 * - a Blob containing a gzipped YAML array
 * 
 * note: it is not really async, because for some reason YAML.parse is a blocking call like for JSON,
 * there is no async version although we are now in the 20s not 90s
 */
export async function parseClap(
  src?: ClapProject | string | Blob,
  debug = false,
  onProgressUpdate: ParseClapProgressUpdate = defaultParseClapProgressUpdate
): Promise<ClapProject> {

  await onProgressUpdate({ value: 0, message: "Opening .clap file.." })

  try {
    if (
      typeof src === "object" &&
      Array.isArray( (src as any)?.scenes) &&
      Array.isArray((src as any)?.entities)
    ) {
      if (debug) {
        console.log("parseClap: input is already a Clap file, nothing to do:", src)
      }
      // we can skip verification
      return src as ClapProject
    }
  } catch (err) {
    // well, this is not a clap project
  }

  let stringOrBlob = (src || "") as StringOrBlob

  // both should work
  const dataUriHeader1 = "data:application/x-gzip;base64,"
  const dataUriHeader2 = "data:application/octet-stream;base64,"

  const inputIsString = typeof stringOrBlob === "string"
  const inputIsDataUri = typeof stringOrBlob === "string" ? stringOrBlob.startsWith(dataUriHeader1) || stringOrBlob.startsWith(dataUriHeader2) : false
  const inputIsRemoteFile = typeof stringOrBlob === "string" ? (stringOrBlob.startsWith("http://") || stringOrBlob.startsWith("https://")) : false

  let inputIsBlob = typeof stringOrBlob !== "string"

  let inputYamlArrayString = ""

  if (debug) {
    console.log(`parseClap: pre-analysis: ${JSON.stringify({
      inputIsString,
      inputIsBlob,
      inputIsDataUri,
      inputIsRemoteFile
    }, null, 2)}`)
  }

  await onProgressUpdate({ value: 10, message: "Analyzing .clap file.." })

  if (typeof stringOrBlob === "string") {
    if (debug) {
      console.log("parseClap: input is a string ", stringOrBlob.slice(0, 120))
    }
    if (inputIsDataUri) {
      if (debug) {
        console.log(`parseClap: input is a data uri archive`)
      }
      stringOrBlob = dataUriToBlob(stringOrBlob, "application/x-gzip")
      if (debug) {
        console.log(`parseClap: inputBlob = `, stringOrBlob)
      }
      inputIsBlob = true
    } else if (inputIsRemoteFile) {
      try {
        if (debug) {
          console.log(`parseClap: input is a remote .clap file`)
        }
        await onProgressUpdate({ value: 20, message: "Downloading .clap file.." })
        const res = await fetch(stringOrBlob)
        stringOrBlob = await res.blob()
        if (!stringOrBlob) { throw new Error("blob is empty") }
        inputIsBlob = true
      } catch (err) {
        // url seems invalid
        throw new Error(`failed to download the .clap file (${err})`)
      }
    } else {
      if (debug) {
        console.log("parseClap: input is a text string containing a YAML array")
      }
      inputYamlArrayString = stringOrBlob
      inputIsBlob = false
    }
  }

  if (typeof stringOrBlob !== "string" && stringOrBlob) {
    if (debug) {
      console.log("parseClap: decompressing the blob..")
    }
    // Decompress the input blob using gzip
    const decompressedStream = stringOrBlob.stream().pipeThrough(new DecompressionStream('gzip'))

    try {
      // Convert the stream to text using a Response object
      const decompressedOutput = new Response(decompressedStream)
      // decompressedOutput.headers.set("Content-Type", "application/x-gzip")
      if (debug) {
        console.log("parseClap: decompressedOutput: ", decompressedOutput)
      }

      await onProgressUpdate({ value: 30, message: "Decompressing .clap file.." })

      // const blobAgain = await decompressedOutput.blob()
      inputYamlArrayString = await decompressedOutput.text()

      if (debug && inputYamlArrayString) {
        console.log("parseClap: successfully decompressed the blob!")
      }
    } catch (err) {
      const message = `parseClap: failed to decompress (${err})`
      console.error(message)
      throw new Error(message)
    }
  }

  await onProgressUpdate({ value: 40, message: "Parsing .clap file.." })

  // we don't need this anymore I think
  // new Blob([inputStringOrBlob], { type: "application/x-yaml" })

  let maybeArray: any = {}
  try {
    if (debug) {
      console.log("parseClap: parsing the YAML array..")
    }
    // Parse YAML string to raw data
    maybeArray = YAML.parse(inputYamlArrayString)
  } catch (err) {
    throw new Error("invalid clap file (input string is not YAML)")
  }

  if (!Array.isArray(maybeArray) || maybeArray.length < 2) {
    throw new Error("invalid clap file (need a clap format header block and project metadata block)")
  }

  if (debug) {
    console.log("parseClap: the YAML seems okay, continuing decoding..")
  }


  await onProgressUpdate({ value: 50, message: "Importing data from .clap file.." })

  const maybeClapHeader = maybeArray[0] as ClapHeader

  if (maybeClapHeader.format !== ClapFormat.CLAP_0) {
    throw new Error("invalid clap file (sorry, but you can't make up version numbers like that)")
  }


  const maybeClapMeta = maybeArray[1] as ClapMeta

  const clapMeta = sanitizeMeta(maybeClapMeta)

  /*
  in case we want to support streaming (mix of entities and segments etc), we could do it this way:

  const maybeEntitiesOrSegments = rawData.slice(2)
  maybeEntitiesOrSegments.forEach((unknownElement: any) => {
    if (isValidNumber(unknownElement?.track)) {
      maybeSegments.push(unknownElement as ClapSegment)
    } else {
      maybeEntities.push(unknownElement as ClapEntity)
    }
  })
  */

  const expectedNumberOfWorkflows = maybeClapHeader.numberOfWorkflows || 0
  const expectedNumberOfEntities = maybeClapHeader.numberOfEntities || 0
  const expectedNumberOfScenes = maybeClapHeader.numberOfScenes || 0

  // unused for now, but this can of information can be used by lower-level languages eg. C
  const expectedNumberOfSegments = maybeClapHeader.numberOfSegments || 0

  // note: we assume the order is strictly enforced!
  // if you implement streaming (mix of entities and segments) you will have to rewrite this!

  const afterTheHeaders = 2

  const afterTheWorkflows = afterTheHeaders + expectedNumberOfWorkflows

  const afterTheEntities = afterTheWorkflows + expectedNumberOfEntities

  const afterTheScenes = afterTheEntities + expectedNumberOfScenes

  // note: if there are no expected workflows, maybeWorkflows will be empty
  const maybeWorkflows = maybeArray.slice(afterTheHeaders, afterTheWorkflows) as ClapWorkflow[]

  // note: if there are no expected entities, maybeEntities will be empty
  const maybeEntities = maybeArray.slice(afterTheWorkflows, afterTheEntities) as ClapEntity[]

  // note: if there are no expected scenes, maybeScenes will be empty
  const maybeScenes = maybeArray.slice(afterTheEntities, afterTheScenes) as ClapScene[]

  const maybeSegments = maybeArray.slice(afterTheScenes) as ClapSegment[]

  await onProgressUpdate({ value: 60, message: "Importing workflows from .clap file.." })
  const clapWorkflows = sanitizeWorkflows(maybeWorkflows)

  await onProgressUpdate({ value: 70, message: "Importing entities from .clap file.." })
  const clapEntities = sanitizeEntities(maybeEntities)

  await onProgressUpdate({ value: 80, message: "Importing scenes from .clap file.." })

  const clapScenes: ClapScene[] = maybeScenes.map(({
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
  await onProgressUpdate({ value: 90, message: "Importing segments from .clap file.." })

  const clapSegments: ClapSegment[] = maybeSegments.map(maybeSegment => {
    const segment = sanitizeSegment(maybeSegment)
    if (segment.endTimeInMs > clapMeta.durationInMs) {
      clapMeta.durationInMs = segment.endTimeInMs
    }
    return segment
  })

  if (debug) {
    console.log(`parseClap: successfully parsed ${clapWorkflows.length} workflows, ${clapEntities.length} entities, ${clapScenes.length} scenes and ${clapSegments.length} segments`)
  }

  await onProgressUpdate({ value: 100, message: "Buiding entity index.." })

  return {
    meta: clapMeta,
    workflows: clapWorkflows,
    entities: clapEntities,
    entityIndex: buildEntityIndex(clapEntities),
    scenes: clapScenes,
    segments: clapSegments
  }
}
