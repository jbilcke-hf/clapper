import queryString from "query-string"
import { ClapProject, serializeClap, blobToDataUri } from "@aitube/clap"

import { aitubeApiUrl } from "@/constants/config"
import { defaultExportFormat, SupportedExportFormat } from "@/constants"


export async function exportClapToVideo({
  clap,
  format = defaultExportFormat,
  turbo = false,
  token,
}: {
  clap: ClapProject

  /**
   * Desired output video format (defaults to "mp4")
   * 
   * Can be either "mp4" or "webm"
   */
  format?: SupportedExportFormat

  turbo?: boolean

  token?: string
}): Promise<string> {
  
  if (!clap) { throw new Error(`please provide a clap`) }

  // TODO use an enum instead, and check the enum object
  if (format !== "mp4" && format !== "webm") { throw new Error(`please provide a valid format ("${format}" is unrecognized)`) }

  const params: Record<string, any> = {}

  params.f = format

  if (turbo) {
    params.t = "true"
  }

  const hasToken = typeof token === "string" && token.length > 0

  const res = await fetch(`${aitubeApiUrl}export?${queryString.stringify(params)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-gzip",
      ...hasToken && {
        "Authorization": `Bearer ${token}`
      }
    },
    body: await serializeClap(clap),
    cache: "no-store",
  })

  const blob = await res.blob()

  const dataURL = await blobToDataUri(blob)
  
  return dataURL
}