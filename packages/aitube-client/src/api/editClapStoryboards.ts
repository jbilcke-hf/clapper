import { ClapProject, fetchClap, serializeClap } from "@aitube/clap"

import { aitubeApiUrl } from "@/config"
import { ClapCompletionMode } from "./types"

export async function editClapStoryboards({
  clap,
  completionMode = ClapCompletionMode.MERGE,
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

  token?: string
}): Promise<ClapProject> {

  if (!clap) { throw new Error(`please provide a valid clap project`) }
  
  const hasToken = typeof token === "string" && token.length > 0

  const newClap = await fetchClap(`${aitubeApiUrl}edit/storyboards${
    typeof completionMode === "string"
    ? `?c=${
        completionMode === ClapCompletionMode.FULL
        ? "full"
        : "partial"
      }`
    : ""
  }`, {
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