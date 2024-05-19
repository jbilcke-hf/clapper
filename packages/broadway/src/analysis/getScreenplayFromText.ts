import { UUID } from "@aitube/clap"

import { analyzeLine } from "@/analysis/analyzeLine"
import { Screenplay, ScreenplaySequence } from "@/types"
import { parseScenes } from "@/analysis/parseScenes"


/**
 * This function splits the full text into scenes, but doesn't perform any deep analysis
 * 
 * @param fullText 
 * @returns 
 */
export async function getScreenplayFromText(fullText: string): Promise<Screenplay> {
  const lines = fullText.replace("\n", "    ").split(/\n/gi)

  // TODO: use this
  // const lines = fullText.split(/\r?\n/)

  const sequences: ScreenplaySequence[] = []

  let pendingTransition = "Cut to"
  let startedAt = 0
  let textBuffer = ''
  let lineNumberBuffer = 0

  lines.forEach((line, lineNumber) => {
    line = line.replaceAll("\r", "")// .trim()

    // if (lineNumber < 25) { return }
    // use this if you need to debug something
  //  if (lineNumber > 200) { return }

    // we are just going to the next page... normally
    if (line.match(/^\d+\.$/)) {
      return
    }

    const { isTransition, isSceneDescription, timeType, transitionType, locationName, locationType } = analyzeLine(line)

    // in some screenplay, there is a line like: "     Cut to:"
    // before the actual transition takes place
    if (isTransition && transitionType) {
      pendingTransition = transitionType
    }

    // can't add the scene to the sequence if it's invalid
    if (!isSceneDescription) {

      // console.log("LINE:", { line })
      lineNumberBuffer = lineNumber
      textBuffer += `${line}\n`
  
      return
    }

    //  console.log("DEBUG:",  { line, isTransition, timeType, transitionType, locationName, locationType })

    // important: we fill in the buffer!
    const previousSequence = sequences.at(-1)
    if (previousSequence) {
      previousSequence.fullText = `${textBuffer}`
      previousSequence.endAtLine = lineNumberBuffer
    }

    lineNumberBuffer = lineNumber
    textBuffer = `${line}\n`

    sequences.push({
      id: UUID(),
      location:
        locationName ? [locationName] :
        previousSequence ? previousSequence.location :
        ["Unknown location"],
      type:
        locationType !== "UNKNOWN" ? locationType :
        previousSequence ? previousSequence.type :
        "UNKNOWN",
      time:
        timeType !== "UNKNOWN" ? timeType :
        previousSequence ? previousSequence.time :
        "UNKNOWN",
      transition:
        transitionType ? transitionType : pendingTransition,
      fullText: "",
      startAtLine: lineNumber,
      endAtLine: lineNumber,
      scenes: [],
    })
  })

  const lastSequence = sequences.at(-1)
  if (lastSequence) {
    lastSequence.fullText = `${textBuffer}\n`
    lastSequence.endAtLine = lineNumberBuffer
  }

  // now we have clearly identified sequences, we need to extract the scenes
  for (const sequence of sequences) {
    sequence.scenes = parseScenes(sequence)
  }

  return {
    fullText,
    sequences,
  }
}
