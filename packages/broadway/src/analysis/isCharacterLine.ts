

// /!\ This whole file was generated with GPT-4

import { analyzeLine } from "@/analysis/analyzeLine"
import { parseCharacterName } from "@/analysis/parseCharacterName"

import { isAllCaps } from "@/utils/isAllCaps"

/**
 * Check whether the given line contains a character dialogue or action bitmap.
 * @param fullLine the line to check. Might contain spaces.
 */
export function isCharacterLine(fullLine: string): boolean {
 
  const containsTabulation = fullLine.startsWith("            ")
  
  // disabled, because some character line include things like parenthesis
  // if (fullLine.match(/\([^\)]+\)/)) {
  //  return false
  // }

  // this rule is a bit strict as some text files don't have tabulation..
  // but it helps A LOT
  if (!containsTabulation) {
    return false
  }

  // the fullLine is important and useful (to locate characters, highlight etc)
  // however it might not be a reliable indicated, so we use uppercase
  const line = fullLine.trim()

  const { isTransition, isSceneDescription, timeType, locationType } = analyzeLine(line)


  const character = parseCharacterName(line)

  // doesn't look like a character name, after filtering
  if (!character) {
   return false
  }

  // console.log("isAllCaps?", isAllCaps(line))
  if (
    line.length < 2 || // line is too short to be a character
    !isAllCaps(line) // line is not all uppercase
    ) {
    // console.log("FAIL 1")
    return false
  }

  if (
    isTransition || // nope, that's a transition or scene
    isSceneDescription
    ) {
    // console.log("FAIL 2")
    return false
  }

  if (
    locationType !== "UNKNOWN" ||
    timeType !== "UNKNOWN"
    ) {
    // console.log("FAIL 3")
    return false
  }

  // nah, it's juste someone shouting
  if (line.includes("!")) {
    return false
  }

  if (
    line === "NO" || line === "NO." ||
    line === "YES" || line === "YES." ||
    line === "STOP" || line === "STOP." 
  ) {
    return false
  }

  const lineWithSpace = ` ${line} `
  if (
    lineWithSpace.includes(" INSERT ") ||
    lineWithSpace.includes(" POV ") ||
    lineWithSpace.includes(" CLOSE-UP ")
  ) {
    return false
  }

  return true
}
