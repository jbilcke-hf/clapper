import { ClapSegmentStatus } from "@/types"

export function parseSegmentStatus(input: any, defaultStatus?: ClapSegmentStatus): ClapSegmentStatus {
  
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ClapSegmentStatus).includes(unknownString as ClapSegmentStatus)) {
    return unknownString as ClapSegmentStatus
  }

  let status: ClapSegmentStatus = defaultStatus || ClapSegmentStatus.TO_GENERATE

  unknownString = unknownString.toLowerCase()

  if (unknownString === "to_generate") {
    status = ClapSegmentStatus.TO_GENERATE
  }
  else if (unknownString === "to_interpolate") {
    status = ClapSegmentStatus.TO_INTERPOLATE
  }
  else if (unknownString === "to_upscale") {
    status = ClapSegmentStatus.TO_UPSCALE
  }
  else if (unknownString === "completed") {
    status = ClapSegmentStatus.COMPLETED
  } else {
    status = ClapSegmentStatus.ERROR
  }
  return status
}