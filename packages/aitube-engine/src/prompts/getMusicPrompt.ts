import {  ClapSegment, ClapSegmentCategory } from "@aitube/clap"

export function getMusicPrompt(
  segments: ClapSegment[] = []
): string {
  return segments
    .filter(({ category }) => category === ClapSegmentCategory.MUSIC)
    .sort((a, b) => b.label.localeCompare(a.label))
    .map(({ prompt }) => prompt).filter(x => x)
    .join(". ")
}