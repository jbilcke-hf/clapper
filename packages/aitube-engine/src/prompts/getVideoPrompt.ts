import { ClapEntity, ClapOutputType, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { deduplicatePrompt } from "@/utils/deduplicatePrompt"
import { getCharacterPrompt } from "@/prompts/getCharacterPrompt"

import { segmentCategoryPromptPriority } from "./priorities"

/**
 * Construct a video prompt from a list of active segments
 * 
 * @param segments 
 * @returns 
 */
export function getVideoPrompt(
  segments: ClapSegment[] = [],
  entitiesIndex: Record<string, ClapEntity> = {},
  extraPositivePrompt: string[] = [],
  debug: boolean = false,
): string {

  // console.log("entitiesIndex:", entitiesIndex)


  // to construct the video we need to collect all the segments describing it
  // we ignore unrelated categories (music, dialogue) or non-prompt items (eg. an audio sample)
  const tmp = segments
    .filter(({ category, outputType }) => {
      if (outputType === ClapOutputType.AUDIO) {
        return false
      }

      if (
        category === ClapSegmentCategory.STORYBOARD ||
        category === ClapSegmentCategory.CHARACTER ||
        category === ClapSegmentCategory.LOCATION ||
        category === ClapSegmentCategory.TIME ||
        category === ClapSegmentCategory.ERA || // <- @deprecated
        category === ClapSegmentCategory.DIALOGUE ||
        category === ClapSegmentCategory.LIGHTING ||
        category === ClapSegmentCategory.WEATHER ||
        category === ClapSegmentCategory.ACTION ||
        category === ClapSegmentCategory.STYLE ||
        category === ClapSegmentCategory.CAMERA ||
        category === ClapSegmentCategory.GENERIC
      ) {
        return true
      }
      return false
    })

  // this step is *SUPER* important, it determines the order of the prompt!
  tmp.sort((segment1, segment2) => {
    const priority1 = segmentCategoryPromptPriority[segment1.category || segmentCategoryPromptPriority.generic] || 0
    const priority2 = segmentCategoryPromptPriority[segment2.category || segmentCategoryPromptPriority.generic] || 0
    
    return priority2 - priority1
  })

  // to prevent re-injecting the same entity multiple times in the same video prompt
  const alreadyUsedEntities: Record<string, boolean> = {}

  let videoPrompt = tmp.map(segment => {
    const entityId = segment?.entityId || ""
    const entity: ClapEntity | undefined = entitiesIndex[entityId] || undefined
    
    if (alreadyUsedEntities[entityId]) { return "" }

    alreadyUsedEntities[entityId] = true

    if (segment.category === ClapSegmentCategory.DIALOGUE) {

      // if we can't find the entity, then we are unable
      // to make any assumption about the gender, age or appearance
      if (!entity) {
        // console.log("ERROR: this is a dialogue, but couldn't find the entity!")
        return `photo portrait of a person speaking, bokeh`
      }


      const characterPrompt = getCharacterPrompt(entity)

      // in the context of a video, we some something additional:
      // we create a "bokeh" style
      return `photo portrait of a ${characterPrompt}, bokeh`
      
    } else if (segment.category === ClapSegmentCategory.LOCATION) {
  
      // if we can't find the location's entity, we default to returning the prompt
      if (!entity) {
        // console.log("ERROR: this is a location, but couldn't find the entity!")
        return segment.prompt
      }

      return entity.description
    } else {
      return segment.prompt
    }
  }).map(x => x.trim()).filter(x => x)

  videoPrompt = videoPrompt.concat([
    ...extraPositivePrompt
  ])

  return deduplicatePrompt(videoPrompt.join(", ").trim())
}