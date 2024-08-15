import { newClap } from "@/factories/newClap"
import { serializeClap } from "@/io/serializeClap"

let globalState: {
  blob?: Blob
} = {
  blob: undefined
}

export async function getEmptyClap(): Promise<Blob> {
  if (globalState.blob) { return globalState.blob }

  const clap = newClap()

  globalState.blob = await serializeClap(clap)

  return globalState.blob
}