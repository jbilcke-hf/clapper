import { ClapProject } from "@/types"
import { parseClap } from "@/io/parseClap"

export async function fetchClap(url: string, {
  method = "GET",
  body,
  headers,
  cache,
}: {
  method?: string
  body?: BodyInit | null
  headers?: HeadersInit
  cache?: RequestCache
} = {
  method: "GET"
}): Promise<ClapProject> {

  const res = await fetch(url, {
    method,
    headers,
    body,
    cache,
  })

  const blob = await res.blob()

  const clap = await parseClap(blob)
  
  return clap
}