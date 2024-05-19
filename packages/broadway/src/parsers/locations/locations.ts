

// TODO use a transition type for the values, to avoid mistakes

import { ScreenplaySequenceType } from "@/constants/screenplaySequences"

// TODO: those need to be prefixed by space to avoid false positives
export const locationTypes: Record<string, ScreenplaySequenceType> = {
  "INT.": "INTERIOR",
  "INT": "INTERIOR",
  "INT-": "INTERIOR",
  "EXT.": "EXTERIOR",
  "EXT": "EXTERIOR",
  "EXT-": "EXTERIOR",
  "INT./EXT.": "INT./EXT.",
  "EXT./INT." : "INT./EXT.",
  "INT/EXT" : "INT./EXT.",
  "EXT/INT": "INT./EXT.",
  "FLASHBACK": "INT./EXT."
}
