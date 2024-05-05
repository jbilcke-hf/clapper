import { ClapProject, fetchClap, serializeClap } from "@aitube/clap"
import queryString from "query-string"

import { aitubeApiUrl } from "@/constants/config"

import { ClapCompletionMode, ClapEntityPrompt } from "../constants/types"

export async function editClapEntities({
  clap,
  entityPrompts = [],
  completionMode = ClapCompletionMode.MERGE,
  token,
}: {
  // A ClapProject instance
  clap: ClapProject

  // a list of entity prompts
  entityPrompts: ClapEntityPrompt[],

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

  if (!clap) { throw new Error(`please provide a clap to extend`) }
  
  const hasToken = typeof token === "string" && token.length > 0

  const params: Record<string, any> = {}

  if (typeof completionMode === "string") {
    params.c = completionMode === ClapCompletionMode.FULL
      ? "full"
      : "partial"
  }

  if (entityPrompts.length) {
    // if "params.e = JSON.stringify(item)" works with UTF-8 characters,
    // then we don't need to import "js-base64"
    // otherwise you will have to do:
    // params.e = jsBase64.encode(JSON.stringify(item))
    params.e = JSON.stringify(entityPrompts)
  }

  const newClap = await fetchClap(
    `${aitubeApiUrl}edit/entities?${queryString.stringify(params)}`, {
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