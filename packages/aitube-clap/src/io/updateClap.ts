import { ClapEntity, ClapProject, ClapScene, ClapSegment } from "@/types"
import { newClap } from "@/factories/newClap"

/**
 * This function takes two clap projects (an old and a newer one) and merge them.
 * 
 * The most common use case is when we generate a Clap project in multiple steps,
 * sending only partial results over the wire to preserve bandwidth and compute time.
 * 
 * The new clap can either be partial (should be the preferred use case), or full.
 * If the new clap is a full one, then you will get ID collions (overlapping).

 * A simple rule is used when that happen: newer content will overwrite older content.
 * 
 * @param existingClap 
 * @param newerClap
 */
export async function updateClap(existingClap: ClapProject, newerClap: ClapProject, {
  inlineReplace = false
}: {
  // Whether to replace the existing clap "inline" or not. Defaults to false.
  //
  // true: the function will have side effects as the existing clap will be modified and returned
  // false: the function will have no side effects, the existing clap will be untouched and instead a new object will be created.
  //
  // Depending on your code architecture or use case,
  // you will either want the version with or without the side effects
  // but keep in mind that Clap files can get large (in megabytes or even gigabytes)
  // and you may have to switch to the inline mode for performance reasons
  inlineReplace?: boolean
} = {
  inlineReplace: false
}): Promise<ClapProject> {

  const clap = inlineReplace ? existingClap : newClap()

  for (const [metaFieldKey, metaFieldValue] of Object.entries(newerClap.meta)) {
    (clap.meta as any)[metaFieldKey] = metaFieldValue
  }

  // create some temporary indexes for faster checking
  const existingEntityIndex: Record<string, ClapEntity> = {}
  for (const entity of existingClap.entities) {
    existingEntityIndex[entity.id] = entity
  }
  
  const existingSceneIndex: Record<string, ClapScene> = {}
  for (const scene of existingClap.scenes) {
    existingSceneIndex[scene.id] = scene
  }
  
  const existingSegmentIndex: Record<string, ClapSegment> = {}
  for (const segment of existingClap.segments) {
    existingSegmentIndex[segment.id] = segment
  }

  // we replace all the data
  for (const entity of newerClap.entities) {
    if (existingEntityIndex[entity.id]) {
      existingEntityIndex[entity.id] = {
        ...existingEntityIndex[entity.id],
        ...entity
      }
    } else {
      existingEntityIndex[entity.id] = entity
    }
  }
  
  for (const scene of newerClap.scenes) {
    if (existingSceneIndex[scene.id]) {
      existingSceneIndex[scene.id] = {
        ...existingSceneIndex[scene.id],
        ...scene
      }
    } else {
      existingSceneIndex[scene.id] = scene
    }
  }

  for (const segment of newerClap.segments) {
    if (existingSegmentIndex[segment.id]) {
      existingSegmentIndex[segment.id] = {
        ...existingSegmentIndex[segment.id],
        ...segment
      }
    } else {
      existingSegmentIndex[segment.id] = segment
    }
  }

  // sort by ascending line
  clap.scenes.sort((a, b) => a.startAtLine - b.startAtLine)
  
  // sort by ascending start time
  // in case of equivalent time (which happens a lot) we sort by ascending track number
  clap.segments.sort((a, b) => {
    if (a.startTimeInMs === b.startTimeInMs) {
      return a.track - b.track
    } else {
      return a.startTimeInMs - b.startTimeInMs
    }
  })
  
  // we re-create the entity index
  // create some temporary indexes for faster checking
  for (const entity of clap.entities) {
    clap.entityIndex[entity.id] = entity
  }

  return clap
}