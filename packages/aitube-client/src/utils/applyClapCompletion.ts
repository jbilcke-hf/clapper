import { ClapProject, updateClap } from "@aitube/clap"

import { ClapCompletionMode } from ".."

export async function applyClapCompletion(
  existingClap: ClapProject,
  newerClap: ClapProject,
  clapCompletionMode: ClapCompletionMode
): Promise<ClapProject> {
  // in both those mode we leave full control to what is inside "newerClap"
  if (clapCompletionMode === ClapCompletionMode.FULL || clapCompletionMode === ClapCompletionMode.PARTIAL) {
    return newerClap
  }

  // else we are in ClapCompletionMode.MERGE or ClapCompletionMode.REPLACE
  const result = await updateClap(existingClap, newerClap, {
    // the newer clap meta may contain incomplete information
    overwriteMeta: false,
    inlineReplace: clapCompletionMode === ClapCompletionMode.REPLACE
  })

  return result
}