import { ComfyIcuAccelerator } from "@aitube/clapper-services"

export function parseComfyIcuAccelerator(input: any, defaultAccelerator?: ComfyIcuAccelerator): ComfyIcuAccelerator {
  
  let unknownString = `${input || ""}`.trim()

  // the "normal" case
  if (Object.values(ComfyIcuAccelerator).includes(unknownString as ComfyIcuAccelerator)) {
    return unknownString as ComfyIcuAccelerator
  }

  let accelerator: ComfyIcuAccelerator = defaultAccelerator || ComfyIcuAccelerator.T4

  unknownString = unknownString.toLowerCase()

  if (unknownString === "none" || unknownString === "undefined" || unknownString === "") {
    accelerator = ComfyIcuAccelerator.L4
  }
  else if (unknownString === "l4") {
    accelerator = ComfyIcuAccelerator.L4
  }
  else if (unknownString === "t4") {
    accelerator = ComfyIcuAccelerator.T4
  }
  else if (unknownString === "a10") {
    accelerator = ComfyIcuAccelerator.A10
  }
  else if (unknownString === "a100_40gb") {
    accelerator = ComfyIcuAccelerator.A100_40GB
  }
  else if (unknownString === "a100_80gb") {
    accelerator = ComfyIcuAccelerator.A100_80GB
  }
  else if (unknownString === "a100") {
    accelerator = ComfyIcuAccelerator.A100_40GB
  }
  else if (unknownString === "h100") {
    accelerator = ComfyIcuAccelerator.H100
  } else {
    accelerator = ComfyIcuAccelerator.L4
  }
  return accelerator
}