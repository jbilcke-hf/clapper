import { ClapProject, fetchClap, isValidNumber, serializeClap } from "@aitube/clap"
import queryString from "query-string"

import { aitubeApiUrl } from "@/constants/config"
import { ClapCompletionMode } from "@/constants/types"
import { applyClapCompletion } from "@/utils"

export async function editClapStory({
  clap,
  prompt,
  startTimeInMs,
  endTimeInMs,
  completionMode = ClapCompletionMode.MERGE,
  turbo = false,
  token,
}: {
  // A ClapProject instance
  clap: ClapProject

  // a prompt to describe how to extend the story (optional)
  prompt?: string

  // indicates where the completion should start in the timeline
  //
  // this can be used tp jump to arbitrary timestamps
  // in the story
  //
  // if you pick a start time AFTER the current project's end time,
  // the project will be extended
  //
  // default value: the current project's end time
  startTimeInMs?: number

  // it is recommended to use a
  // end time (eg. startTimeInMs + 12000)
  // if left by default, th server will generate
  //
  // for performance and security reasons,
  // the server may enforce a hardcoded limit to bypass what you
  // set here, but that is not a big deal because you can pass
  // you .clap file again if necessary
  //
  // default value: no limit (the server will set one)
  endTimeInMs?: number

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

  if (!clap) { throw new Error(`please provide a clap to extend`) }
  
  const hasToken = typeof token === "string" && token.length > 0

  const params: Record<string, any> = {}

  if (typeof completionMode === "string") {
    params.c = completionMode
  }

  if (typeof prompt === "string" && prompt.length > 0) {
    params.p = prompt
  }

  if (isValidNumber(startTimeInMs)) {
    params.s = startTimeInMs
  }

  if (isValidNumber(endTimeInMs)) {
    params.e = endTimeInMs
  }

  if (turbo) {
    params.t = "true"
  }

  const newClap = await fetchClap(
    `${aitubeApiUrl}edit/story?${queryString.stringify(params)}`, {
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

  const result = await applyClapCompletion(clap, newClap, completionMode)

  return result
}