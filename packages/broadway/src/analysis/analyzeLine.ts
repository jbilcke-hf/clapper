

// TODO use a transition type for the values, to avoid mistakes

import { ScreenplaySequenceTime, screenplaySequenceTimes, ScreenplaySequenceType } from "@/constants/screenplaySequences"
import { locationTypes } from "@/parsers/locations/locations"
import { transitions } from "@/parsers/transitions/transitions"

export function analyzeLine(originalLine: string): {
  isTransition: boolean
  isSceneDescription: boolean
  transitionType: string // TODO use a TS type here
  locationName: string
  locationType: ScreenplaySequenceType
  timeType: ScreenplaySequenceTime
} {
  let line = ` ${originalLine.trim().replace('\r', '').toUpperCase()} `

  // the first part of the line might be a number - we remove this
  line = line.replaceAll(/^(\s*\d+)[^\d]/gi, " ")
  
  // the last part of the line might be also a number - we remove this too
  line = line.replaceAll(/[^\d](\d+\s*)$/gi, " ")
  
  let isTransition = false
  let isSceneDescription = false

  let locationType: ScreenplaySequenceType = "UNKNOWN"
  for (const [key, value] of Object.entries(locationTypes)) {

    // here we wrap the key with spaces, to avoid false positive (as "INT" might be part of a word etc)
    const pattern = ` ${key} `

    if (line.includes(pattern)) {
      locationType = value // we use the *value*
      
      isTransition = true // contribute to the heuristic
      isSceneDescription = true

      line = line.replaceAll(pattern, "")
      break
    }
  }

  // TODO: use a TS type for the transitions
  let transitionType = "Cut to"
  for (const [pattern, value] of Object.entries(transitions)) {
    if (line.includes(pattern)) {
      transitionType = value // we use the *value*

      // so, actually "cut to" might not be e
      isTransition = true // contribute to the heuristic

      line = line.replaceAll(pattern, "")
      break
    }
  }

  // TODO: we should change the code to be able to match different ways of writing each sequence time
  let timeType: ScreenplaySequenceTime = "UNKNOWN"
  for (const [pattern, value] of Object.entries(screenplaySequenceTimes)) {
    if (line.includes(pattern)) {
      timeType = pattern as ScreenplaySequenceTime // we use the *key*

      // we don't contribute to the heuristic here,
      // because having a line merely mentioning "day", "night" or "noon"
      // doesn't mean it is a new transition line

      line = line.replaceAll(pattern, "")
      break
    }
  }

  // remove the 
  const locationName = line
    .replaceAll(":", " ")
    .replaceAll(/ - /gi, " ")
    .replaceAll(/^-/gi, " ")
    .replaceAll(/-$/gi, " ")
    .replaceAll("  ", " ")
    .trim()

  return {
    isTransition,
    isSceneDescription,
    transitionType,
    locationName,
    locationType,
    timeType,
  }
}
