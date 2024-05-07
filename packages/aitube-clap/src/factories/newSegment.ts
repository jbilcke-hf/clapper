import { ClapSegment } from "@/types"
import { isValidNumber } from "@/utils/isValidNumber"
import { generateSeed } from "@/utils/generateSeed"
import { UUID } from "@/utils/uuid"
import { parseSegmentCategory } from "@/utils/parseSegmentCategory"

export function newSegment(maybeSegment?: Partial<ClapSegment>) {

  const startTimeInMs =
    isValidNumber(maybeSegment?.startTimeInMs)
    ? (maybeSegment?.startTimeInMs || 0)
    : 0

  const assetDurationInMs =
    isValidNumber(maybeSegment?.assetDurationInMs)
    ? (maybeSegment?.assetDurationInMs || 0)
    : 1000

  const endTimeInMs =
    isValidNumber(maybeSegment?.endTimeInMs)
    ? (maybeSegment?.endTimeInMs || 0)
    : (startTimeInMs + assetDurationInMs)

  const segment: ClapSegment = {
    id: typeof maybeSegment?.id === "string" ? maybeSegment.id : UUID(),
    track: isValidNumber(maybeSegment?.track) ? (maybeSegment?.track || 0) : 0,
    startTimeInMs,
    endTimeInMs,
    category: parseSegmentCategory(maybeSegment?.category),
    entityId: typeof maybeSegment?.entityId === "string" ? maybeSegment.entityId : "",
    sceneId: typeof maybeSegment?.sceneId === "string" ? maybeSegment.sceneId : "",
    prompt: typeof maybeSegment?.prompt === "string" ? maybeSegment.prompt : "",
    label: typeof maybeSegment?.label === "string" ? maybeSegment.label : "",
    outputType: typeof maybeSegment?.outputType === "string" ? maybeSegment.outputType : "text",
    renderId: typeof maybeSegment?.renderId === "string" ? maybeSegment.renderId : "",
    status: typeof maybeSegment?.status === "string" ? maybeSegment.status : "to_generate",
    assetUrl: typeof maybeSegment?.assetUrl === "string" ? maybeSegment.assetUrl : "",
    assetDurationInMs,
    assetSourceType: typeof maybeSegment?.assetSourceType === "string" ? maybeSegment.assetSourceType : "EMPTY",
    createdBy: typeof maybeSegment?.createdBy === "string" ?  maybeSegment.createdBy : "ai",
    editedBy: typeof maybeSegment?.editedBy === "string" ?  maybeSegment.editedBy : "ai",
    outputGain: isValidNumber(maybeSegment?.outputGain) ? (maybeSegment?.outputGain || 0) : 0,
    seed: isValidNumber(maybeSegment?.seed) ? (maybeSegment?.seed || 0) : generateSeed()
  }

  return segment
}