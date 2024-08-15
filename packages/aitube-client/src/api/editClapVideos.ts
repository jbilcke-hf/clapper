import queryString from "query-string"
import { ClapCompletionMode, ClapProject, fetchClap, serializeClap, removeGeneratedAssetUrls, ClapSegmentStatus, ClapSegmentCategory, filterSegments, ClapSegmentFilteringMode, ClapSegment } from "@aitube/clap"

import { aitubeApiUrl } from "@/constants/config"
import { applyClapCompletion } from "@/utils"

export async function editClapVideos({
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
  // special trick to not touch the generated
  // storyboards that are used by pending videos
  const idsOfStoryboardsToKeep = clap.segments.map(segment => {
    
    const isPendingVideo = (
      segment.category === ClapSegmentCategory.VIDEO
      &&
      segment.status === ClapSegmentStatus.TO_GENERATE
    )

    if (!isPendingVideo) { return undefined }

    const storyboard: ClapSegment | undefined = filterSegments(
      ClapSegmentFilteringMode.BOTH,
      segment,
      clap.segments,
      ClapSegmentCategory.STORYBOARD
    ).at(0)

    return storyboard?.id
  }).filter(x => x) as string[]

  const newClap = await fetchClap(`${aitubeApiUrl}edit/videos?${queryString.stringify(params)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-gzip",
      ...hasToken && {
        "Authorization": `Bearer ${token}`
      }
    },
    body: await serializeClap(
      // need a special trick here, to not touch the generated
      // storyboards that are used by pending videos
      removeGeneratedAssetUrls(clap, idsOfStoryboardsToKeep)
    ),
    cache: "no-store",
  })

  const result = await applyClapCompletion(clap, newClap, completionMode)

  return result
}