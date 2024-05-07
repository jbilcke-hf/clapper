import {  ClapSegment, ClapSegmentCategory } from "@aitube/clap"

/**
 * Construct an audio foreground for a voice from a list of active segments
 * 
 * This is the "dialogue" prompt, ie. the actual spoken words,
 * so we don't need to do anything fancy here, we only use the raw text
 * 
 * @param segments 
 * @returns 
 */
export function getSpeechForegroundAudioPrompt(
  segments: ClapSegment[] = []
): string {
  return segments
    .filter(({ category }) => category === ClapSegmentCategory.DIALOGUE)
    .sort((a, b) => b.label.localeCompare(a.label))
    .map(({ prompt }) => prompt).filter(x => x)
    .join(". ")
}