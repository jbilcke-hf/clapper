import { ClapEntity, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { deduplicatePrompt } from "@/utils/deduplicatePrompt"
import { getCharacterPrompt } from "@/prompts/getCharacterPrompt"

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
      if (outputType === "audio") {
        return false
      }

      if (
        category === ClapSegmentCategory.CHARACTER ||
        category === ClapSegmentCategory.LOCATION ||
        category === ClapSegmentCategory.TIME ||
        category === ClapSegmentCategory.ERA || // <- @deprecated
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

  tmp.sort((a, b) => b.label.localeCompare(a.label))

  let videoPrompt = tmp.map(segment => {
    const entity: ClapEntity | undefined = entitiesIndex[segment?.entityId || ""] || undefined
    
    if (segment.category === ClapSegmentCategory.DIALOGUE) {

      // if we can't find the entity, then we are unable
      // to make any assumption about the gender, age or appearance
      if (!entity) {
        // console.log("ERROR: this is a dialogue, but couldn't find the entity!")
        return `portrait of a person speaking, blurry background, bokeh`
      }

      const characterTrigger = entity?.triggerName || ""
      const characterLabel = entity?.label || ""
      const characterDescription = entity?.description || ""
      const dialogueLine = segment?.prompt || ""
     
      const characterPrompt = getCharacterPrompt(entity)

      // in the context of a video, we some something additional:
      // we create a "bokeh" style
      return `portrait of a person speaking, blurry background, bokeh, ${characterPrompt}`
      
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
  }).filter(x => x)

  videoPrompt = videoPrompt.concat([
    ...extraPositivePrompt
  ])

  return deduplicatePrompt(videoPrompt.join(", "))
}