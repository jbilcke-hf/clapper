import { ClapProject, fetchClap, serializeClap } from "@aitube/clap"

import { aitubeApiUrl } from "@/config"

export async function extendClap({
  clap,
}: {
  clap: ClapProject
}): Promise<ClapProject> {
  if (!clap) { throw new Error(`please provide a clap to extend`) }

  const extendedClap = await fetchClap(`${aitubeApiUrl}generate/storyboards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-gzip",
      // TODO pass the JWT so that only the AI Stories Factory can call the API
      // Authorization: `Bearer ${hfApiToken}`,
    },
    body: await serializeClap(clap),
    cache: "no-store",
  })

  return extendedClap
}