import { ClapProject, fetchClap } from "@aitube/clap"

import { aitubeApiUrl } from "@/config"

export async function createClap({
  prompt,
  height = 512,
  width = 288,
  token,
}: {
  prompt: string
  height?: number
  width?: number
  token?: string
}): Promise<ClapProject> {
  
  if (typeof prompt !== "string" || !prompt.length) { throw new Error(`please provide a prompt`) }

  const hasToken = typeof token === "string" && token.length > 0

  const clap = await fetchClap(`${aitubeApiUrl}create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...hasToken && {
        "Authorization": `Bearer ${token}`
      }
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