import { ClapProject, fetchClap } from "@aitube/clap"

import { aitubeApiUrl } from "@/constants/config"

import { defaultClapHeight, defaultClapWidth } from "@/constants/defaultValues"

export async function createClap({
  prompt,
  height = defaultClapHeight,
  width = defaultClapWidth,
  turbo = false,
  token,
}: {
  prompt: string
  height?: number
  width?: number
  turbo?: boolean
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
      height,
      turbo,
    }),
    cache: "no-store",
  })

  return clap
}