import queryString from "query-string"
import { ClapCompletionMode, ClapProject, fetchClap, serializeClap, removeGeneratedAssetUrls } from "@aitube/clap"

import { aitubeApiUrl } from "@/constants/config"
import { applyClapCompletion } from "@/utils"

export async function editClapSounds({
  clap,
  completionMode = ClapCompletionMode.MERGE,
  turbo = false,
  token,
}: {
  clap: ClapProject
  
  /**
   * Completion mode (optional, defaults to "merge")
   * 
   * Possible values are:
   * - full: the API and the client will return a full clap file. This is a very convenient and simple mode, but it is also very ineficient, so it should not be used for intensive applications.
   * - partial: the API and the client will return a partial clap file, containing only the new values and changes. This is useful for real-time applications and streaming.
   * - merge: the API will return a partial clap file, and the client will return a merge of the original with the new values. This is safe to run, there are no side-effects.
   * - replace: the API will return a partial clap file, and the client will replace the original. This is the most efficient mode, but it relies on side-effects and inline object updates. 
   */
  completionMode?: ClapCompletionMode

  turbo?: boolean

  token?: string
}): Promise<ClapProject> {

  if (!clap) { throw new Error(`please provide a valid clap project`) }
  
  const hasToken = typeof token === "string" && token.length > 0

  const params: Record<string, any> = {}

  if (typeof completionMode === "string") {
    params.c = completionMode
  }

  if (turbo) {
    params.t = "true"
  }

  const newClap = await fetchClap(`${aitubeApiUrl}edit/sounds?${queryString.stringify(params)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-gzip",
      ...hasToken && {
        "Authorization": `Bearer ${token}`
      }
    },
    body: await serializeClap(removeGeneratedAssetUrls(clap)),
    cache: "no-store",
  })

  const result = await applyClapCompletion(clap, newClap, completionMode)

  return result
}