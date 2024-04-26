import { ClapProject, fetchClap } from "@aitube/clap"

import { aitubeApiUrl } from "@/config"

export async function generateClap({
  prompt = "",
}: {
  prompt: string
}): Promise<ClapProject> {
  if (!prompt) { throw new Error(`please provide a prompt`) }

  // AiTube Stories is nice, but we also need to leave some compute for AiTube Live and AiTube Gaming
  const height = 1024
  const width = 512

  const clap = await fetchClap(`${aitubeApiUrl}generate/story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // TODO pass the JWT so that only the AI Stories Factory can call the API
      // Authorization: `Bearer ${hfApiToken}`,
    },
    body: JSON.stringify({
      prompt,
      width,
      height
    }),
    cache: "no-store",
  })

  return clap
}