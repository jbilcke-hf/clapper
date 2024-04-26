
import { ClapProject } from "@/types"
import { serializeClap } from "@/io/serializeClap"
import { blobToDataUri } from "@/converters/blobToDataUri"

export async function clapToDataUri(clap: ClapProject): Promise<string> {
  const archive = await serializeClap(clap)
  const dataUri = await blobToDataUri(archive, "application/x-gzip")
  return dataUri
}