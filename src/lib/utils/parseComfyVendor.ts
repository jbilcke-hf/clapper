import { ComfyVendor } from "@/types"

export function parseComfyVendor(input: any, defaultVendor?: ComfyVendor): ComfyVendor {
  
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ComfyVendor).includes(unknownString as ComfyVendor)) {
    return unknownString as ComfyVendor
  }

  let vendor: ComfyVendor = defaultVendor || ComfyVendor.NONE

  unknownString = unknownString.toLowerCase()

  if (unknownString === "none" || unknownString === "undefined" || unknownString === "") {
    vendor = ComfyVendor.NONE
  }
  else if (unknownString === "huggingface" || unknownString === "hugging_face") {
    vendor = ComfyVendor.HUGGINGFACE
  }
  else if (unknownString === "replicate") {
    vendor = ComfyVendor.REPLICATE
  } else {
    vendor = ComfyVendor.NONE
  }
  return vendor
}