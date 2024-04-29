import { ClapProject, fetchClap, serializeClap } from "@aitube/clap"

import { aitubeApiUrl } from "@/config"

export async function editClapVideos({
  clap,
  token,
}: {
  clap: ClapProject
  token?: string
}): Promise<ClapProject> {

  if (!clap) { throw new Error(`please provide a valid clap project`) }
  
  const hasToken = typeof token === "string" && token.length > 0

  const newClap = await fetchClap(`${aitubeApiUrl}edit/videos`, {
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

  return newClap
}