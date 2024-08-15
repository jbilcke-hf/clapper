import { ClapSegment, ClapSegmentCategory } from "@aitube/clap"

/**
 * 
 * @param segments 
 * @returns 
 */
export function getSoundPrompt(
  segments: ClapSegment[] = [],
  extraPositivePrompt: string[] = [] // "clear sound, high quality" etc
): string {
  return segments
    .filter(({ category }) => (
      category === ClapSegmentCategory.SOUND
    ))
    .sort((a, b) => b.label.localeCompare(a.label))
    .map(segment => {
      return segment.prompt
    })
    .filter(x => x)
    .concat([ ...extraPositivePrompt ])
    .join(". ")
}