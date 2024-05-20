import YAML from "yaml"

import { ClapHeader, ClapMeta, ClapEntity, ClapProject, ClapScene, ClapSegment, ClapFormat } from "../types"
import { getValidNumber } from "../utils/getValidNumber"
import { dataUriToBlob } from "../converters/dataUriToBlob"
import { UUID } from "@/utils/uuid"
import { buildEntityIndex } from "@/helpers/buildEntityIndex"
import { parseMediaOrientation } from "@/utils"

type StringOrBlob = string | Blob

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
export async function parseClap(src?: ClapProject | string | Blob, debug = false): Promise<ClapProject> {

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

  const maybeClapHeader = maybeArray[0] as ClapHeader

  if (maybeClapHeader.format !== ClapFormat.CLAP_0) {
    throw new Error("invalid clap file (sorry, but you can't make up version numbers like that)")
  }


  const maybeClapMeta = maybeArray[1] as ClapMeta

  const clapMeta: ClapMeta = {
    id: typeof maybeClapMeta.title === "string" ? maybeClapMeta.id : UUID(),
    title: typeof maybeClapMeta.title === "string" ? maybeClapMeta.title : "",
    description: typeof maybeClapMeta.description === "string" ? maybeClapMeta.description : "",
    synopsis: typeof maybeClapMeta.synopsis === "string" ? maybeClapMeta.synopsis : "",
    licence: typeof maybeClapMeta.licence === "string" ? maybeClapMeta.licence : "",
    orientation: parseMediaOrientation(maybeClapMeta.orientation),
    durationInMs: getValidNumber(maybeClapMeta.durationInMs, 1000, Number.MAX_SAFE_INTEGER, 4000),
    width: getValidNumber(maybeClapMeta.width, 128, 8192, 1024),
    height: getValidNumber(maybeClapMeta.height, 128, 8192, 576),
    defaultVideoModel: typeof maybeClapMeta.defaultVideoModel === "string" ? maybeClapMeta.defaultVideoModel : "SVD",
    extraPositivePrompt: Array.isArray(maybeClapMeta.extraPositivePrompt) ? maybeClapMeta.extraPositivePrompt : [],
    screenplay: typeof maybeClapMeta.screenplay === "string" ? maybeClapMeta.screenplay : "",
    isLoop: typeof maybeClapMeta.isLoop === "boolean" ? maybeClapMeta.isLoop : false,
    isInteractive: typeof maybeClapMeta.isInteractive === "boolean" ? maybeClapMeta.isInteractive : false,
  }

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


  const expectedNumberOfEntities = maybeClapHeader.numberOfEntities || 0
  const expectedNumberOfScenes = maybeClapHeader.numberOfScenes || 0
  const expectedNumberOfSegments = maybeClapHeader.numberOfSegments || 0

  // note: we assume the order is strictly enforced!
  // if you implement streaming (mix of entities and segments) you will have to rewrite this!

  const afterTheHeaders = 2
  const afterTheEntities = afterTheHeaders + expectedNumberOfEntities

  const afterTheScenes = afterTheEntities + expectedNumberOfScenes

  // note: if there are no expected entities, maybeEntities will be empty
  const maybeEntities = maybeArray.slice(afterTheHeaders, afterTheEntities) as ClapEntity[]

  // note: if there are no expected scenes, maybeScenes will be empty
  const maybeScenes = maybeArray.slice(afterTheEntities, afterTheScenes) as ClapScene[]

  const maybeSegments = maybeArray.slice(afterTheScenes) as ClapSegment[]

  const clapEntities: ClapEntity[] = maybeEntities.map(({
    id,
    category,
    triggerName,
    label,
    description,
    author,
    thumbnailUrl,
    seed,
    imagePrompt,
    imageSourceType,
    imageEngine,
    imageId,
    audioPrompt,
    audioSourceType,
    audioEngine,
    audioId,
    age,
    gender,
    region,
    appearance,
  }) => ({
    // TODO: we should verify each of those, probably
    id,
    category,
    triggerName,
    label,
    description,
    author,
    thumbnailUrl,
    seed,
    imagePrompt,
    imageSourceType,
    imageEngine,
    imageId,
    audioPrompt,
    audioSourceType,
    audioEngine,
    audioId,
    age,
    gender,
    region,
    appearance,
  }))

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
  
  const clapSegments: ClapSegment[] = maybeSegments.map(({
    id,
    track,
    startTimeInMs,
    endTimeInMs,
    category,
    entityId,
    sceneId,
    prompt,
    label,
    outputType,
    renderId,
    status,
    assetUrl,
    assetDurationInMs,
    assetSourceType,
    assetFileFormat,
    revision,
    createdAt,
    createdBy,
    editedBy,
    outputGain,
    seed,
  }) => {
    if (endTimeInMs > clapMeta.durationInMs) {
      clapMeta.durationInMs = endTimeInMs
    }
    return {
      // TODO: we should verify each of those, probably
      id,
      track,
      startTimeInMs,
      endTimeInMs,
      category,
      entityId,
      sceneId,
      prompt,
      label,
      outputType,
      renderId,
      status,
      assetUrl,
      assetDurationInMs,
      assetSourceType,
      assetFileFormat,
      revision,
      createdAt,
      createdBy,
      editedBy,
      outputGain,
      seed,
    }
  })

  if (debug) {
    console.log(`parseClap: successfully parsed ${clapEntities.length} entities, ${clapScenes.length} scenes and ${clapSegments.length} segments`)
  }

  return {
    meta: clapMeta,
    entities: clapEntities,
    entityIndex: buildEntityIndex(clapEntities),
    scenes: clapScenes,
    segments: clapSegments
  }
}
