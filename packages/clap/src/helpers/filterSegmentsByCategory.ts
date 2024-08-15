import { parseClap } from "@/io/parseClap"
import { serializeClap } from "@/io/serializeClap"
import { ClapProject, ClapSegmentCategory } from "@/types"

/**
 * Filter segments by category
 * 
 * You can choose a mode, to either INCLUDE or EXCLUDE
 * 
 * The original is NOT modifed by default, unless you set: `modifyOriginal: true`
 * which will clone the whole clap project
 */
export async function filterSegmentsByCategory({
  clap,
  modifyOriginal,
  mode,
  categories
}: {
  clap: ClapProject
  modifyOriginal?: boolean
  mode: "INCLUDE" | "EXCLUDE"
  categories: Record<ClapSegmentCategory, boolean>
}): Promise<ClapProject> {

  if (!modifyOriginal) {
    const tmp = await serializeClap(clap)
    const newClap = await parseClap(tmp)
    return filterSegmentsByCategory({
      clap: newClap,
      modifyOriginal: true,
      mode,
      categories,
    })
  }

  if (mode === "INCLUDE") {
    clap.segments = clap.segments.filter(segment => (
      typeof categories[segment.category] === "boolean"
       ? categories[segment.category]
       : false
     ))
  } else if (mode === "EXCLUDE") {
    clap.segments = clap.segments.filter(segment => (
      typeof categories[segment.category] === "boolean"
       ? !categories[segment.category]
       : true
     ))
  } else {
    throw new Error(`unsupported mode "${mode}"`)
  }

  return clap
}
