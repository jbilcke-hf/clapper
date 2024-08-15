import { ClapEntity, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { getCharacterPrompt } from "./getCharacterPrompt"

/**
 * Construct an audio background for a voice from a list of active segments
 * 
 * @param segments 
 * @returns 
 */
export function getSpeechBackgroundAudioPrompt(
  segments: ClapSegment[] = [],
  entityIndex: Record<string, ClapEntity> = {},
  extraPositivePrompt: string[] = [] // "clear sound, high quality" etc
): string {
  return segments
    .filter(({ category, outputType }) => (
      category === ClapSegmentCategory.DIALOGUE ||
      category === ClapSegmentCategory.WEATHER ||
      category === ClapSegmentCategory.LOCATION
    ))
    .sort((a, b) => b.label.localeCompare(a.label))
    .map(segment => {
      const entity: ClapEntity | undefined = entityIndex[segment?.entityId || ""] || undefined
      
      if (segment.category === ClapSegmentCategory.DIALOGUE) {
        // if we can't find the entity then we are unable
        // to make any assumption about the gender, age and voice timbre
        if (!entity) {
          return `person, speaking normally`
        }

        const characterPrompt = getCharacterPrompt(entity)

        return `${characterPrompt}, speaking normally`
        
      } else if (segment.category === ClapSegmentCategory.LOCATION) {
        // the location is part of the background noise
        // but this might produce unexpected results - we'll see!
        return segment.prompt
      } else if (segment.category === ClapSegmentCategory.WEATHER) {
        // the weather is part of the background noise
        // here too this might produce weird and unexpected results 🍿
        return segment.prompt
      }
      // ignore the rest
      return ""
    })
    .filter(x => x)
    .concat([ ...extraPositivePrompt ])
    .join(". ")
}