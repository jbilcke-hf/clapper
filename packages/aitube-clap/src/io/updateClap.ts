import { ClapEntity, ClapProject, ClapScene, ClapSegment, ClapSegmentStatus } from "@/types"
import { newClap } from "@/factories/newClap"

function clone<T>(input: T): T {
  try {
    return JSON.parse(JSON.stringify(input))
  } catch (err) {
    return input
  }
}
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
  overwriteMeta = false,
  inlineReplace = false
}: {
  // Whether to overwrite the meta or not. Defaults to false.
  overwriteMeta?: boolean

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

  const clap: ClapProject = inlineReplace ? existingClap : newClap()


  // create some temporary indexes for faster checking
  const existingEntityIndex: Record<string, ClapEntity> = {}
  for (const entity of existingClap.entities) {
    if (inlineReplace) {
      existingEntityIndex[entity.id] = entity
    } else {
      clap.entities.push(existingEntityIndex[entity.id] = entity)
    }
  }
  
  const existingSceneIndex: Record<string, ClapScene> = {}
  for (const scene of existingClap.scenes) {
    if (inlineReplace) {
      existingSceneIndex[scene.id] = scene
    } else {
      clap.scenes.push(existingSceneIndex[scene.id] = scene)
    }
  }
  
  const existingSegmentIndex: Record<string, ClapSegment> = {}
  for (const segment of existingClap.segments) {
    if (inlineReplace) {
      
      existingSegmentIndex[segment.id] = segment
    } else {
      clap.segments.push(existingSegmentIndex[segment.id] = segment)
    }
  }

  // we replace all the data that is not "completed"
  for (const entity of newerClap.entities) {
    if (existingEntityIndex[entity.id]) {
      // we only overwrite entities without a valid imageId or audioId
      // otherwise during parallel execution, we would overwrite entities with old data
      if (!existingEntityIndex[entity.id].imageId || !existingEntityIndex[entity.id].audioId) {
        Object.assign(existingEntityIndex[entity.id], entity)
      }
    } else {
      clap.entities.push(existingEntityIndex[entity.id] = entity)
    }
  }
  
  for (const scene of newerClap.scenes) {
    if (existingSceneIndex[scene.id]) {
      Object.assign(existingSceneIndex[scene.id], scene)
    } else {
      clap.scenes.push(existingSceneIndex[scene.id] = scene)
    }
  }

  for (const segment of newerClap.segments) {
    if (existingSegmentIndex[segment.id]) {
      // we only overwrite segments that are not completed
      // otherwise we would have issue during parallel execution,
      // older empty data would be used to update the segments
      if (existingSegmentIndex[segment.id].status !== ClapSegmentStatus.COMPLETED) {
        Object.assign(existingSegmentIndex[segment.id], segment)
      }

      // note: sometimes a segment is marked as "completed" but is actually
      // empty when it comes to the assetUrl.. that is perfectly fine!
      // it just means that its value is held somewhere else, and that we shouldn't touch it
    } else {
      clap.segments.push(existingSegmentIndex[segment.id] = segment)
    }
  }

  // sort by ascending line
  clap.scenes = clap.scenes.sort((a, b) => a.startAtLine - b.startAtLine)
  
  // sort by ascending start time
  // in case of equivalent time (which happens a lot) we sort by ascending track number
  clap.segments = clap.segments.sort((a, b) => {
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

  clap.meta = overwriteMeta ? clone(newerClap.meta) : clone(existingClap.meta)

  return clap
}