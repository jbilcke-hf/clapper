import { ClapProject, serializeClap, blobToDataUri } from "@aitube/clap"

import { aitubeApiUrl } from "@/config"

export async function exportClap({
  clap,
}: {
  clap: ClapProject
}): Promise<string> {
  if (!clap) { throw new Error(`please provide a clap`) }

  // remember: a space needs to be public for the classic fetch() to work
  const res = await fetch(`${aitubeApiUrl}generate/video`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-gzip",
      // TODO pass the JWT so that only the AI Stories Factory can call the API
      // Authorization: `Bearer ${hfApiToken}`,
    },
    body: await serializeClap(clap),
    cache: "no-store",
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
  })

  const blob = await res.blob()

  const dataURL = await blobToDataUri(blob)
  
  return dataURL
}