import { ClapEntity, ClapSegment, ClapSegmentCategory } from "@aitube/clap"

import { getCharacterPrompt } from "./getCharacterPrompt"

/**
 * Recoonstruct an audio background from a list of active segments.
 * 
 * This uses the ACTION, WEATHER and LOCATION fields to determine a prompt.
 * 
 * This is useful for cases where we don't have a SOUND
 * (eg. create a background audio track)
 * 
 * @param segments 
 * @returns 
 */
export function getBackgroundAudioPrompt(
  segments: ClapSegment[] = [],
  extraPositivePrompt: string[] = [] // "clear sound, high quality" etc
): string {
  return segments
    .filter(({ category }) => (
      category === ClapSegmentCategory.ACTION ||
      category === ClapSegmentCategory.WEATHER ||
      category === ClapSegmentCategory.LOCATION
    ))
    .sort((a, b) => b.label.localeCompare(a.label))
    .map(segment => {
      const p = segment.prompt.toLocaleLowerCase()

      // since we are including the ACTION category, we might have some
      // things like "he says:" which can create bad sound effects
      // with random, weird garbled voices etc
      // so we typically want to prune that
      if (p.includes('talk') || p.includes('speak') || p.includes('voice') || p.includes('says') || p.includes('shout')) {
        return ''
      }
      return segment.prompt
    })
    .filter(x => x)
    .concat([ ...extraPositivePrompt ])
    .join(". ")
}