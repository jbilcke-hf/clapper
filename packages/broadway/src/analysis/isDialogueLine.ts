

// /!\ This whole file was generated with GPT-4


/**
 * Check whether the given line contains a character dialogue or action bitmap.
 * @param fullLine the line to check. Might contain spaces.
 */
export function isDialogueLine(fullLine: string): boolean {
 
  const containsTabulation = fullLine.startsWith("        ")
  
  // this rule is a bit strict as some text files don't have tabulation..
  // but it helps A LOT
  if (!containsTabulation) {
    return false
  }

  return true
}
